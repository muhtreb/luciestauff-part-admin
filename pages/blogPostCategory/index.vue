<template>
  <div>
    <h1>Catégories de posts</h1>

    <v-data-table
      :headers="headers"
      :items="blogPostCategories"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : blogPosts.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des catégories</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addBlogPostCategory()">Ajouter une catégorie</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editBlogPostCategory(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteBlogPostCategory(item)">
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
      blogPostCategories: (state) => state.blogPostCategory.blogPostCategories,
      pagination: (state) => state.blogPost.pagination
    })
  },
  methods: {
    async fetchBlogPostCategories() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('blogPostCategory/getBlogPostCategories', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addBlogPostCategory() {
      this.$router.push({
        name: 'blogPostCategory-add'
      })
    },
    editBlogPostCategory(blogPostCategory) {
      this.$router.push({
        name: 'blogPostCategory-id-edit',
        params: { id: blogPostCategory.id }
      })
    },
    async deleteBlogPostCategory(blogPost) {
      if (confirm('Êtes vous sûr de vouloir supprimer cette catégorie ?')) {
        await this.$blogPostCategoryRepository.deleteBlogPostCategory(
          blogPost.id
        )
        await this.fetchBlogPostCategories()
      }
    }
  },
  mounted() {
    this.fetchBlogPostCategories()
  },
  watch: {
    options: {
      handler() {
        this.fetchBlogPostCategories()
      },
      deep: true
    }
  }
}
</script>
