<template>
  <v-form v-model="valid" @submit.prevent="submit" ref="form">
    <v-text-field
      v-model="testimonial.name"
      label="Nom"
      :error-messages="getFieldErrors('name')"
      outlined
    ></v-text-field>
    <v-textarea
      v-model="testimonial.content"
      label="Contenu"
      :error-messages="getFieldErrors('content')"
      outlined
    ></v-textarea>
    <v-menu
      v-model="datePicker"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="testimonial.date"
          label="Date"
          prepend-icon="mdi-calendar"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="testimonial.date"
        @input="onSelectDate"
        :first-day-of-week="1"
      ></v-date-picker>
    </v-menu>
    <v-btn color="primary" type="submit">Envoyer</v-btn>
  </v-form>
</template>

<script>
import moment from 'moment'
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  props: {
    testimonial: {
      type: Object,
      default: () => {
        return {
          name: '',
          content: '',
          date: moment(new Date()).format('YYYY-MM-DD')
        }
      }
    }
  },
  data() {
    return {
      datePicker: false,
      valid: true,
      submitted: false
    }
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()

        formData.append('name', this.testimonial.name)
        formData.append('content', this.testimonial.content)
        formData.append('date', this.testimonial.date)

        try {
          if (this.testimonial.id) {
            await this.$testimonialRepository.updateTestimonial(
              this.testimonial.id,
              formData
            )
          } else {
            await this.$testimonialRepository.createTestimonial(formData)
          }
          this.$router.push({
            name: 'testimonial'
          })
        } catch (error) {
          this.valid = false
          this.errors = error.response.data.errors
          this.submitted = true
        }
      }
    },
    onSelectDate() {
      this.datePicker = false
    }
  }
}
</script>
