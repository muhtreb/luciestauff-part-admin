<template>
  <div>
    <h1>{{ portfolioCategory.name }}</h1>

    <v-form ref="form" class="form">
      <v-file-input
        type="file"
        multiple
        @change="onSelectImages"
        accept="image/*, video/*"
        placeholder="Choisissez des images à uploader"
        v-model="files"
      />
      <div class="form-loading" v-if="files.length > 0">
        {{ nbMediasUploaded }} / {{ files.length }}<br />
        {{ currentFileUploading }}
      </div>
    </v-form>

    <h2>Medias</h2>
    <draggable
      v-if="medias.length > 0"
      v-model="medias"
      group="people"
      @end="onEndDrag"
      class="draggable-images"
    >
      <div v-for="media in medias" :key="media.id" class="image">
        <img
          :src="
            media.type === 'image' ? media.small_image_url : media.thumbnail_url
          "
        />
        <div class="image-actions">
          <a href="" @click.prevent="deleteMedia(media)">X</a>
        </div>
      </div>
    </draggable>
    <div v-else>Aucune image</div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      medias: [],
      timeoutSort: null,
      nbMediasUploaded: 0,
      currentFileUploading: '',
      files: []
    }
  },
  async asyncData({ route, app }) {
    const portfolioCategoryResponse = await app.$portfolioCategoryRepository.getPortfolioCategoryById(
      route.params.id
    )

    const portfolioCategoryMediasResponse = await app.$portfolioCategoryRepository.getPortfolioCategoryMedias(
      route.params.id
    )
    return {
      portfolioCategory: portfolioCategoryResponse.data,
      medias: portfolioCategoryMediasResponse.data
    }
  },

  computed: {
    getUploadedImages() {
      return this.uploadedMedias.filter((e) => e !== null)
    }
  },
  methods: {
    async onSelectImages(files) {
      this.files = files
      for (const file of Object.values(files)) {
        this.currentFileUploading = file.name
        const formData = new FormData()
        formData.append('file', file)
        formData.append('categoryId', this.$route.params.id)
        try {
          const response = await this.$axios.post(
            'admin/portfolio/medias/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          this.medias.push(response.data.data)

          this.nbMediasUploaded++
        } catch (error) {
          console.log(error)
        }
      }

      this.$store.dispatch(
        'snackbar/snackbarSuccess',
        'Les medias ont bien été uploadés'
      )
      this.files = []
      this.nbMediasUploaded = 0
      this.currentFileUploading = ''
    },
    onEndDrag(event) {
      const ids = this.medias.map((e) => e.id)

      const formData = new FormData()
      for (const [index, id] of Object.entries(ids)) {
        formData.append(`ids[${index}]`, id)
      }

      this.$axios.post(
        `admin/portfolio/categories/${this.$route.params.id}/medias/position`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    },
    async deleteMedia(item) {
      if (!confirm('Êtes vous sûr de vouloir supprimer cette image ?')) {
        return false
      }
      try {
        await this.$axios.delete(`admin/portfolio/medias/${item.id}`)

        const index = this.medias.findIndex((el) => el.id === item.id)

        this.medias.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.form {
  position: relative;
  .form-loading {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }
}
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

.draggable-images {
  display: flex;
  flex-wrap: wrap;
  .image {
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    img {
      height: 150px;
    }
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
