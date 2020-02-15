<template>
  <v-form v-model="valid" @submit.prevent="submit" ref="form">
    <div class="row">
      <div class="col-auto" v-if="imageUrl && !imageDelete">
        <v-img
          :src="imageUrl"
          v-if="imageUrl"
          width="300px"
          class="mr-3"
        ></v-img>
      </div>
      <div class="col">
        <v-file-input
          name="image"
          v-model="image"
          prepend-icon="mdi-camera"
          label="Image"
          outlined
          accept="image/*"
          :error-messages="getFieldErrors('image')"
          @change="onChangeImage($event)"
          ref="inputImage"
        ></v-file-input>
        <v-checkbox
          v-model="imageDelete"
          label="Supprimer l'image"
        ></v-checkbox>
      </div>
    </div>
    <v-text-field
      v-model="blogPost.title"
      label="Titre"
      :error-messages="getFieldErrors('title')"
    ></v-text-field>
    <v-text-field
      v-model="blogPost.slug"
      label="Slug"
      :error-messages="getFieldErrors('slug')"
    ></v-text-field>

    <div>
      <h3>Contenu</h3>
      <tui-markdown-editor
        v-model="blogPost.content"
        mode="wysiwyg"
        :error-messages="getFieldErrors('content')"
      />
      <div v-if="hasFieldErrors('content')">
        <div
          v-for="(error, index) in getFieldErrors('content')"
          :key="index"
          class="red--text my-2"
        >
          {{ error }}
        </div>
      </div>
    </div>
    <v-btn color="primary" type="submit">Envoyer</v-btn>
  </v-form>
</template>

<script>
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  props: {
    blogPost: {
      type: Object,
      default: () => {
        return {
          title: '',
          image: false,
          content: '',
          slug: ''
        }
      }
    }
  },
  data() {
    return {
      valid: true,
      submitted: false,
      image: null,
      initialImageUrl: null,
      imageUrl: null,
      imageDelete: false
    }
  },
  methods: {
    async submit() {
      this.submitted = false
      this.$refs.form.validate()

      if (this.$refs.form.validate()) {
        const formData = new FormData()
        if (!this.imageDelete) {
          if (this.image) {
            formData.append('image', this.image)
          }
        } else {
          formData.append('image_delete', true)
        }

        formData.append('title', this.blogPost.title)
        formData.append('slug', this.blogPost.slug)
        formData.append('content', this.blogPost.content)

        try {
          if (this.blogPost.id) {
            await this.$blogRepository.updateBlogPost(
              this.blogPost.id,
              formData
            )
          } else {
            await this.$blogRepository.createBlogPost(formData)
          }
          this.$router.push({
            name: 'blog'
          })
        } catch (error) {
          this.valid = false
          this.errors = error.response.data.errors
          this.submitted = true
        }
      }
    },
    onChangeImage(event) {
      if (!event) {
        this.imageUrl = this.initialImageUrl
      } else if (this.image) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageUrl = e.target.result
        }
        reader.readAsDataURL(this.image)
      }
    }
  },
  mounted() {
    this.imageUrl = this.blogPost.imageUrl
    this.initialImageUrl = this.blogPost.imageUrl
  }
}
</script>
