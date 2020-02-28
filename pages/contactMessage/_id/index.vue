<template>
  <div>
    <ul>
      <li>Sent at : {{ formatDate(contactMessage.created_at) }}</li>
      <li>Name : {{ contactMessage.name }}</li>

      <li>Email : {{ contactMessage.email }}</li>
      <li>Location : {{ contactMessage.location }}</li>

      <li>Date : {{ contactMessage.date }} {{ contactMessage.time }}</li>

      <li>Hair : {{ contactMessage.count_hair }}</li>
      <li>Makeup : {{ contactMessage.count_makeup }}</li>
      <li>
        Message :
        <div v-html="contactMessage.message"></div>
      </li>
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
    }
  }
}
</script>
