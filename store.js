const MINUTE = 60 * 1000

const util = {
  msToMin: ms => Math.floor(ms / MINUTE),
  load: () => JSON.parse(window.localStorage.getItem('tasks') || '[]'),
  save: (tasks) => window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const store = new Vuex.Store({
  state: {
    tasks: [],
    current: null
  },
  actions: {
    load: function ({ commit }) {
      commit('load', util.load())
    },
    tick: function ({ commit, state, dispatch }) {
      window.setTimeout(() => {
        if (state.current) {
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
        this.commit('changeTask', active[0].text)
      }
    },
    updateTime: function (state) {
      const task = state.tasks.find(x => x.text === state.current.text),
        now = Date.now(),
        elapsed = now - state.current.started
      task.time += util.msToMin(elapsed)
      state.current.started = now
    },
    changeTask: function (state, task) {
      const store = this
      function activate (newCurrent) {
        newCurrent.active = true
        state.current = {
          text: task,
          started: now
        }
        store.dispatch('tick')
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
      document.title = 'Tasks - ' + ((state.current && state.current.text) || 'Not working on anything')
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

export default store
