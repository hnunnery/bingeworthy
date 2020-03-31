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
    <AddRating v-if="userAuth" @click="fab=false"/>
    <v-btn fab color="primary" active-class="no-active" @click="searchBar = !searchBar">
      <v-icon size="35">mdi-magnify</v-icon>
    </v-btn>
    <v-btn v-show="userAuth" fab color="primary" to="/ratings" active-class="white primary--text">
      <v-icon size="35">mdi-star</v-icon>
    </v-btn>
    <v-btn v-show="userAuth" fab color="primary" to="/" active-class="white primary--text">
      <v-icon size="35">mdi-home</v-icon>
    </v-btn>
    <AccountOptions @click="this.fab=false;" />
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
