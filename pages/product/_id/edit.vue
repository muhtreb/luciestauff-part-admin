<template>
  <div>
    <ProductForm :product="product"></ProductForm>
  </div>
</template>

<script>
import ProductForm from '@/components/ProductForm'
export default {
  components: { ProductForm },
  async asyncData({ route, app }) {
    const response = await app.$productRepository.getProductById(
      route.params.id
    )
    return {
      product: response.data
    }
  }
}
</script>
