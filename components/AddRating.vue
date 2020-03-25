<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on }">
      <!-- button for lg and xl screen sizes -->
      <v-btn
        dark
        rounded
        large
        class="hidden-md-and-down text-capitalize"
        color="primary"
        v-on="on"
      >
        <v-icon left>mdi-plus</v-icon>Add Rating
      </v-btn>
      <!-- button for medium screen size -->
      <v-btn
        dark
        rounded
        large
        class="hidden-sm-and-down hidden-lg-and-up text-capitalize"
        color="primary"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
        <span class="small-screen">&nbsp;Add</span>&nbsp;Rating
      </v-btn>
      <!-- button for xs and small screen size -->
      <v-btn fab small class="primary hidden-md-and-up text-capitalize mt-8" v-on="on">
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
          <v-combobox
            name="name"
            label="Name of Show"
            v-model="name"
            :items="this.uniqueNames"
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12">
          <v-combobox
            name="platform"
            label="Platform (Netflix, Hulu, etc.)"
            v-model="platform"
            :items="this.uniquePlatforms"
            type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-rating v-model="rating" half-increments size="35" color="secondary"></v-rating>
        </v-col>
        <v-col cols="12">
          <v-text-field type="text" name="user" label="Your Name" v-model="user"></v-text-field>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center py-0">
              <v-btn
                large
                @click="resetForm"
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
        db.collection("show")
          .add({
            name: this.name,
            platform: this.platform,
            rating: this.rating,
            user: this.user,
            userId: this.$store.getters.user.id,
            date: new Date()
          })
          .then(() => {
            this.$store.dispatch("loadRatings");
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

<style scoped>
@media screen and (max-width: 1050px) {
  .small-screen {
    display: none;
  }
}
</style>