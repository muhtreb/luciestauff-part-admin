export const state = () => ({
  settings: [],
  pagination: {}
})

export const mutations = {
  setSettings(state, settings) {
    state.settings = settings
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getSettings({ commit }, params) {
    const response = await this.$settingRepository.getSettings(params)
    commit('setSettings', response.data)
    commit('setPagination', response.meta)
  }
}
