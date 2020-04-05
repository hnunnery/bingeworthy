<template>
  <v-app-bar dense dark class="hidden-lg-and-up mb-xs-1" color="#111">
    <!-- <v-spacer class="hidden-sm-and-up"></!-->
    <v-toolbar-title
      class="hidden-xs-only secondary--text font-weight-bold font-italic text-xs-center text-sm-left"
      style="letter-spacing: 1px; font-size: 1.9em;"
    >
      <nuxt-link to="/" style="text-decoration: none; color: #ceb888;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- navbar for sm and md screen sizes -->
    <v-btn
      v-if="userAuth"
      text
      active-class="no-active secondary--text"
      class="hidden-xs-only mr-md-4 text-capitalize"
      to="/"
      style="margin-left: -6px; margin-right: -6px;"
    >
      <v-icon left>mdi-home</v-icon>Home
    </v-btn>
    <v-btn
      text
      active-class="no-active secondary--text"
      class="hidden-xs-only mr-md-4 text-capitalize"
      style="margin-right: 1px; margin-left: -6px; letter-spacing: .5px;"
      to="/ratings"
      v-if="userAuth"
    >
      <v-icon left>mdi-star</v-icon>Ratings
    </v-btn>

    <!-- search for sm and md screen size -->
    <v-btn
      text
      active-class="no-active"
      @click="searchBar = !searchBar"
      class="text-capitalize hidden-xs-only hidden-lg-and-up mr-md-4"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
    >
      <v-icon left>mdi-magnify</v-icon>Search
    </v-btn>

    <v-btn
      text
      active-class="no-active secondary--text"
      class="hidden-xs-only text-capitalize mr-md-4"
      v-if="!userAuth"
      to="/signin"
      style="letter-spacing: .5px;"
    >
      <v-icon left>mdi-account-check</v-icon>Sign In
    </v-btn>
    <v-btn
      text
      active-class="no-active secondary--text"
      class="hidden-xs-only mr-md-4 text-capitalize"
      v-if="!userAuth"
      to="/signup"
      style="letter-spacing: .5px; margin-left: -6px;"
    >
      <v-icon left>mdi-account-plus</v-icon>Sign Up
    </v-btn>
    <v-btn
      text
      active-class="no-active"
      class="hidden-xs-only mr-md-4 text-capitalize"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
      @click="onLogout"
      v-if="userAuth"
    >
      <v-icon left>mdi-account-remove</v-icon>Sign Out
    </v-btn>

    <!-- Add Rating Component -->
    <AddRating v-if="userAuth && this.$vuetify.breakpoint.smAndUp" />
  </v-app-bar>
</template>

<script>
import AddRating from "@/components/AddRating";

export default {
  components: {
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
        this.$store.dispatch("loadRatings");
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
