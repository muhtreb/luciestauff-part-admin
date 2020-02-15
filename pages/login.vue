<template>
  <v-container>
    <v-row justify="center">
      <v-col lg="4" md="8" sm="12">
        <h1>Connectez-vous</h1>
        <v-form @submit.prevent="submitLogin">
          <v-text-field
            v-model="email"
            label="Votre email"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="password"
            label="Votre mot de passe"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Je me connecte</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submitLogin() {
      this.$axios
        .get(process.env.airlockCsrfCookieUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true
        })
        .then(
          function() {
            this.$auth.loginWith('local', {
              data: {
                email: this.email,
                password: this.password
              }
            })
          }.bind(this)
        )
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
