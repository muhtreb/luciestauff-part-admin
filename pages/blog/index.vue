<template>
  <div>
    <h1>Posts</h1>

    <v-data-table
      :headers="headers"
      :items="blogPosts"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des posts</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addBlogPost()">Ajouter une post</v-btn>
        </v-toolbar>
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
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Titre', value: 'title' },
      { text: 'slug', value: 'slug' },
      { text: 'Date de début', value: 'createdAt' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      blogPosts: (state) => state.blog.all
    })
  },
  methods: {
    addBlogPost() {
      this.$router.push({
        name: 'blog-add'
      })
    },
    editBlogPost(blogPost) {
      this.$router.push({
        name: 'blog-id-edit',
        params: { id: blogPost.id }
      })
    },
    deleteBlogPost(blogPost) {
      this.$router.push({
        name: 'blog_add'
      })
    }
  },
  async fetch({ store }) {
    await store.dispatch('blog/all')
  }
}
</script>
