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

  getContactMessageAnswerByStatus(id, status) {
    return $axios.$get(`/admin/contact_messages/${id}/answer/${status}`)
  },

  updateStatus(id, status) {
    return $axios.$post(`/admin/contact_messages/${id}/status/${status}`, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  sendContactMessageAnswer(id, formData) {
    return $axios.$post(`/admin/contact_messages/${id}/answer/send`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
})
