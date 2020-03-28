<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        rounded
        large
        class="primary text-capitalize mt-md-2 mx-1"
        v-on="on"
      >
        <v-icon left>mdi-plus</v-icon>Rate This
      </v-btn>
    </template>
    <v-card class="pa-6" color="#111111">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="display-1 secondary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >
            Add Your Show
          </h2>
        </v-col>
        <v-col cols="12">
          <v-combobox
            name="name"
            label="Name of Show"
            :value="name"
            required
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12">
          <v-combobox
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            :value="platform"
            required
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating
            v-model="rating"
            half-increments
            size="35"
            color="secondary"
            required
          ></v-rating>
        </v-col>
        <v-col cols="12">
          <v-text-field
            type="text"
            name="user"
            label="Your Name"
            v-model="user"
            required
          ></v-text-field>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center py-0">
              <v-btn
                large
                @click="resetForm"
                class="accent secondary--text text-capitalize mx-2 px-6"
                >Cancel</v-btn
              >
              <v-btn
                large
                @click="addRating"
                class="primary text-capitalize mx-2 px-4"
              >
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
  props: ["rateName", "ratePlatform"],
  data() {
    return {
      name: this.rateName,
      platform: this.ratePlatform,
      rating: 0,
      user: "",
      search: "",
      dialog: false
    };
  },
  methods: {
    addRating() {
      // saving data to firestore
      if (this.name && this.platform && this.rating && this.user) {
        const newRating = {
          name: this.name,
          platform: this.platform,
          rating: this.rating,
          user: this.user,
          userId: this.$store.getters.user.id,
          date: new Date()
        };
        db.collection("show")
          .add(newRating)
          .then(docRef => {
            // getting document id from firestore
            newRating.id = docRef.id;
            this.$store.commit("addRating", newRating);
            this.name = "";
            this.platform = "";
            this.rating = 0;
            this.user = "";
            this.dialog = false;
          });
      } else {
        alert("Please complete all fields.");
      }
    },
    resetForm() {
      this.name = "";
      this.platform = "";
      this.rating = 0;
      this.user = "";
      this.dialog = false;
    }
  }
};
</script>
