export const state = () => ({
  testimonials: [],
  pagination: {}
})

export const mutations = {
  setTestimonials(state, testimonials) {
    state.testimonials = testimonials
  },
  setPagination(state, pagination) {
    state.pagination = pagination
  }
}

export const actions = {
  async getTestimonials({ commit }, params) {
    const response = await this.$testimonialRepository.getTestimonials(params)
    commit('setTestimonials', response.data)
    commit('setPagination', response.meta)
  }
}
