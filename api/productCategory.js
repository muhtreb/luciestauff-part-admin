const qs = require('qs')

export default ($axios) => () => ({
  getProductCategories(params) {
    return $axios.$get(`/admin/products/categories?${qs.stringify(params)}`)
  },

  getProductCategoryById(id) {
    return $axios.$get(`/admin/products/categories/${id}`)
  },

  createProductCategory(formData) {
    return $axios.$post(`/admin/products/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateProductCategory(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/products/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteProductCategory(id) {
    return $axios.$delete(`/admin/products/categories/${id}`)
  }
})
