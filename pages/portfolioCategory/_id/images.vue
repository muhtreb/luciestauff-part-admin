<template>
  <div>
    <h1>{{ portfolioCategory.name }}</h1>

    <v-form ref="form">
      <v-file-input
        type="file"
        multiple
        @change="onSelectImages"
        accept="image/*"
        placeholder="Choisissez des images à uploader"
      />
    </v-form>

    <div v-if="getUploadedImages.length > 0">
      <h2>Images à uploader</h2>
      <div class="uploaded-images">
        <div
          class="uploaded-image"
          v-for="(uploadedImage, index) in getUploadedImages"
          :key="index"
        >
          <img :src="uploadedImage" /><br />
          <div class="uploaded-image-actions">
            <a href="#" @click.prevent="removeUploadedImage(index)">Delete</a
            ><br />
            <a href="#" @click.prevent="uploadImage(index)">Upload</a>
          </div>
        </div>
      </div>
      <v-btn type="button" @click="uploadImages">Upload</v-btn>
    </div>

    <h2>Images</h2>

    <grid
      :draggable="true"
      :sortable="true"
      :items="images"
      :height="200"
      :width="200"
      @sort="onSort"
      v-if="images.length > 0"
    >
      <template slot="cell" scope="props">
        <div
          class="image"
          :style="{ backgroundImage: `url('${props.item.small_image_url}')` }"
        >
          <div class="image-actions">
            <a href="" @click.prevent="deleteImage(props.item)">X</a>
          </div>
        </div>
      </template>
    </grid>
    <div v-else>Aucune image</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      uploadedImages: [],
      images: [],
      timeoutSort: null
    }
  },
  async asyncData({ route, app }) {
    const portfolioCategoryResponse = await app.$portfolioCategoryRepository.getPortfolioCategoryById(
      route.params.id
    )

    const portfolioCategoryImagesResponse = await app.$portfolioCategoryRepository.getPortfolioCategoryImages(
      route.params.id
    )
    return {
      portfolioCategory: portfolioCategoryResponse.data,
      images: portfolioCategoryImagesResponse.data
    }
  },

  computed: {
    getUploadedImages() {
      return this.uploadedImages.filter((e) => e !== null)
    }
  },
  methods: {
    onSelectImages(files) {
      const vm = this
      this.files = [...this.files, ...files]
      if (files) {
        const filesCount = files.length
        for (let i = 0; i < filesCount; i++) {
          const reader = new FileReader()
          reader.onload = function(e) {
            vm.uploadedImages.push(e.target.result)
          }
          reader.readAsDataURL(files[i])
        }
      }
    },
    removeUploadedImage(index) {
      this.uploadedImages.splice(index, 1)
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    async uploadImage(index) {
      const file = this.files[index]

      const formData = new FormData()
      formData.append('image', file)
      formData.append('categoryId', this.$route.params.id)
      try {
        const response = await this.$axios.post(
          'admin/portfolio/images/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        this.images.push(response.data.data)
      } catch (error) {
        console.log(error)
      }

      this.uploadedImages.splice(index, 1, null)
    },
    async uploadImages() {
      for (const index of Object.keys(this.uploadedImages)) {
        await this.uploadImage(index)
      }

      this.files = []
      this.$refs.form.reset()
    },
    onSort(event) {
      clearTimeout(this.timeoutSort)
      this.timeoutSort = setTimeout(() => {
        const ids = event.items.map((e) => e.item.id)

        const formData = new FormData()
        for (const [index, id] of Object.entries(ids)) {
          formData.append(`ids[${index}]`, id)
        }

        this.$axios.post(
          `admin/portfolio/categories/${this.$route.params.id}/images/position`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      }, 1000)
    },
    async deleteImage(item) {
      if (!confirm('Êtes vous sûr de vouloir supprimer cette image ?')) {
        return false
      }
      try {
        await this.$axios.delete(`admin/portfolio/images/${item.id}`)

        const index = this.images.findIndex((el) => el.id === item.id)

        this.images.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  .uploaded-image {
    position: relative;
    margin: 10px;
    background: lightgrey;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 150px;
    }

    .uploaded-image-actions {
      display: none;

      a {
        color: black;
        text-decoration: none;
      }
    }

    &:hover {
      .uploaded-image-actions {
        display: flex;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.images {
  display: flex;
  flex-wrap: wrap;
  .image {
    position: relative;
    margin: 10px;
    padding: 10px;
    background: lightgrey;
    img {
      width: 150px;
    }

    .image-actions {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.v-grid-item-wrapper {
  overflow: hidden;
  .image {
    background-size: cover;
    background-position: center;
    width: 60px;
    height: 60px;
    position: relative;
    .image-actions {
      display: none;
    }
    &:hover {
      .image-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        color: black;
        a {
          color: black;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
