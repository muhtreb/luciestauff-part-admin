export const state = () => ({
  portfolioCategories: [],
  pagination: {}
})

export const mutations = {
  setPortfolioCategories(state, portfolioCategories) {
    state.portfolioCategories = portfolioCategories
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getPortfolioCategories({ commit }) {
    const response = await this.$portfolioCategoryRepository.getPortfolioCategories()
    commit('setPortfolioCategories', response.data)
    commit('setPagination', response.meta)
  }
}
