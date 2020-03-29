<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        rounded
        outlined
        large
        class="text-capitalize mt-md-3 mx-3"
        v-on="on"
        style="box-shadow: 0 0 3px 1px #fafafa !important;"
      >
        <v-icon left>mdi-plus</v-icon>Rate This
      </v-btn>
    </template>
    <v-card class="px-6 py-2" color="#111111">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="secondary--text text-center font-weight-regular font-italic mt-0 pb-0 modal-title"
          >Add {{ name }}</h2>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            name="name"
            label="Name of Show"
            :value="name"
            disabled
            required
            type="text"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-text-field
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            :value="platform"
            disabled
            required
            type="text"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="rating" half-increments size="35" color="secondary" required></v-rating>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="user" label="Your Name" v-model="user" required></v-text-field>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center py-0">
              <v-btn
                large
                @click="dialog = false;"
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
    }
  }
};
</script>
