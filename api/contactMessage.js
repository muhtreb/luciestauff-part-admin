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
  },

  declineContactMessage(id) {
    return $axios.$post(`/admin/contact_messages/${id}/decline`)
  },

  acceptContactMessage(id) {
    return $axios.$post(`/admin/contact_messages/${id}/accept`)
  }
})
