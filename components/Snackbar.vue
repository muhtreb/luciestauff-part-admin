<template>
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="0" top="top">
    {{ snackbarMessage }}
    <v-btn dark text @click="close">
      Fermer
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      timeout: 6000,
      timeoutId: null
    }
  },
  computed: {
    ...mapState('snackbar', [
      'snackbar',
      'snackbarMessage',
      'snackbarColor',
      'snackbarTimestamp'
    ])
  },
  methods: {
    close() {
      this.$store.dispatch('snackbar/close')
    }
  },
  watch: {
    snackbarTimestamp(val) {
      clearTimeout(this.timeoutId)
      if (this.snackbar) {
        const self = this
        this.timeoutId = setTimeout(function() {
          self.$store.dispatch('snackbar/close')
        }, this.timeout)
      }
    }
  }
}
</script>
