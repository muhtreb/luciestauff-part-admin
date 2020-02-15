export default function({ route, store, app }) {
  if (!store.state.auth.loggedIn) {
    return
  }

  const roles = store.state.auth.user.roles
  let allowed = false

  if (route.name === 'forbidden' || route.name === 'login') {
    return
  }

  if (roles.includes('admin')) {
    allowed = true
  }

  if (!allowed) {
    app.router.push({
      path: '/forbidden'
    })
  }
}
