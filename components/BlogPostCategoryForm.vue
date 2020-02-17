<template>
  <v-form v-model="valid" @submit.prevent="submit" ref="form">
    <v-text-field
      v-model="blogPostCategory.name"
      label="Nom"
      :error-messages="getFieldErrors('name')"
    ></v-text-field>

    <v-btn color="primary" type="submit">Envoyer</v-btn>
  </v-form>
</template>

<script>
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  props: {
    blogPostCategory: {
      type: Object,
      default: () => {
        return {
          name: '',
          slug: ''
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

        formData.append('name', this.blogPostCategory.name)

        try {
          if (this.blogPostCategory.id) {
            await this.$blogPostCategoryRepository.updateBlogPostCategory(
              this.blogPostCategory.id,
              formData
            )
          } else {
            await this.$blogPostCategoryRepository.createBlogPostCategory(
              formData
            )
          }
          this.$router.push({
            name: 'blogPostCategory'
          })
        } catch (error) {
          this.valid = false
          this.errors = error.response.data.errors
          this.submitted = true
        }
      }
    }
  }
}
</script>
