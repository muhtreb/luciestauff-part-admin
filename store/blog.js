export const state = () => ({
  all: []
})

export const mutations = {
  setAll(state, blogPosts) {
    state.all = blogPosts
  }
}

export const actions = {
  async all({ commit }) {
    const response = await this.$blogRepository.getBlogPosts()
    commit('setAll', response.data)
  }
}
