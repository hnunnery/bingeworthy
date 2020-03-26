<template>
  <v-app-bar dense dark class="hidden-lg-and-up" color="#111">
    <v-toolbar-title
      class="b-text secondary--text font-weight-bold font-italic"
      style="letter-spacing: 1px;"
    >
      <nuxt-link to="/" style="text-decoration: none; color: #ceb888;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      text
      @click="searchBar=!searchBar"
      class="text-capitalize hidden-sm-only hidden-md-only"
      style="margin-right: -6px; margin-left: -6px; letter-spacing: .5px;"
    >
      <v-icon>mdi-magnify</v-icon>
      <span v-show="!userAuth">Search</span>
    </v-btn>
    <v-btn
      text
      @click="searchBar=!searchBar"
      class="text-capitalize hidden-xs-only"
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
      to="/ratings"
      v-if="userAuth"
    >
      <v-icon color="white">mdi-star</v-icon>
      <span class="hidden-xs-only">&nbsp;My Ratings</span>
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
