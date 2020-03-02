<template>
  <div>
    <ul>
      <li>Sent at : {{ formatDate(contactMessage.created_at) }}</li>
      <li>
        Name : {{ contactMessage.first_name }} {{ contactMessage.last_name }}
      </li>

      <li>Email : {{ contactMessage.email }}</li>
      <li>Location : {{ contactMessage.location }}</li>

      <li>Date : {{ contactMessage.date }} {{ contactMessage.time }}</li>

      <li>Hair : {{ contactMessage.count_hair }}</li>
      <li>Makeup : {{ contactMessage.count_makeup }}</li>
      <li>
        Message :
        <div v-html="contactMessage.message"></div>
      </li>

      <v-btn
        @click="decline"
        color="error"
        v-if="contactMessage.status === 'pending'"
        >Décliner</v-btn
      >
      <v-btn
        @click="accept"
        color="success"
        v-if="contactMessage.status === 'pending'"
        >Accepter</v-btn
      >
    </ul>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  async asyncData({ route, app }) {
    const response = await app.$contactMessageRepository.getContactMessageById(
      route.params.id
    )
    return {
      contactMessage: response.data
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    async decline() {
      await this.$contactMessageRepository.declineContactMessage(
        this.contactMessage.id
      )
      this.$router.push({
        name: 'contactMessage'
      })
    },
    async accept() {
      await this.$contactMessageRepository.acceptContactMessage(
        this.contactMessage.id
      )
      this.$router.push({
        name: 'contactMessage'
      })
    }
  }
}
</script>
