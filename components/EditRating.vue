<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn fab x-small absolute bottom right class="text-capitalize" color="primary" v-on="on">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card class="px-6 pt-2 pb-4" color="#111111">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pb-2">
          <h2
            class="primary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >
            Edit
            <span class="secondary--text">{{ this.updatedName }}</span>
          </h2>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="name" label="Name of Show" v-model="updatedName"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            type="text"
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            v-model="updatedPlatform"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="updatedRating" half-increments size="35" color="secondary"></v-rating>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="user" label="Your Name" v-model="updatedUser"></v-text-field>
        </v-col>
        <!-- buttons for mobile -->
        <v-card-actions class="hidden-sm-and-up">
          <v-btn large class="error text-capitalize mx-2" @click="deleteRating()">Delete</v-btn>
          <v-btn large @click="dialog = false" class="accent text-capitalize mx-2">Cancel</v-btn>
          <v-btn large @click="updateRating" class="primary text-capitalize mx-2">Update</v-btn>
        </v-card-actions>
        <!-- buttons for desktop -->
        <v-card-actions class="hidden-xs-only" style="width: 100%;">
          <v-row class="justify-space-between">
            <v-col cols="4" class="text-left">
              <v-btn
                large
                class="secondary primary--text text-capitalize mx-2"
                @click="deleteRating()"
              >Delete</v-btn>
            </v-col>
            <v-col cols="8" class="text-right">
              <v-btn
                large
                @click="dialog = false"
                class="accent secondary--text text-capitalize mx-2"
              >Cancel</v-btn>
              <v-btn large @click="updateRating" class="primary text-capitalize mx-2">Update</v-btn>
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
  props: ["rating"],
  data() {
    return {
      updatedName: this.rating.name,
      updatedRating: parseFloat(this.rating.rating),
      updatedPlatform: this.rating.platform,
      updatedUser: this.rating.user,
      ratingId: this.rating.id.toString(),
      dialog: false
    };
  },
  methods: {
    updateRating() {
      // saving data to firestore
      db.collection("show")
        .doc(this.rating.id)
        .update({
          name: this.updatedName,
          rating: this.updatedRating,
          platform: this.updatedPlatform,
          user: this.updatedUser
        });
      this.$store.dispatch("loadRatings");
      this.dialog = false;
    },
    deleteRating() {
      // removing data from firestore
      if (confirm("Delete this rating")) {
        db.collection("show")
          .doc(this.ratingId)
          .delete();
        this.$store.dispatch("loadRatings");
        this.dialog = false;
      }
    }
  }
};
</script>

<style>
</style>