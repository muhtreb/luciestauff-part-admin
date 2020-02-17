export const state = () => ({
  blogPostCategories: [],
  pagination: {}
})

export const mutations = {
  setBlogPostCategories(state, blogPostCategories) {
    state.blogPostCategories = blogPostCategories
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getBlogPostCategories({ commit }) {
    const response = await this.$blogPostCategoryRepository.getBlogPostCategories()
    commit('setBlogPostCategories', response.data)
    commit('setPagination', response.meta)
  }
}
