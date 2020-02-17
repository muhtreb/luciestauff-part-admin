<template>
  <div>
    <h1>Products</h1>

    <v-data-table
      :headers="headers"
      :items="products"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : products.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des produits</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addProduct()">Ajouter un produit</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.imageUrl="{ item }">
        <img :src="item.smallImageUrl" width="50px" />
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editProduct(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteProduct(item)">
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
      sortBy: ['title'],
      sortDesc: [true]
    },
    perPage: 10,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Image', value: 'imageUrl' },
      { text: 'Titre', value: 'title' },
      { text: 'Slug', value: 'slug' },
      { text: 'URL', value: 'url' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      products: (state) => state.product.products,
      pagination: (state) => state.product.pagination
    })
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('product/getProducts', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addProduct() {
      this.$router.push({
        name: 'product-add'
      })
    },
    editProduct(product) {
      this.$router.push({
        name: 'product-id-edit',
        params: { id: product.id }
      })
    },
    async deleteProduct(product) {
      if (confirm('Êtes vous sûr de vouloir supprimer ce produit ?')) {
        await this.$productRepository.deleteProduct(product.id)
        await this.fetchProducts()
      }
    }
  },
  mounted() {
    this.fetchProducts()
  },
  watch: {
    options: {
      handler() {
        this.fetchProducts()
      },
      deep: true
    }
  }
}
</script>
