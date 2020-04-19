<template>
  <v-app-bar dense dark class="hidden-lg-and-up mb-1" color="primary">
    <v-btn text @click="$emit('toggle-menu')" style="margin-left: -16px;">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-spacer />
    <v-toolbar-title
      class="secondary--text font-weight-bold font-italic text-xs-center text-sm-left px-1"
      style="letter-spacing: -1px; font-size: 1.7em; margin-right: 47px;"
    >
      <nuxt-link to="/" class="white--text" style="text-decoration: none;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer />
  </v-app-bar>
</template>