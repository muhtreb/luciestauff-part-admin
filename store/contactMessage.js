export const state = () => ({
  contactMessages: [],
  pagination: {}
})

export const mutations = {
  setContactMessages(state, contactMessages) {
    state.contactMessages = contactMessages
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getContactMessages({ commit }, params) {
    const response = await this.$contactMessageRepository.getContactMessages(
      params
    )
    commit('setContactMessages', response.data)
    commit('setPagination', response.meta)
  }
}
