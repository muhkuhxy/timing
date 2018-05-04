const MINUTE = 60 * 1000

const util = {
  load: () => JSON.parse(window.localStorage.getItem('tasks') || '[]'),
  save: (tasks) => window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

export default new Vuex.Store({
  state: {
    tasks: [],
    current: {
      task: null,
      started: null
    }
  },
  actions: {
    load: function ({ commit }) {
      commit('load', util.load())
    },
    tick: function ({ commit, state, dispatch }) {
      window.setTimeout(() => {
        if (state.current.task) {
          commit('updateTime')
          dispatch('tick')
        }
      }, MINUTE)
    }
  },
  mutations: {
    load: function (state, tasks) {
      state.tasks = tasks
      const active = state.tasks.filter(t => t.active)
      if (active.length > 0) {
        this.commit('changeTask', active[0])
      }
    },
    updateTime: function (state) {
      const now = Date.now(),
        elapsed = now - state.current.started
      state.current.task.time += elapsed
      state.current.started = now
      util.save(state.tasks)
    },
    changeTask: function (state, task) {
      const setTitle = task => {
        document.title = 'Tasks - ' + (task ? task.text : 'Not working on anything')
      }
      const stopCurrentTask = () => {
        this.commit('updateTime')
        state.current.task.active = false
        state.current.task = null
      }
      const startTask = task => {
        task.active = true
        state.current.task = task
        state.current.started = Date.now()
        this.dispatch('tick')
      }
      if (!state.current.task) {
        startTask(task)
      } else if (state.current.task === task) {
        stopCurrentTask()
      } else {
        stopCurrentTask()
        startTask(task)
      }
      setTitle(state.current.task)
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
