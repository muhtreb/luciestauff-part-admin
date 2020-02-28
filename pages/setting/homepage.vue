<template>
  <div>
    <h1>Paramètres de la page d'accueil</h1>
    <v-form v-model="valid" @submit.prevent="submit" ref="form">
      <div class="row">
        <div class="col-auto" v-if="profilePictureUrl">
          <v-img
            :src="profilePictureUrl"
            v-if="profilePictureUrl"
            width="300px"
            class="mr-3"
          ></v-img>
        </div>
        <div class="col">
          <v-file-input
            name="image"
            v-model="profilePicture"
            prepend-icon="mdi-camera"
            label="Profile picture"
            outlined
            accept="image/*"
            @change="onChangeProfilePicture($event)"
            ref="inputProfilePicture"
          ></v-file-input>
        </div>
      </div>

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

      <div class="mt-4">
        <h2>Services</h2>
        <div class="row">
          <div class="col-auto" v-if="servicesBannerPictureUrl">
            <v-img
              :src="servicesBannerPictureUrl"
              v-if="servicesBannerPictureUrl"
              width="300px"
              class="mr-3"
            ></v-img>
          </div>
          <div class="col">
            <v-file-input
              name="image"
              v-model="servicesBannerPicture"
              prepend-icon="mdi-camera"
              label="Banner"
              outlined
              accept="image/*"
              @change="onChangeServicesBannerPicture($event)"
              ref="inputBannerPicture"
            ></v-file-input>
          </div>
        </div>

        <v-textarea v-model="setting.value.services.content" label="Content">
        </v-textarea>
      </div>
      <v-btn color="primary" type="submit">Envoyer</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      profilePicture: null,
      profilePictureUrl: null,
      initialProfilePictureUrl: null,
      servicesBannerPictureUrl: null,
      initialServicesBannerPictureUrl: null,
      servicesBannerPicture: null,
      setting: {
        value: {
          about: {
            profile_picture_url: null,
            sections: []
          },
          services: {
            banner_picture_url: '',
            content: ''
          }
        }
      }
    }
  },
  async mounted() {
    const response = await this.$settingRepository.getSettingByKey('homepage')
    this.setting = response.data

    this.profilePictureUrl = this.setting.value.about.profile_picture_url
    this.initialProfilePictureUrl = this.setting.value.about.profile_picture_url

    this.bannerServicesPictureUrl = this.setting.value.services.banner_picture_url
    this.initialBannerServicesPictureUrl = this.setting.value.services.banner_picture_url
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()
        if (this.profilePicture !== null) {
          formData.append(`profile_picture`, this.profilePicture)
        }

        if (this.servicesBannerPicture !== null) {
          formData.append(
            `services[banner_picture]`,
            this.servicesBannerPicture
          )
        }

        formData.append(
          `services[content]`,
          this.setting.value.services.content
        )

        for (const [index, section] of Object.entries(
          this.setting.value.about.sections
        )) {
          formData.append(`sections[${index}][title]`, section.title)
          formData.append(`sections[${index}][content]`, section.content)
        }

        try {
          await this.$settingRepository.updateSetting('homepage', formData)

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
    onChangeProfilePicture(event) {
      if (!event) {
        this.profilePictureUrl = this.initialProfilePictureUrl
      } else if (this.profilePicture) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profilePictureUrl = e.target.result
        }
        reader.readAsDataURL(this.profilePicture)
      }
    },
    onChangeServicesBannerPicture(event) {
      if (!event) {
        this.servicesBannerPictureUrl = this.initialServicesBannerPictureUrl
      } else if (this.servicesBannerPicture) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.servicesBannerPictureUrl = e.target.result
        }
        reader.readAsDataURL(this.servicesBannerPicture)
      }
    }
  }
}
</script>
