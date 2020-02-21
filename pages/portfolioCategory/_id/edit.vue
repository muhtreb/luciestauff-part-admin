<template>
  <div>
    <PortfolioCategoryForm
      :portfolio-category="portfolioCategory"
    ></PortfolioCategoryForm>
  </div>
</template>

<script>
import PortfolioCategoryForm from '@/components/PortfolioCategoryForm'
export default {
  components: { PortfolioCategoryForm },
  async asyncData({ route, app }) {
    const response = await app.$portfolioCategoryRepository.getPortfolioCategoryById(
      route.params.id
    )
    return {
      portfolioCategory: response.data
    }
  }
}
</script>
