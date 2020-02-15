import createBlogRepository from '~/api/blog'

export default (context, inject) => {
  inject('blogRepository', createBlogRepository(context.$axios)())
}
