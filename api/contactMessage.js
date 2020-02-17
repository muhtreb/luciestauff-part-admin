const qs = require('qs')

export default ($axios) => () => ({
  getContactMessages(params) {
    return $axios.$get(`/admin/contact_messages?${qs.stringify(params)}`)
  },

  getContactMessageById(id) {
    return $axios.$get(`/admin/contact_messages/${id}`)
  },

  deleteContactMessage(id) {
    return $axios.$delete(`/admin/contact_messages/${id}`)
  }
})
