<template>
  <v-app-bar dense dark class="hidden-sm-and-up mb-1" color="primary">
    <v-spacer />
    <v-toolbar-title
      class="secondary--text font-weight-bold font-italic text-xs-center text-sm-left"
      style="letter-spacing: -1px; font-size: 1.7em; margin-left: 42px;"
    >
      <nuxt-link to="/" class="white--text" style="text-decoration: none;">BingeWorthy</nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-btn text x-small @click="$emit('toggle-menu')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <!-- <v-btn
      fab
      small
      icon
      active-class="no-active"
      class="text-capitalize pa-0"
      style="margin-right: -4px; margin-left: -4px"
      to="/ratings"
      v-if="userAuth"
    >
      <v-icon>mdi-star</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      fab
      small
      icon
      active-class="no-active"
      v-if="userAuth"
      @click="searchBar = !searchBar"
      class="text-capitalize pa-0"
      style="margin-right: -4px; margin-left: -4px; letter-spacing: .5px;"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn
      text
      active-class="no-active"
      v-if="!userAuth"
      @click="searchBar = !searchBar"
      class="text-capitalize body-1 pa-0 mx-1"
      style="letter-spacing: .5px;"
    >
      <v-icon size="15">mdi-magnify</v-icon>Search
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      text
      active-class="no-active secondary--text"
      class="text-capitalize body-1 pa-0 mx-1"
      v-if="!userAuth"
      to="/signin"
      style="letter-spacing: .5px;"
    >
      <v-icon size="15">mdi-account-check</v-icon>Sign In
    </v-btn>
    <AccountOptions v-if="userAuth" />

    <AddRating v-if="userAuth" />-->
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
