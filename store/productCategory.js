export const state = () => ({
  productCategories: [],
  pagination: {}
})

export const mutations = {
  setProductCategories(state, productCategories) {
    state.productCategories = productCategories
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getProductCategories({ commit }) {
    const response = await this.$productCategoryRepository.getProductCategories()
    commit('setProductCategories', response.data)
    commit('setPagination', response.meta)
  }
}
