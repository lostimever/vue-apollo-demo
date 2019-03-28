<template>
  <div>
    <listItem
			v-for="task of tasks"
			:key="task.id"
			:task="task"
		>
    </listItem>
  </div>
</template>
<script>
import TASKS_ALL from "../graphql/TasksAll.gql";
import listItem from "./listItem"

export default {
  name: "list",
  components: {
    listItem
  },
  props: {
		filter: {
			type: Object,
			default: undefined,
		},
	},
  data () {
    return {
      tasks: [],
    }
  },
  
  apollo: {
    tasks: {
      query: TASKS_ALL,
      variables () {
        return {
          filter: this.filter
        }
      },
      update ({ allTasks }) {
        return allTasks
      }
    }
  }
}
</script>