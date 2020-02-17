const qs = require('qs')

export default ($axios) => () => ({
  getBlogPosts(params) {
    return $axios.$get(`/admin/blog/posts?${qs.stringify(params)}`)
  },

  getBlogPostById(id) {
    return $axios.$get(`/admin/blog/posts/${id}`)
  },

  createBlogPost(formData) {
    return $axios.$post(`/admin/blog/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updateBlogPost(id, formData) {
    formData.append('_method', 'PUT')
    return $axios.$post(`/admin/blog/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteBlogPost(id) {
    return $axios.$delete(`/admin/blog/posts/${id}`)
  }
})
