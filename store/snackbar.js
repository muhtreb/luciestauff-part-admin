export const state = () => ({
  snackbar: false,
  snackbarColor: null,
  snackbarMessage: '',
  snackbarTimestamp: null
})

export const mutations = {
  setSnackbar(state, snackbar) {
    state.snackbar = snackbar
  },

  setSnackbarTimestamp(state, snackbarTimestamp) {
    state.snackbarTimestamp = snackbarTimestamp
  },

  setSnackbarColor(state, snackbarColor) {
    state.snackbarColor = snackbarColor
  },

  setSnackbarMessage(state, snackbarMessage) {
    state.snackbarMessage = snackbarMessage
  }
}

export const actions = {
  snackbar({ commit }, params) {
    commit('setSnackbar', true)
    commit('setSnackbarTimestamp', new Date().getTime())
    commit('setSnackbarColor', params.snackbarColor)
    commit('setSnackbarMessage', params.snackbarMessage)
  },
  snackbarSuccess({ commit }, message) {
    commit('setSnackbar', true)
    commit('setSnackbarTimestamp', new Date().getTime())
    commit('setSnackbarColor', 'success')
    commit('setSnackbarMessage', message)
  },
  snackbarError({ commit }, message) {
    commit('setSnackbar', true)
    commit('setSnackbarTimestamp', new Date().getTime())
    commit('setSnackbarColor', 'error')
    commit('setSnackbarMessage', message)
  },
  close({ commit }, params) {
    commit('setSnackbar', false)
  }
}
