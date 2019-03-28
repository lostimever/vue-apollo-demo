<template>
  <div>
    <el-checkbox
      v-model="done"
    >
      {{task.label}}
    </el-checkbox>
    <el-button 
      type="primary" 
      icon="el-icon-edit" 
      circle
      @click="openEdit"
    ></el-button>
    <el-button 
      type="danger" 
      icon="el-icon-delete" 
      circle
      @click="deleteTask"
    ></el-button>
  </div>
</template>

<script>
import TASKS_ALL from "../graphql/TasksAll.gql";
import TASKS_UPDATE from '../graphql/TasksUpdate.gql'
import TASKS_DELETE from '../graphql/TasksDelete.gql'
export default {
  data () {
    return {

    }
  },
  props: {
		task: {
			type: Object,
			required: true,
		},
  },
  computed: {
    done: {
      get () {
        return this.task.done
      },
      set (value) {
        this.$apollo.mutate({
          mutation: TASKS_UPDATE,
          variables: {
            ...this.task,
            done: value
          },
          update: ( store, { data: { updateTask } }) => {
            // 从缓存中读取所有数据
            const doneQuery = {
              query: TASKS_ALL,
              variables: { filter: { done: true } }
            }
            const doneData = store.readQuery(doneQuery)

            const undoQuery = {
							query: TASKS_ALL,
							variables: { filter: { done: false } },
						}
						const undoData = store.readQuery(undoQuery)

            let addList
						let removeList

						if (value) {
							addList = doneData.allTasks
							removeList = undoData.allTasks
						} else {
							addList = undoData.allTasks
							removeList = doneData.allTasks
            }
            
            // 将新数据添加到已有数据中
            addList.push(updateTask)

            const index = removeList.findIndex(o => o.id === updateTask.id)
						if (index !== -1) {
							removeList.splice(index, 1)
						}

            // 新数据，写回到内存
            store.writeQuery({ ...doneQuery, data: doneData })
            store.writeQuery({ ...undoQuery, data: undoData })
          },
          optimisticResponse: {
						__typename: 'Mutation',
						updateTask: {
							__typename: 'Task',
							...this.task,
							done: value,
						},
					}
        })
        .then(data => {
          // console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  },
  methods: {
    deleteTask () {
      this.$apollo.mutate({
        mutation: TASKS_DELETE,
        variables: {
          id: this.task.id
        },
        update: (store) => {
          const queries = [
            { query: TASKS_ALL },
            { query: TASKS_ALL, variables: { filter: { done: this.task.done } } }
          ]
          const data = queries.map(query => store.readQuery(query))
          data.forEach(({allTasks: list}) => {
            const index = list.findIndex(o => o.id === this.task.id)
            if (index !== -1) {
              list.splice(index, 1)
            }
          })
          queries.forEach((query, index) => {
            store.writeQuery({
              ...query,
              data: data[index]
            })
          })
        }

      })
      .then(data => {
        // console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
    },
    openEdit () {
      
    }
  }
}
</script>

<style>

</style>
