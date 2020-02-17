const qs = require('qs')

export default ($axios) => () => ({
  getProducts(params) {
    return $axios.$get(`/admin/products?${qs.stringify(params)}`)
  },

  getProductById(id) {
    return $axios.$get(`/admin/products/${id}`)
  },

  createProduct(formData) {
    return $axios.$post(`/admin/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateProduct(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteProduct(id) {
    return $axios.$delete(`/admin/products/${id}`)
  }
})
