export const state = () => ({
  products: [],
  pagination: {}
})

export const mutations = {
  setProducts(state, products) {
    state.products = products
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getProducts({ commit }, params) {
    const response = await this.$productRepository.getProducts(params)
    commit('setProducts', response.data)
    commit('setPagination', response.meta)
  }
}
