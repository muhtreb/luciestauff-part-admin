const qs = require('qs')

export default ($axios) => () => ({
  getTestimonials(params) {
    return $axios.$get(`/admin/testimonials?${qs.stringify(params)}`)
  },

  getTestimonialById(id) {
    return $axios.$get(`/admin/testimonials/${id}`)
  },

  createTestimonial(formData) {
    return $axios.$post(`/admin/testimonials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateTestimonial(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteTestimonial(id) {
    return $axios.$delete(`/admin/testimonials/${id}`)
  }
})
