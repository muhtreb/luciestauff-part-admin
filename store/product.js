export const state = () => ({
  products: [],
  pagination: {}
})

export const mutations = {
  setBlogsPosts(state, products) {
    state.products = products
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getProducts({ commit }, params) {
    const response = await this.$productRepository.getProducts(params)
    commit('setBlogsPosts', response.data)
    commit('setPagination', response.meta)
  }
}
