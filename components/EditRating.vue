<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn fab x-small absolute bottom right class="text-capitalize" color="primary" v-on="on">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-6" color="#111111">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="py-1">
          <h2
            class="display-1 primary--text text-center font-italic mt-1 pb-0"
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
        <v-card-actions style="width: 100%;">
          <v-row>
            <v-col cols="12" class="py-0">
              <v-row class="justify-space-between">
                <v-col cols="2" class="text-left py-0">
                  <v-btn fab small class="error mx-2" @click="deleteRating()">
                    <v-icon size="22">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="10" class="text-right py-0">
                  <v-btn large @click="dialog = false" class="accent text-capitalize mx-1">Cancel</v-btn>
                  <v-btn large @click="updateRating" class="success text-capitalize mx-1">Update</v-btn>
                </v-col>
              </v-row>
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