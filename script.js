var util = {
  msToMin: ms => Math.floor(ms / 1000 / 60),
  load: () => JSON.parse(window.localStorage.getItem('tasks') || '[]'),
  save: (tasks) => window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const store = new Vuex.Store({
  state: {
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
  },
  mutations: {
    load: function (state, tasks) {
      state.tasks = tasks
    },
    changeTask: function (state, task) {
      function activate (newCurrent) {
        newCurrent.active = true
        state.current = {
          text: task,
          started: now
        }
      }
      let now = Date.now()
      let newCurrent = state.tasks.find(x => x.text === task)
      if (state.current) {
        var prev = state.tasks.find(x => x.text === state.current.text)
        prev.time += util.msToMin(now - state.current.started)
        prev.active = false
        if (state.current.text === newCurrent.text) {
          state.current = null
        } else {
          activate(newCurrent)
        }
      } else {
        activate(newCurrent)
      }
      util.save(state.tasks)
    },
    newTask: function (state, task) {
      state.tasks.push({
        text: task,
        time: 0,
        active: false
      })
      util.save(state.tasks)
    }
  }
})

Vue.component('Tasks', {
  methods: {
    changeTask: function (task) {
      this.$store.commit('changeTask', task)
    }
  },
  created: function () {
    this.$store.commit('load', util.load())
  },
  template: `
    <div>
      <NewTask></NewTask>
      <ul>
        <li is="Task" v-for="task in tasks" :task="task" :key="task.text"></li>
      </ul>
      <CurrentTask :task="current"></CurrentTask>
    </div>
  `,
  computed: {
    tasks: function () {
      return this.$store.state.tasks
    },
    current: function () {
      return this.$store.state.current
    }
  }
})

Vue.component('Task', {
  props: ['task'],
  template: `
    <li v-on:click="select(task)">
      {{ task.text }} ({{ task.time }})
      <span v-if="task.active">*</span>
    </li>
  `,
  methods: {
    select: function (task) {
      this.$store.commit('changeTask', task.text)
    }
  }
})

Vue.component('NewTask', {
  template: `<input placeholder="new task" type="text" @keyup.enter="submit" v-model="task">`,
  data: function () {
    return {
      task: ''
    }
  },
  methods: {
    submit: function () {
      this.$store.commit('newTask', this.task)
      this.task = ''
    }
  }
})

Vue.component('CurrentTask', {
  props: ['task'],
  template: `
    <div v-if="task">Currently working on {{ task.text }}</div>
    <div v-else="task">Not working on anything</div>
  `
})

var app = new Vue({
    el: '#app',
    store
})


