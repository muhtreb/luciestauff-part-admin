<template>
  <div>
    <BlogPostForm :blog-post="blogPost"></BlogPostForm>
  </div>
</template>

<script>
import BlogPostForm from '@/components/BlogPostForm'
export default {
  components: { BlogPostForm },
  async asyncData({ route, app }) {
    const response = await app.$blogRepository.getBlogPostById(route.params.id)
    return {
      blogPost: response.data
    }
  }
}
</script>
