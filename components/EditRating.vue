<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
    overlay-color="#1d1d1d"
    overlay-opacity=".97"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        fab
        x-small
        absolute
        bottom
        right
        class="hidden-xs-only secondary--text"
        style="z-index: 1;"
        color="#313131"
        v-on="on"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <!-- FOR XS (MOBILE) SCREEN SIZE ONLY -->
      <v-btn
        fab
        text
        x-small
        class="hidden-sm-and-up secondary--text"
        style="margin-top: -6px; margin-left: 5px; font-size: .9em;"
        v-on="on"
      >
        <v-icon>mdi-cog</v-icon>Edit
      </v-btn>
    </template>
    <v-card class="px-6 py-2" color="#1d1d1d" elevation="15">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="secondary--text text-center font-weight-regular font-italic mt-1 pb-0 modal-title"
          >Edit {{ this.updatedName }}</h2>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-combobox
            type="text"
            name="name"
            label="Name of Show"
            v-model="updatedName"
            :items="this.uniqueNames"
            required
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-combobox
            type="text"
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            v-model="updatedPlatform"
            :items="this.uniquePlatforms"
            required
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="updatedRating" half-increments size="40" color="secondary" required></v-rating>
        </v-col>
        <v-col cols="12" class="pt-1">
          <v-text-field type="text" name="user" label="Your Name" v-model="updatedUser" required></v-text-field>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row>
            <v-col cols="12" class="py-1">
              <v-row class="justify-space-between">
                <v-col cols="2" class="text-left py-0">
                  <v-btn fab small icon @click="removeRating">
                    <v-icon class="error--text" size="38">mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="10" class="text-right py-0">
                  <v-btn
                    large
                    @click="dialog = false"
                    color="#212121"
                    class="secondary--text text-capitalize mx-1 scale-btn"
                  >Cancel</v-btn>
                  <v-btn large @click="updateRating" class="primary text-capitalize mx-1 scale-btn">
                    <v-icon left>mdi-check</v-icon>Update
                  </v-btn>
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
      originalName: this.rating.name,
      updatedName: this.rating.name,
      updatedRating: parseFloat(this.rating.rating),
      updatedPlatform: this.rating.platform,
      updatedUser: this.rating.user,
      ratingId: this.rating.id,
      dialog: false,
      duplicate: false
    };
  },
  computed: {
    uniqueNames() {
      let a = [];
      this.$store.state.names.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    uniquePlatforms() {
      let a = [];
      this.$store.state.platforms.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    userRatings() {
      return this.$store.getters.userRatings;
    }
  },
  methods: {
    updateRating() {
      this.duplicate = false;
      this.userRatings.forEach(rating => {
        if (
          this.updatedName === rating.name &&
          this.updatedName !== this.originalName
        ) {
          this.duplicate = true;
        }
      });
      // saving data to firestore
      if (
        this.updatedName &&
        this.updatedPlatform &&
        this.updatedRating &&
        this.updatedUser &&
        !this.duplicate
      ) {
        const updatedObject = {
          name: this.updatedName,
          rating: this.updatedRating,
          platform: this.updatedPlatform,
          user: this.updatedUser,
          id: this.ratingId
        };
        db.collection("show")
          .doc(this.ratingId)
          .update({
            name: this.updatedName,
            rating: this.updatedRating,
            platform: this.updatedPlatform,
            user: this.updatedUser
          })
          .then(() => {
            this.$store.commit("updateRating", updatedObject);
            this.dialog = false;
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else alert("Please complete all fields.");
    },
    removeRating() {
      if (confirm("Delete this rating")) {
        db.collection("show")
          .doc(this.ratingId)
          .delete()
          .then(() => {
            this.$store.commit("deleteAlert");
            this.dialog = false;
          });
      }
    }
  }
};
</script>

<style>
</style>