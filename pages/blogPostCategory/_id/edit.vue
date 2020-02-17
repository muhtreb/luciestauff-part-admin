<template>
  <div>
    <BlogPostCategoryForm
      :blog-post-category="blogPostCategory"
    ></BlogPostCategoryForm>
  </div>
</template>

<script>
import BlogPostCategoryForm from '@/components/BlogPostCategoryForm'
export default {
  components: { BlogPostCategoryForm },
  async asyncData({ route, app }) {
    const response = await app.$blogPostCategoryRepository.getBlogPostCategoryById(
      route.params.id
    )
    return {
      blogPostCategory: response.data
    }
  }
}
</script>
