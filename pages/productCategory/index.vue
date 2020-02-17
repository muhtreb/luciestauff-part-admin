<template>
  <div>
    <h1>Catégories de produits</h1>

    <v-data-table
      :headers="headers"
      :items="productCategories"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : products.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des catégories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addProductCategory()">Ajouter une catégorie</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editProductCategory(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteProductCategory(item)">
            mdi-delete
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    showEnded: false,
    loading: false,
    options: {
      sortBy: ['created_at'],
      sortDesc: [true]
    },
    perPage: 10,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nom', value: 'name' },
      { text: 'slug', value: 'slug' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      productCategories: (state) => state.productCategory.productCategories,
      pagination: (state) => state.product.pagination
    })
  },
  methods: {
    async fetchProductCategories() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('productCategory/getProductCategories', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addProductCategory() {
      this.$router.push({
        name: 'productCategory-add'
      })
    },
    editProductCategory(productCategory) {
      this.$router.push({
        name: 'productCategory-id-edit',
        params: { id: productCategory.id }
      })
    },
    async deleteProductCategory(product) {
      if (confirm('Êtes vous sûr de vouloir supprimer cette catégorie ?')) {
        await this.$productCategoryRepository.deleteProductCategory(product.id)
        await this.fetchProductCategories()
      }
    }
  },
  mounted() {
    this.fetchProductCategories()
  },
  watch: {
    options: {
      handler() {
        this.fetchProductCategories()
      },
      deep: true
    }
  }
}
</script>
