<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn dark rounded large class="hidden-md-and-up text-capitalize" color="primary" v-on="on">
        <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
      </v-btn>
      <v-btn
        dark
        rounded
        large
        top
        right
        absolute
        class="hidden-sm-and-down text-capitalize"
        style="padding: 10px 50px;"
        color="primary"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
      </v-btn>
    </template>
    <v-card class="px-6 pt-2 pb-4" color="#111111">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pb-2">
          <h2
            class="secondary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >Add Your Show</h2>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="name" label="Name of Show" v-model="name"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            type="text"
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            v-model="platform"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="rating" half-increments size="35" color="secondary"></v-rating>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="user" label="Your Name" v-model="user"></v-text-field>
        </v-col>
        <v-card-actions>
          <v-btn large @click="dialog = false" class="accent secondary--text mx-2 px-6">Cancel</v-btn>
          <v-btn large @click="addRating" class="primary mx-2 px-4">
            <v-icon>mdi-plus</v-icon>&nbsp;Add Show
          </v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  data() {
    return {
      name: "",
      platform: "",
      rating: 0,
      user: "",
      search: "",
      dialog: false
    };
  },
  methods: {
    addRating() {
      // saving data to firestore
      db.collection("show").add({
        name: this.name,
        platform: this.platform,
        rating: this.rating,
        user: this.user
      });
      this.name = "";
      this.platform = "";
      this.rating = 0;
      this.user = "";
      this.ratings = [];
      this.$store.dispatch("loadRatings");
      this.dialog = false;
    }
  }
};
</script>

<style>
</style>