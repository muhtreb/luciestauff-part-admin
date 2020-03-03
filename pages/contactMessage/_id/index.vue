<template>
  <div>
    <v-card class="mx-auto mt-5">
      <v-card-text>
        <div class="display-1 text--primary mb-5">
          {{ contactMessage.first_name }} {{ contactMessage.last_name }}
        </div>

        <div class="mb-5">
          <h2>Informations</h2>
          <div class="mb-4">
            Message envoyé le {{ formatDate(contactMessage.created_at) }}
          </div>
          <div
            v-if="contactMessage.email || contactMessage.phone_number"
            class="d-flex flex flex-row mb-4"
          >
            <div v-if="contactMessage.email" class="mr-4">
              <v-icon>mdi-email</v-icon> {{ contactMessage.email }}
            </div>
            <div v-if="contactMessage.phone_number">
              <v-icon>mdi-phone</v-icon> {{ contactMessage.phone_number }}
            </div>
          </div>

          <div v-if="contactMessage.location" class="mb-4">
            <v-icon>mdi-earth</v-icon> {{ contactMessage.location }}
          </div>
          <div
            v-if="contactMessage.date || contactMessage.time"
            class="d-flex flex flex-row mb-4"
          >
            <div v-if="contactMessage.date" class="mr-4">
              <v-icon>mdi-calendar</v-icon> {{ contactMessage.date }}
            </div>
            <div v-if="contactMessage.time">
              <v-icon>mdi-clock-outline</v-icon> {{ contactMessage.time }}
            </div>
          </div>
        </div>
        <div
          v-if="contactMessage.count_hair || contactMessage.count_makeup"
          class="mb-5"
        >
          <h2>Prestations souhaitées</h2>
          <div class="d-flex flex flex-row">
            <div class="mr-4" v-if="contactMessage.count_hair">
              <b>Hair</b> <v-chip>{{ contactMessage.count_hair }}</v-chip>
            </div>
            <div v-if="contactMessage.count_makeup">
              <b>Makeup</b> <v-chip>{{ contactMessage.count_makeup }}</v-chip>
            </div>
          </div>
        </div>
        <div>
          <h2>Message</h2>
          <div
            class="text--primary"
            v-html="formatMessage(contactMessage.message)"
          ></div>
        </div>
      </v-card-text>
    </v-card>

    <div
      v-if="
        contactMessage.status === 'pending' ||
          contactMessage.status === 'more_info'
      "
      class="mt-5"
    >
      <h2>Choisir une réponse pré enregistrée</h2>
      <v-btn
        @click="showAnswer('declined')"
        :color="status === 'declined' ? 'primary' : ''"
        >Décliner</v-btn
      >
      <v-btn
        @click="showAnswer('accepted')"
        :color="status === 'accepted' ? 'primary' : ''"
        >Accepter</v-btn
      >
      <v-btn
        @click="showAnswer('more_info')"
        :color="status === 'more_info' ? 'primary' : ''"
        >Demander plus d'informations</v-btn
      >

      <div class="mt-4 mb-4">
        <h3>Message</h3>
        <tui-markdown-editor v-model="answer" mode="wysiwyg" />
      </div>
      <v-btn @click="sendAnswer">Envoyer la réponse</v-btn>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import nl2br from 'nl2br'
export default {
  async asyncData({ route, app }) {
    const res = await Promise.all([
      app.$contactMessageRepository.getContactMessageById(route.params.id),
      app.$settingRepository.getSettingsByKeys()
    ])
    return {
      contactMessage: res[0].data,
      settings: res[1]
    }
  },
  data() {
    return {
      answer: '',
      status: ''
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    formatMessage(message) {
      return nl2br(message)
    },
    async showAnswer(status) {
      const response = await this.$contactMessageRepository.getContactMessageAnswerByStatus(
        this.contactMessage.id,
        status
      )
      this.answer = response.data.message
      this.status = status
    },
    async sendAnswer() {
      const formData = new FormData()
      formData.append('message', this.answer)
      formData.append('status', this.status)
      await this.$contactMessageRepository.sendContactMessageAnswer(
        this.contactMessage.id,
        formData
      )
      this.$router.push({
        name: 'contactMessage'
      })
    }
  }
}
</script>
