<script>
export default {
  data() {
    return {
      errors: {}
    }
  },
  methods: {
    getFieldErrors(field) {
      return this.submitted && field in this.errors ? this.errors[field] : []
    },
    hasFieldErrors(field) {
      return field in this.errors
    }
  }
}
</script>
