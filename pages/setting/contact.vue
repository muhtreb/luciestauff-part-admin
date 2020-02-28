<template>
  <div>
    <h1>Paramètres de la page de contact</h1>
    <v-form v-model="valid" @submit.prevent="submit" ref="form">
      <v-textarea v-model="setting.value.title" label="Title"> </v-textarea>
      <v-btn color="primary" type="submit">Envoyer</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      setting: {
        value: {
          title: ''
        }
      }
    }
  },
  async mounted() {
    const response = await this.$settingRepository.getSettingByKey('contact')
    this.setting = response.data
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('title', this.setting.value.title)

        try {
          await this.$settingRepository.updateSetting('contact', formData)

          this.$store.dispatch(
            'snackbar/snackbarSuccess',
            'Les paramètres ont bien été enregistrés'
          )

          this.$router.push({
            name: 'setting'
          })
        } catch (error) {
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
