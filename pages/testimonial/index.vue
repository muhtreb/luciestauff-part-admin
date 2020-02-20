<template>
  <div>
    <h1>Témoignages</h1>

    <v-data-table
      :headers="headers"
      :items="testimonials"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : testimonials.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des témoignages</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="addTestimonial()">Ajouter un témoignage</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.date="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template v-slot:item.content="{ item }">
        {{ formatContent(item.content) }}
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editTestimonial(item)">
            mdi-pencil
          </v-icon>
          <v-icon @click="deleteTestimonial(item)">
            mdi-delete
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data: () => ({
    showEnded: false,
    loading: false,
    options: {
      sortBy: ['date'],
      sortDesc: [true]
    },
    perPage: 10,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nom', value: 'name' },
      { text: 'Contenu', value: 'content' },
      { text: 'Date', value: 'date' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      testimonials: (state) => state.testimonial.testimonials,
      pagination: (state) => state.testimonial.pagination
    })
  },
  methods: {
    async fetchTestimonials() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('testimonial/getTestimonials', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addTestimonial() {
      this.$router.push({
        name: 'testimonial-add'
      })
    },
    editTestimonial(testimonial) {
      this.$router.push({
        name: 'testimonial-id-edit',
        params: { id: testimonial.id }
      })
    },
    async deleteTestimonial(testimonial) {
      if (confirm('Êtes vous sûr de vouloir supprimer ce témoignage ?')) {
        await this.$testimonialRepository.deleteTestimonial(testimonial.id)
        await this.fetchTestimonials()
      }
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    formatContent(content) {
      const length = 100
      if (content.length <= length) {
        return content
      }
      return content.slice(0, length) + '...'
    }
  },
  mounted() {
    this.fetchTestimonials()
  },
  watch: {
    options: {
      handler() {
        this.fetchTestimonials()
      },
      deep: true
    }
  }
}
</script>
