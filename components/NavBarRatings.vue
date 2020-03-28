<template>
  <v-app-bar dense dark class="hidden-lg-and-up" color="#111">
    <v-toolbar-title
      class="hidden-xs-only secondary--text font-weight-bold font-italic"
      style="letter-spacing: 1px; font-size: 1.6em;"
    >
      <nuxt-link to="/" style="text-decoration: none; color: #ceb888;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-toolbar-title
      class="hidden-sm-and-up secondary--text font-weight-bold font-italic"
      style="letter-spacing: 1px;"
    >
      <nuxt-link to="/" style="text-decoration: none; color: #ceb888;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- search for xs screen size -->
    <v-btn
      text
      @click="searchBar=!searchBar"
      class="text-capitalize hidden-sm-and-up"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
    >
      <v-icon>mdi-magnify</v-icon>
      <span v-show="!userAuth">Search</span>
    </v-btn>
    <!-- search for sm and md screen size -->
    <v-btn
      text
      @click="searchBar=!searchBar"
      class="text-capitalize hidden-xs-only hidden-lg-and-up"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
    >
      <v-icon>mdi-magnify</v-icon>
      <span>Search</span>
    </v-btn>

    <v-btn text class="text-capitalize" v-if="!userAuth" to="/signin" style="letter-spacing: .5px;">
      <v-icon>mdi-account-check</v-icon>&nbsp;Sign In
    </v-btn>
    <v-btn
      text
      class="hidden-xs-only text-capitalize"
      v-if="!userAuth"
      to="/signup"
      style="letter-spacing: .5px; margin-left: -6px;"
    >
      <v-icon>mdi-account-plus</v-icon>&nbsp;Sign Up
    </v-btn>
    <v-btn
      text
      class="text-capitalize"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
      @click="onLogout"
      v-if="userAuth"
    >
      <v-icon>mdi-account-remove</v-icon>
      <span class="hidden-xs-only">&nbsp;Sign Out</span>
    </v-btn>
    <v-btn
      text
      class="text-capitalize"
      style="margin-right: 1px; margin-left: -6px; letter-spacing: .5px;"
      to="/"
      v-if="userAuth"
    >
      <v-icon color="white">mdi-home</v-icon>
      <span class="hidden-xs-only">&nbsp;All Ratings</span>
    </v-btn>
    <AddRating v-if="userAuth" />
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
      searchBar: false,
      search: this.$store.state.search
    };
  },
  methods: {
    clearSearch() {
      this.search = "";
    },
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
    search() {
      this.$store.commit("setSearch", this.search);
    },
    searchBar() {
      this.$store.commit("searchBarToggle");
    }
  }
};
</script>
