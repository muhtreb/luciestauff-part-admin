const qs = require('qs')

export default ($axios) => () => ({
  getSettings(params) {
    return $axios.$get(`/admin/settings?${qs.stringify(params)}`)
  },

  getSettingById(id) {
    return $axios.$get(`/admin/settings/${id}`)
  },

  getSettingByKey(key) {
    return $axios.$get(`/admin/settings/${key}`)
  },

  createSetting(formData) {
    return $axios.$post(`/admin/settings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateSetting(key, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/settings/${key}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteSetting(key) {
    return $axios.$delete(`/admin/settings/${key}`)
  }
})
