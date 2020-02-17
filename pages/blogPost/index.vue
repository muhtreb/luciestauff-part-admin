<template>
  <div>
    <h1>Posts</h1>

    <v-data-table
      :headers="headers"
      :items="blogPosts"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : blogPosts.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des posts</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addBlogPost()">Ajouter un post</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.imageUrl="{ item }">
        <img :src="item.imageUrl" width="50px" />
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editBlogPost(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteBlogPost(item)">
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
      { text: 'Image', value: 'imageUrl' },
      { text: 'Titre', value: 'title' },
      { text: 'slug', value: 'slug' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      blogPosts: (state) => state.blogPost.blogPosts,
      pagination: (state) => state.blogPost.pagination
    })
  },
  methods: {
    async fetchBlogPosts() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('blogPost/getBlogPosts', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addBlogPost() {
      this.$router.push({
        name: 'blogPost-add'
      })
    },
    editBlogPost(blogPost) {
      this.$router.push({
        name: 'blogPost-id-edit',
        params: { id: blogPost.id }
      })
    },
    async deleteBlogPost(blogPost) {
      if (confirm('Êtes vous sûr de vouloir supprimer cet article ?')) {
        await this.$blogPostRepository.deleteBlogPost(blogPost.id)
        await this.fetchBlogPosts()
      }
    }
  },
  mounted() {
    this.fetchBlogPosts()
  },
  watch: {
    options: {
      handler() {
        this.fetchBlogPosts()
      },
      deep: true
    }
  }
}
</script>
