export const state = () => ({
  blogPosts: [],
  pagination: {}
})

export const mutations = {
  setBlogPosts(state, blogPosts) {
    state.blogPosts = blogPosts
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getBlogPosts({ commit }, params) {
    const response = await this.$blogPostRepository.getBlogPosts(params)
    commit('setBlogPosts', response.data)
    commit('setPagination', response.meta)
  }
}
