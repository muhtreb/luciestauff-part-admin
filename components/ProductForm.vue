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
      v-model="product.title"
      label="Titre"
      :error-messages="getFieldErrors('title')"
      outlined
    ></v-text-field>
    <v-text-field
      v-model="product.url"
      label="URL"
      :error-messages="getFieldErrors('url')"
      outlined
    ></v-text-field>
    <v-autocomplete
      v-model="product.categories"
      :items="productCategories"
      item-value="id"
      item-text="name"
      outlined
      chips
      small-chips
      label="Catégories"
      multiple
    ></v-autocomplete>
    <v-btn color="primary" type="submit">Envoyer</v-btn>
  </v-form>
</template>

<script>
import { mapState } from 'vuex'
import FormErrors from '@/components/mixins/FormErrors'

export default {
  mixins: [FormErrors],

  props: {
    product: {
      type: Object,
      default: () => {
        return {
          title: '',
          image: false,
          slug: '',
          url: '',
          categories: []
        }
      }
    }
  },
  computed: {
    ...mapState('productCategory', ['productCategories'])
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

        formData.append('title', this.product.title)
        formData.append('url', this.product.url)
        for (const category of Object.values(this.product.categories)) {
          formData.append(
            'categories[]',
            typeof category === 'object' ? category.id : category
          )
        }

        try {
          if (this.product.id) {
            await this.$productRepository.updateProduct(
              this.product.id,
              formData
            )
          } else {
            await this.$productRepository.createProduct(formData)
          }
          this.$router.push({
            name: 'product'
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
    this.imageUrl = this.product.imageUrl
    this.initialImageUrl = this.product.imageUrl
    this.$store.dispatch('productCategory/getProductCategories', {
      per_page: -1
    })
  }
}
</script>
