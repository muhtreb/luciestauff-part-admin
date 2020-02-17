<template>
  <v-form v-model="valid" @submit.prevent="submit" ref="form">
    <v-text-field
      v-model="setting.key"
      label="Key"
      outlined
      readonly
      disabled
    ></v-text-field>
    <v-textarea
      v-model="setting.value"
      label="Valeur"
      :error-messages="getFieldErrors('value')"
      outlined
    ></v-textarea>
    <v-btn color="primary" type="submit">Envoyer</v-btn>
  </v-form>
</template>

<script>
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  props: {
    setting: {
      type: Object,
      default: () => {
        return {
          key: '',
          value: ''
        }
      }
    }
  },
  data() {
    return {
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
        formData.append('value', this.setting.value)
        try {
          await this.$settingRepository.updateSetting(
            this.setting.key,
            formData
          )

          this.$store.dispatch(
            'snackbar/snackbarSuccess',
            'Le paramètre a bien été enregistré'
          )

          this.$router.push({
            name: 'setting'
          })
        } catch (error) {
          this.valid = false
          this.errors = error.response.data.errors
          this.submitted = true

          this.$store.dispatch(
            'snackbar/snackbarError',
            'Des erreurs sont survenues'
          )
        }
      }
    }
  }
}
</script>
