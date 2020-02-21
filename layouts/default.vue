<template>
  <v-app light>
    <Snackbar></Snackbar>

    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list>
        <v-list-group prepend-icon="mdi-file-document-edit">
          <template v-slot:activator>
            <v-list-item-title>Blog</v-list-item-title>
          </template>

          <v-list-item link :to="{ name: 'blogPost' }">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Liste des articles</v-list-item-title>
          </v-list-item>

          <v-list-item link :to="{ name: 'blogPostCategory' }">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Liste des catégories</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-basket">
          <template v-slot:activator>
            <v-list-item-title>Boutique</v-list-item-title>
          </template>

          <v-list-item link :to="{ name: 'product' }">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Liste des produits</v-list-item-title>
          </v-list-item>

          <v-list-item link :to="{ name: 'productCategory' }">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Liste des catégories</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-file-document-edit">
          <template v-slot:activator>
            <v-list-item-title>Portfolio</v-list-item-title>
          </template>

          <v-list-item link :to="{ name: 'portfolioCategory' }">
            <v-list-item-icon>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Liste des catégories</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item link :to="{ name: 'setting' }">
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Configuration</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="{ name: 'contactMessage' }">
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Messages</v-list-item-title>
        </v-list-item>

        <v-list-item link :to="{ name: 'testimonial' }">
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Témoignages</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar.vue'

export default {
  middleware: 'auth',
  components: { Snackbar },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      rightDrawer: false,
      title: 'Admin Lucie Stauff'
    }
  }
}
</script>
