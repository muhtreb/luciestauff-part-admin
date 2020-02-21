<template>
  <div>
    <h1>{{ portfolioCategory.name }}</h1>

    <v-form ref="form">
      <v-file-input
        type="file"
        multiple
        @change="onSelectImages"
        accept="image/*"
      />
    </v-form>

    <div v-if="uploadedFiles.length > 0">
      <h2>Images à uploader</h2>
      <div class="uploaded-images">
        <div
          class="uploaded-image"
          v-for="(uploadedFile, index) in uploadedFiles"
          :key="index"
        >
          <img :src="uploadedFile" /><br />
          <div class="uploaded-image-actions">
            <a href="#" @click.prevent="removeUploadedFile(index)">Delete</a>
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
      :items="files"
      :height="200"
      :width="200"
    >
      <template slot="cell" scope="props">
        <div
          class="image"
          :style="{ backgroundImage: `url('${props.item}')` }"
        ></div>
      </template>
    </grid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      uploadedFiles: []
    }
  },
  async asyncData({ route, app }) {
    const response = await app.$portfolioCategoryRepository.getPortfolioCategoryById(
      route.params.id
    )
    return {
      portfolioCategory: response.data
    }
  },
  methods: {
    onSelectImages(files) {
      const vm = this
      if (files) {
        const filesCount = files.length
        for (let i = 0; i < filesCount; i++) {
          const reader = new FileReader()
          reader.onload = function(e) {
            vm.uploadedFiles.push(e.target.result)
          }
          reader.readAsDataURL(files[i])
        }
      }
    },
    removeUploadedFile(index) {
      this.uploadedFiles.splice(index, 1)
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    uploadImage(index) {
      const file = this.uploadedFiles[index]

      this.uploadedFiles.splice(index, 1)
      this.files.push(file)
    },
    uploadImages() {
      const uploadedFiles = Object.assign({}, this.uploadedFiles)
      const files = []
      for (const [index, image] of Object.entries(uploadedFiles)) {
        console.log(index)
        files.push(image)
      }

      this.uploadedFiles = []
      this.files = files
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
    padding: 10px;
    background: lightgrey;
    img {
      width: 150px;
    }

    .uploaded-image-actions {
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
  }
}
</style>
