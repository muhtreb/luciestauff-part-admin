<template>
  <div>
    <h1>Contact Message</h1>

    <v-form v-model="valid" @submit.prevent="submit" ref="form">
      <v-text-field
        v-model="setting.key"
        label="Key"
        outlined
        readonly
        disabled
      ></v-text-field>

      <v-text-field
        v-model="setting.value.subject"
        label="Sujet"
        outlined
      ></v-text-field>
      <div class="mb-4">
        <v-textarea v-model="setting.value.message" />
      </div>
      <v-btn color="primary" type="submit">Envoyer</v-btn>
    </v-form>
  </div>
</template>

<script>
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  data() {
    return {
      valid: true,
      submitted: false,
      setting: {
        value: {
          subject: '',
          message: ''
        }
      }
    }
  },
  async asyncData({ route, app }) {
    const response = await app.$settingRepository.getSettingByKey(
      route.params.key
    )

    return {
      setting: response.data
    }
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('value', JSON.stringify(this.setting.value))
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
