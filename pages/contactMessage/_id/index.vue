<template>
  <div>
    <v-btn nuxt to="/contactMessage" class="mb-4">Retour aux messages</v-btn>
    <v-tabs v-model="tab">
      <v-tab href="#tab-info">
        <v-icon class="mr-4">mdi-phone</v-icon>
        Informations
      </v-tab>
      <v-tab href="#tab-messages">
        <v-icon class="mr-4">mdi-mail</v-icon>
        Historique des messages
      </v-tab>
      <v-tab-item value="tab-info">
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
                  <b>Makeup</b>
                  <v-chip>{{ contactMessage.count_makeup }}</v-chip>
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

            <v-form ref="statusForm" class="mt-5">
              <v-select
                :items="statuses"
                v-model="status"
                label="Statut"
                outlined
              ></v-select>
              <v-btn @click="updateStatus">Modifier le statut</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <div class="mt-5">
          <v-card class="mx-auto mt-5">
            <v-card-text>
              <div class="display-1 text--primary mb-5">
                Envoyer un message
              </div>
              <v-select
                :items="automaticAnswers"
                v-model="automaticAnswer"
                label="Message pré-enregistré"
                outlined
                @change="showAutomaticAnswer"
              ></v-select>

              <v-form ref="messageForm" @submit.prevent="sendAnswer">
                <div class="mt-4 mb-4">
                  <v-text-field
                    v-model="answerSubject"
                    label="Sujet"
                    outlined
                    required
                    :error-messages="getFieldErrors('subject')"
                  ></v-text-field>
                  <h3>Message</h3>
                  <tui-markdown-editor
                    v-model="answerMessage"
                    mode="wysiwyg"
                    required
                  />
                  <div v-if="hasFieldErrors('message')">
                    <div
                      v-for="(error, index) in getFieldErrors('message')"
                      :key="index"
                      class="red--text my-2"
                    >
                      {{ error }}
                    </div>
                  </div>
                </div>
                <v-btn type="submit" :disabled="sendMessage"
                  >Envoyer le message</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
        </div>
      </v-tab-item>
      <v-tab-item value="tab-messages">
        <div v-for="(email, index) in contactMessage.emails" :key="index">
          <v-card class="mx-auto mt-5">
            <v-card-text>
              <div class="display-1 text--primary mb-5">
                {{ email.subject }}
              </div>
              <div class="mb-2">
                Envoyé le {{ formatEmailDate(email.sent_at) }}
              </div>
              <div v-html="toMarkdown(email.message)"></div>
            </v-card-text>
          </v-card>
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import marked from 'marked'
import moment from 'moment'
import nl2br from 'nl2br'
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],
  async asyncData({ route, app }) {
    const res = await Promise.all([
      app.$contactMessageRepository.getContactMessageById(route.params.id),
      app.$settingRepository.getSettingsByKeys()
    ])
    return {
      contactMessage: res[0].data,
      settings: res[1],
      status: res[0].data.status
    }
  },
  data() {
    return {
      tab: 'info',
      statuses: [
        { text: 'En attente', value: 'pending' },
        { text: 'Devis envoyé', value: 'quoted' },
        { text: 'Décliné', value: 'declined' },
        { text: 'Devis accepté', value: 'booked' },
        { text: 'Devis refusé', value: 'quote_not_accepted' },
        { text: 'Annulé par le client', value: 'customer_cancelled' },
        { text: 'Annulé', value: 'cancelled' },
        { text: 'Terminé', value: 'completed' }
      ],
      automaticAnswers: [
        { text: 'Libre', value: 'free' },
        { text: 'Devis', value: 'quoted' },
        { text: 'Décliner', value: 'declined' },
        { text: 'Devis accepté', value: 'booked' }
      ],

      answerSubject: '',
      answerMessage: '',
      automaticAnswer: 'free',
      sendingMessage: false,
      valid: true,
      submitted: false
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    formatEmailDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    formatMessage(message) {
      return nl2br(message)
    },
    toMarkdown(value) {
      return value ? marked(value) : ''
    },
    async showAutomaticAnswer() {
      if (this.automaticAnswer === 'free') {
        this.answerMessage = ''
        this.answerSubject = ''
        return
      }

      try {
        const response = await this.$contactMessageRepository.getContactMessageAnswerByStatus(
          this.contactMessage.id,
          this.automaticAnswer
        )
        this.answerMessage = response.data.message
        this.answerSubject = response.data.subject
      } catch (error) {
        this.answerMessage = ''
        this.answerSubject = ''
      }
    },
    async sendAnswer() {
      this.submitted = false
      this.$refs.messageForm.validate()
      if (this.$refs.messageForm.validate()) {
        this.sendingMessage = true
        const formData = new FormData()
        formData.append('message', this.answerMessage)
        formData.append('subject', this.answerSubject)
        try {
          await this.$contactMessageRepository.sendContactMessageAnswer(
            this.contactMessage.id,
            formData
          )

          this.$store.dispatch(
            'snackbar/snackbarSuccess',
            'Le message a bien été envoyé'
          )

          this.answerMessage = ''
          this.answerSubject = ''
          this.automaticAnswer = 'free'

          const contactMessageResponse = await this.$contactMessageRepository.getContactMessageById(
            this.contactMessage.id
          )

          this.contactMessage.emails = contactMessageResponse.data.emails
        } catch (error) {
          this.valid = false
          this.errors = error.response.data.errors
          this.submitted = true
          this.$store.dispatch(
            'snackbar/snackbarError',
            "Une erreur est survenue lors de l'envoi du message"
          )
        }

        this.sendingMessage = false
      }
    },
    async updateStatus() {
      try {
        await this.$contactMessageRepository.updateStatus(
          this.contactMessage.id,
          this.status
        )

        this.$store.dispatch(
          'snackbar/snackbarSuccess',
          'Le statut a bien été mis à jour'
        )
      } catch (error) {
        this.$store.dispatch(
          'snackbar/snackbarError',
          'Une erreur est survenue lors de la mise à jour du statut'
        )
      }
    }
  }
}
</script>
