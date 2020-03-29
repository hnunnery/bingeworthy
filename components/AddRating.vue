<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <!-- button for lg and xl screen sizes -->
      <v-btn
        rounded
        outlined
        large
        class="primary-fill hidden-md-and-down text-capitalize"
        style="box-shadow: 0 0 3px 1px #782f40 !important;"
        v-on="on"
      >
        <v-icon left>mdi-plus</v-icon>Add Your Rating
      </v-btn>
      <!-- button for xs - md screen size -->
      <v-btn
        fab
        small
        outlined
        class="hidden-lg-and-up primary-fill secondary--text text-capitalize mt-6"
        style="box-shadow: 0 0 3px 1px #ceb888 !important;"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card class="px-6 py-2" color="#111111">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="display-1 secondary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >Add Your Show</h2>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-combobox
            name="name"
            label="Name of Show"
            v-model="name"
            :items="this.uniqueNames"
            required
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-combobox
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            v-model="platform"
            :items="this.uniquePlatforms"
            required
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="rating" half-increments size="35" color="secondary" required></v-rating>
        </v-col>
        <v-col cols="12" class="pt-1">
          <v-text-field type="text" name="user" label="Your Name" v-model="user" required></v-text-field>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center py-0">
              <v-btn
                large
                rounded
                outlined
                @click="resetForm"
                class="primary-fill secondary--text text-capitalize mx-2 px-6"
                style="box-shadow: 0 0 3px 1px #782f40 !important;"
              >Cancel</v-btn>
              <v-btn
                large
                rounded
                outlined
                @click="addRating"
                class="success-fill success--text text-capitalize mx-2 px-4"
                style="box-shadow: 0 0 3px 1px #43a047 !important;"
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
    }
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