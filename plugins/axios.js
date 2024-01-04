export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    config.headers.common['X-AUTH-TOKEN'] = process.env.ADMIN_AUTH_TOKEN
  })
}
