<template>
  <div>
    <el-input 
      v-model="label" 
      @keyup.enter.native="createTask"
    ></el-input>
    <el-button 
      type="button" 
      @click="createTask"
    >创建</el-button>
    <br>
    <span style="color: red">
      全部信息：
    </span>
    
    <queryList class="todo-list" />
    <span style="color: red">
      未完成：
    </span>
    <queryList class="todo-list" :filter="{ done: false }" />
    <span style="color: red">
      已完成：
    </span>
    <queryList class="todo-list" :filter="{ done: true }" />
    
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import TASKS_ALL from "../graphql/TasksAll.gql";
import TASKS_CREATE from "../graphql/TasksCreate.gql";

import queryList from './queryAll'
export default {
  name: "HelloWorld",
  components: {
    queryList
  },
  data() {
    return {
      label: "",
    }
  },
  validations: {
    label: {
      required
    }
  },
  methods: {
    createTask() {
      if (!this.$v.$invalid) {
        const label = this.label;
        this.label = '';
        try {
          this.$apollo.mutate({
            mutation: TASKS_CREATE,
            variables: {
              label
            },
            update: (store, { data: { createTask } }) => {
              const data = store.readQuery({ query: TASKS_ALL });
              data.allTasks.push(createTask);

              const undoQuery = {
                query: TASKS_ALL,
                variables: { filter: { done: false } },
              }
              const undoData = store.readQuery(undoQuery)
      
              undoData.allTasks.push(createTask);

              //将数据写回内存的时候，需要一起回写
              store.writeQuery({ ...undoQuery, data: undoData });
              store.writeQuery({ query: TASKS_ALL, data });
            },
            optimisticResponse: {
              __typename: "Mutation",
              createTask: {
                __typename: "Task",
                id: null,
                done: false,
                label
              }
            }
          })
          .then(data => {
            // console.log(data)
          })
          .catch(error => {
            console.log(error)
          })
        } catch (e) {
          console.error(e)
					this.label = label
        }
      }
    }
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
