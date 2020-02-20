<template>
  <div>
    <TestimonialForm :testimonial="testimonial"></TestimonialForm>
  </div>
</template>

<script>
import TestimonialForm from '@/components/TestimonialForm'
export default {
  components: { TestimonialForm },
  async asyncData({ route, app }) {
    const response = await app.$testimonialRepository.getTestimonialById(
      route.params.id
    )
    return {
      testimonial: response.data
    }
  }
}
</script>
