const qs = require('qs')

export default ($axios) => () => ({
  getPortfolioCategories(params) {
    return $axios.$get(`/admin/portfolio/categories?${qs.stringify(params)}`)
  },

  getPortfolioCategoryById(id) {
    return $axios.$get(`/admin/portfolio/categories/${id}`)
  },

  getPortfolioCategoryImages(id) {
    return $axios.$get(`/admin/portfolio/categories/${id}/images`)
  },

  createPortfolioCategory(formData) {
    return $axios.$post(`/admin/portfolio/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updatePortfolioCategory(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/portfolio/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deletePortfolioCategory(id) {
    return $axios.$delete(`/admin/portfolio/categories/${id}`)
  }
})
