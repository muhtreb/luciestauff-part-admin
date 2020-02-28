const qs = require('qs')

export default ($axios) => () => ({
  getBlogPostCategories(params) {
    return $axios.$get(`/admin/blog/posts/categories?${qs.stringify(params)}`)
  },

  getBlogPostCategoryById(id) {
    return $axios.$get(`/admin/blog/posts/categories/${id}`)
  },

  createBlogPostCategory(formData) {
    return $axios.$post(`/admin/blog/posts/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateBlogPostCategory(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/blog/posts/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteBlogPostCategory(id) {
    return $axios.$delete(`/admin/blog/posts/categories/${id}`)
  },

  upPositionBlogPostCategory(id) {
    return $axios.$post(`/admin/blog/posts/categories/${id}/position/up`)
  },

  downPositionBlogPostCategory(id) {
    return $axios.$post(`/admin/blog/posts/categories/${id}/position/down`)
  }
})
