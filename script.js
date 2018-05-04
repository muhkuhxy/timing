import store from './store.js'

Vue.component('Tasks', {
  methods: {
    changeTask: function (task) {
      this.$store.commit('changeTask', task)
    },
    reset: function () {
      this.tasks.forEach(t => {t.time = 0})
    }
  },
  created: function () {
    this.$store.dispatch('load')
  },
  template: `
    <div>
      <ul>
        <li is="Task" v-for="task in tasks" :task="task" :key="task.text"></li>
      </ul>
      <!--CurrentTask :task="current"></CurrentTask-->
      <NewTask></NewTask>
      <button @click="reset()">Reset</button>
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
    <li class="task" :class="task.active ? 'active' : ''" @click="select(task)">
      {{ task.text }} ({{ this.task.time | minutes }})
    </li>
  `,
  methods: {
    select: function (task) {
      this.$store.commit('changeTask', task)
    }
  },
  filters: {
    minutes: function (value) {
      return Math.floor(value / 60 / 1000);
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

