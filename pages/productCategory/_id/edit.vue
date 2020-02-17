<template>
  <div>
    <ProductCategoryForm
      :product-category="productCategory"
    ></ProductCategoryForm>
  </div>
</template>

<script>
import ProductCategoryForm from '@/components/ProductCategoryForm'
export default {
  components: { ProductCategoryForm },
  async asyncData({ route, app }) {
    const response = await app.$productCategoryRepository.getProductCategoryById(
      route.params.id
    )
    return {
      productCategory: response.data
    }
  }
}
</script>
