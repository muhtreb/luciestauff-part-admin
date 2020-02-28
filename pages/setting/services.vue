<template>
  <div>
    <h1>Paramètres de la page Services</h1>

    <v-form v-model="valid" @submit.prevent="submit" ref="form">
      <h2>Sections</h2>
      <v-row
        v-for="(section, index) in setting.value.about.sections"
        :key="index"
        class="mb-10"
      >
        <v-col>
          <v-text-field v-model="section.title" label="Title"></v-text-field>
          <tui-markdown-editor v-model="section.content" mode="wysiwyg" />
        </v-col>
        <v-col class="col-auto">
          <div class="d-flex flex-wrap flex-column">
            <v-btn @click="removeSection(index)" class="mb-2"
              >Supprimer la section</v-btn
            >
            <v-btn
              @click="downSection(index)"
              class="mb-2"
              v-if="index + 1 < setting.value.about.sections.length"
              >Baisser la section</v-btn
            >
            <v-btn @click="upSection(index)" v-if="index > 0"
              >Remonter la section</v-btn
            >
          </div>
        </v-col>
      </v-row>
      <v-btn @click="addSection()">Ajouter une section</v-btn>
      <v-btn color="primary" type="submit">Envoyer</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      bannerPictureUrl: null,
      initialBannerPictureUrl: null,
      bannerPicture: null,
      setting: {
        value: {
          about: {
            sections: []
          },
          banner_picture_url: ''
        }
      }
    }
  },
  async mounted() {
    const response = await this.$settingRepository.getSettingByKey('services')
    this.setting = response.data

    this.bannerPictureUrl = this.setting.value.banner_picture_url
    this.initialBannerPictureUrl = this.setting.value.banner_picture_url
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()
        for (const [index, section] of Object.entries(
          this.setting.value.about.sections
        )) {
          formData.append(`sections[${index}][title]`, section.title)
          formData.append(`sections[${index}][content]`, section.content)
        }

        try {
          await this.$settingRepository.updateSetting('services', formData)

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
    },
    addSection() {
      this.setting.value.about.sections.push({
        title: '',
        content: ''
      })
    },
    removeSection(index) {
      if (confirm('Êtes vous sûr de vouloir supprimer cette section ?')) {
        this.setting.value.about.sections.splice(index, 1)
      }
    },
    downSection(index) {
      const sections = this.setting.value.about.sections.splice(index, 1)
      this.setting.value.about.sections.splice(index + 1, 0, sections[0])
    },
    upSection(index) {
      const sections = this.setting.value.about.sections.splice(index, 1)
      this.dasetting.valueta.about.sections.splice(index - 1, 0, sections[0])
    },
    onChangeBannerPicture(event) {
      if (!event) {
        this.bannerPictureUrl = this.initialBannerPictureUrl
      } else if (this.bannerPicture) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.bannerPictureUrl = e.target.result
        }
        reader.readAsDataURL(this.bannerPicture)
      }
    }
  }
}
</script>
