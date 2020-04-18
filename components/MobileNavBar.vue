<template>
  <v-app-bar dense dark class="hidden-lg-and-up mb-1" color="primary">
    <v-spacer />
    <v-toolbar-title
      class="secondary--text font-weight-bold font-italic text-xs-center text-sm-left px-1"
      style="letter-spacing: -1px; font-size: 1.7em; margin-left: 47px;"
    >
      <nuxt-link to="/" class="white--text" style="text-decoration: none;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-btn text @click="$emit('toggle-menu')" style="margin-right: -16px;">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import AccountOptions from "@/components/AccountOptions";
import AddRating from "@/components/AddRating";

export default {
  components: {
    AccountOptions,
    AddRating
  },
  data() {
    return {
      searchBar: false
    };
  },
  methods: {
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("logout");
        this.search = "";
      }
    }
  },
  computed: {
    userAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  watch: {
    searchBar() {
      this.$store.commit("searchBarToggle");
    }
  }
};
</script>
