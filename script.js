var util = {
  msToMin: ms => Math.floor(ms / 1000 / 60)
}

Vue.component('Tasks', {
  methods: {
    changeTask: function (task) {
      let now = Date.now()
      let newCurrent = this.tasks.find(x => x.text === task)
      if (this.current) {
        var prev = this.tasks.find(x => x.text === this.current.text)
        prev.time += util.msToMin(now - this.current.started)
        prev.active = false
      }
      if (this.current && this.current.text === newCurrent.text) {
        this.current = null
      }
      else {
        newCurrent.active = true
        this.current = {
          text: task,
          started: now
        }
      }
    }
  },
  template: `
    <div>
      <ul>
        <Task v-for="task in tasks" :task="task" v-on:selected="changeTask"></Task>
      </ul>
      <CurrentTask :task="current"></CurrentTask>
    </div>
  `,
  data: function () {
    return {
      tasks: [
        {
          text: 'erstens',
          time: 0,
          active: false
        },
        {
          text: 'zweitens',
          time: 123,
          active: false
        }
      ],
      current: null
    }
  }
})

Vue.component('Task', {
  props: ['task'],
  template: `
    <li v-on:click="$emit('selected', task.text)">
      {{ task.text }} ({{ task.time }})
      <span v-if="task.active">*</span>
    </li>
  `
})

Vue.component('CurrentTask', {
  props: ['task'],
  template: `
    <div v-if="task">Currently working on {{ task.text }}</div>
    <div v-else="task">Not working on anything</div>
  `
})

var app = new Vue({
    el: '#app'
})


