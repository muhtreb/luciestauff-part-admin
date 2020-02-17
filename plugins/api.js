import createBlogPostRepository from '~/api/blogPost'
import createBlogPostCategoryRepository from '~/api/blogPostCategory'
import createProductRepository from '~/api/product'
import createProductCategoryRepository from '~/api/productCategory'
import createSettingRepository from '~/api/setting'
import createContactMessageRepository from '~/api/contactMessage'

export default (context, inject) => {
  inject('settingRepository', createSettingRepository(context.$axios)())
  inject('blogPostRepository', createBlogPostRepository(context.$axios)())
  inject(
    'blogPostCategoryRepository',
    createBlogPostCategoryRepository(context.$axios)()
  )
  inject('productRepository', createProductRepository(context.$axios)())
  inject(
    'productCategoryRepository',
    createProductCategoryRepository(context.$axios)()
  )
  inject(
    'contactMessageRepository',
    createContactMessageRepository(context.$axios)()
  )
}
