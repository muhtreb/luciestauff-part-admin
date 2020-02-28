<template>
  <div>
    <h1>Catégories de portfolio</h1>

    <v-data-table
      :headers="headers"
      :items="portfolioCategories"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : portfolios.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des catégories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addPortfolioCategory()">Ajouter une catégorie</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editPortfolioCategory(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="mr-2" @click="deletePortfolioCategory(item)">
            mdi-delete
          </v-icon>
          <v-icon @click="managePortfolioCategoryMedias(item)">
            mdi-eye
          </v-icon>
        </div>
      </template>

      <template v-slot:item.position="{ item }">
        <div class="data-table-actions">
          <v-icon
            class="mr-2"
            @click="upPositionPortfolioCategory(item)"
            v-if="item.position > 1"
          >
            mdi-arrow-up-thick
          </v-icon>
          <v-icon
            @click="downPositionPortfolioCategory(item)"
            v-if="item.position < portfolioCategories.length"
          >
            mdi-arrow-down-thick
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
      sortBy: ['position'],
      sortDesc: [false]
    },
    perPage: 10,
    headers: [
      { text: 'ID', value: 'id', sortable: false },
      { text: 'Position', value: 'position', sortable: false },
      { text: 'Nom', value: 'name', sortable: false },
      { text: 'slug', value: 'slug', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      portfolioCategories: (state) =>
        state.portfolioCategory.portfolioCategories,
      pagination: (state) => state.portfolioCategory.pagination
    })
  },
  methods: {
    async fetchPortfolioCategories() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('portfolioCategory/getPortfolioCategories', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addPortfolioCategory() {
      this.$router.push({
        name: 'portfolioCategory-add'
      })
    },
    editPortfolioCategory(portfolioCategory) {
      this.$router.push({
        name: 'portfolioCategory-id-edit',
        params: { id: portfolioCategory.id }
      })
    },
    managePortfolioCategoryMedias(portfolioCategory) {
      this.$router.push({
        name: 'portfolioCategory-id-medias',
        params: { id: portfolioCategory.id }
      })
    },
    async deletePortfolioCategory(portfolioCategory) {
      if (confirm('Êtes vous sûr de vouloir supprimer cette catégorie ?')) {
        await this.$portfolioCategoryRepository.deletePortfolioCategory(
          portfolioCategory.id
        )
        await this.fetchPortfolioCategories()
      }
    },
    async upPositionPortfolioCategory(portfolioCategory) {
      await this.$portfolioCategoryRepository.upPositionPortfolioCategory(
        portfolioCategory.id
      )
      await this.fetchPortfolioCategories()
    },
    async downPositionPortfolioCategory(portfolioCategory) {
      await this.$portfolioCategoryRepository.downPositionPortfolioCategory(
        portfolioCategory.id
      )
      await this.fetchPortfolioCategories()
    }
  },
  mounted() {
    this.fetchPortfolioCategories()
  },
  watch: {
    options: {
      handler() {
        this.fetchPortfolioCategories()
      },
      deep: true
    }
  }
}
</script>
