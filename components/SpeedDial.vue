<template>
  <v-speed-dial v-model="fab" direction="bottom" transition="slide-x-transition" absolute top right>
    <template v-slot:activator>
      <v-btn
        fab
        small
        outlined
        v-model="fab"
        active-class="no-active"
        class="secondary--text"
        style="box-shadow: 0 0 3px 1px #ceb888 !important; margin-top: -12px;"
      >
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-menu</v-icon>
      </v-btn>
    </template>
    <AddRating v-if="userAuth" />
    <v-btn fab small color="primary" active-class="no-active" @click="searchBar = !searchBar">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn
      v-show="userAuth"
      fab
      small
      color="primary"
      to="/ratings"
      active-class="accent secondary--text"
    >
      <v-icon>mdi-star</v-icon>
    </v-btn>
    <v-btn v-show="userAuth" fab small color="primary" to="/" active-class="accent secondary--text">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <AccountOptions @click="fab=false" />
  </v-speed-dial>
</template>

<script>
import AddRating from "@/components/AddRating";
import AccountOptions from "@/components/AccountOptions";

export default {
  components: {
    AddRating,
    AccountOptions
  },
  data() {
    return {
      searchBar: false,
      fab: false
    };
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
