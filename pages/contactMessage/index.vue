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
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          color="red"
          text-color="white"
          v-if="item.status === 'declined'"
        >
          Décliné
        </v-chip>

        <v-chip
          color="green"
          text-color="white"
          v-else-if="item.status === 'quoted'"
        >
          Devis envoyé
        </v-chip>

        <v-chip
          color="green"
          text-color="white"
          v-else-if="item.status === 'booked'"
        >
          Devis accepté
        </v-chip>

        <v-chip
          color="orange"
          text-color="white"
          v-else-if="item.status === 'pending'"
        >
          En attente
        </v-chip>

        <v-chip
          color="red"
          text-color="white"
          v-else-if="item.status === 'customer_cancelled'"
        >
          Annulé par le client
        </v-chip>

        <v-chip
          color="red"
          text-color="white"
          v-else-if="item.status === 'cancelled'"
        >
          Annulé
        </v-chip>

        <v-chip
          color="blue"
          text-color="white"
          v-else-if="item.status === 'completed'"
        >
          Terminé
        </v-chip>

        <v-chip
          color="red"
          text-color="white"
          v-else-if="item.status === 'quote_not_accepted'"
        >
          Devis refusé
        </v-chip>

        <v-chip v-else>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon @click="showContactMessage(item)">
            mdi-eye
          </v-icon>
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
import moment from 'moment'

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
      { text: 'Nom', value: 'last_name' },
      { text: 'Prénom', value: 'first_name' },
      { text: 'Envoyé le', value: 'created_at' },
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
    showContactMessage(contactMessage) {
      this.$router.push({
        name: 'contactMessage-id',
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
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
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
