<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn dark rounded large class="hidden-md-and-up text-capitalize" color="primary" v-on="on">
        <span>Add Your Show</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-6" color="#111111">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="display-1 secondary--text text-center font-italic mt-1 pb-0"
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
        <v-card-actions style="width: 100%;">
          <v-row class="justify-right">
            <v-col cols="12" class="text-right py-0">
              <v-btn
                large
                @click="dialog = false"
                class="accent secondary--text text-capitalize mx-2 px-6"
              >Cancel</v-btn>
              <v-btn large @click="addRating" class="primary text-capitalize mx-2 px-4">
                <v-icon size="22">mdi-plus</v-icon>&nbsp;Add Show
              </v-btn>
            </v-col>
          </v-row>
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