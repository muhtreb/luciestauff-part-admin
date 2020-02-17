<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="contactMessages"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="
        pagination ? pagination.total : contactMessages.length
      "
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des messages</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon @click="deleteContactMessage(item)">
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
      { text: 'Statut', value: 'status' },
      { text: 'Email', value: 'email' },
      { text: 'Nom', value: 'name' },
      { text: 'Date', value: 'created_at' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      contactMessages: (state) => state.contactMessage.contactMessages,
      pagination: (state) => state.contactMessage.pagination
    })
  },
  methods: {
    async fetchContactMessages() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('contactMessage/getContactMessages', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addContactMessage() {
      this.$router.push({
        name: 'contactMessage-add'
      })
    },
    editContactMessage(contactMessage) {
      this.$router.push({
        name: 'contactMessage-id-edit',
        params: { id: contactMessage.id }
      })
    },
    async deleteContactMessage(contactMessage) {
      if (confirm('Êtes vous sûr de vouloir supprimer ce message ?')) {
        await this.$contactMessageRepository.deleteContactMessage(
          contactMessage.id
        )
        await this.fetchContactMessages()
      }
    }
  },
  mounted() {
    this.fetchContactMessages()
  },
  watch: {
    options: {
      handler() {
        this.fetchContactMessages()
      },
      deep: true
    }
  }
}
</script>
