<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="settings"
      :items-per-page="perPage"
      :loading="loading"
      :options.sync="options"
      :server-items-length="pagination ? pagination.total : settings.length"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Liste des paramètres</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <div class="data-table-actions">
          <v-icon class="mr-2" @click="editSetting(item)">
            mdi-pencil
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    showEnded: false,
    loading: false,
    options: {
      sortBy: ['created_at'],
      sortDesc: [true]
    },
    perPage: 10,
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Key', value: 'key' },
      { text: 'Value', value: 'value' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    ...mapState({
      settings: (state) => state.setting.settings,
      pagination: (state) => state.setting.pagination
    })
  },
  methods: {
    async fetchSettings() {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options

      await this.$store.dispatch('setting/getSettings', {
        page,
        per_page: itemsPerPage,
        sort_by: sortBy,
        sort_desc: sortDesc
      })
      this.loading = false
    },
    addSetting() {
      this.$router.push({
        name: 'setting-add'
      })
    },
    editSetting(setting) {
      switch (setting.key) {
        case 'homepage':
          this.$router.push({
            name: 'setting-homepage'
          })
          break
        case 'services':
          this.$router.push({
            name: 'setting-services'
          })
          break
        case 'contact':
          this.$router.push({
            name: 'setting-contact'
          })
          break
        default:
          this.$router.push({
            name: 'setting-key-edit',
            params: { key: setting.key }
          })
          break
      }
    }
  },
  mounted() {
    this.fetchSettings()
  },
  watch: {
    options: {
      handler() {
        this.fetchSettings()
      },
      deep: true
    }
  }
}
</script>
