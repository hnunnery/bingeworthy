<template>
  <v-container fluid class="svg-bg" style="min-height: 100vh;">
    <v-layout column>
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10">
          <h1
            class="secondary--text text-center font-weight-bold font-italic my-4"
            style="letter-spacing: 2px; font-size: 6vmax;"
          >BingeWorthy</h1>
          <v-row justify="center">
            <v-btn
              class="mr-3"
              dark
              color="secondary"
              v-show="this.cancel"
              @click="clearSearch"
            >Clear Filter</v-btn>
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on }">
                <v-btn dark color="primary" v-on="on">
                  <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
                </v-btn>
              </template>
              <v-card class="px-6 pt-2 pb-4" color="#111111">
                <v-row align="center" justify="center">
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
                    <v-btn large @click="dialog = false" class="secondary mx-2 px-6">Cancel</v-btn>
                    <v-btn large @click="addRating" class="primary mx-2 px-4">Add Show</v-btn>
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-dialog>
          </v-row>

          <v-row class="justify-center mt-2">
            <v-col
              cols="12"
              sm="8"
              md="6"
              lg="4"
              xl="3"
              v-for="rating in filteredRatings"
              :key="rating.id"
              class="mb-5"
            >
              <v-card class="show-card px-4 pt-3 ma-2" color="#111111ad" elevation="15">
                <v-row align="center" justify="center" class="text-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-col
                        cols="12"
                        v-on="on"
                        class="display-1"
                        style="cursor: pointer;"
                        @click="setSearch(rating.name)"
                      >{{ rating.name }}</v-col>
                    </template>
                    <span>Filter by this Show</span>
                  </v-tooltip>
                  <v-col cols="12">
                    <v-rating
                      :value="parseFloat(rating.rating)"
                      half-increments
                      size="40"
                      color="secondary"
                    ></v-rating>
                  </v-col>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-col
                        cols="12"
                        v-on="on"
                        class="font-weight-medium primary--text"
                        style="cursor: pointer; font-size: 1.9em;"
                        @click="setSearch(rating.platform)"
                      >
                        {{
                        rating.platform
                        }}
                      </v-col>
                    </template>
                    <span>Filter by this Platform</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-col
                        cols="12"
                        v-on="on"
                        class="headline font-weight-light font-italic"
                        style="cursor: pointer;"
                        @click="setSearch(rating.user)"
                      >{{ rating.user }}</v-col>
                    </template>
                    <span>Filter by this User</span>
                  </v-tooltip>
                  <v-card-actions>
                    <v-btn
                      fab
                      x-small
                      absolute
                      bottom
                      right
                      color="primary"
                      @click="deleteRating(rating.id)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  data() {
    return {
      ratings: [],
      name: "",
      platform: "",
      rating: 0,
      user: "",
      search: "",
      dialog: false,
      cancel: false
    };
  },
  methods: {
    addRating() {
      // saving data to firestore
      db.collection("show").add({
        name: this.name,
        platform: this.platform,
        rating: this.rating.toString(),
        user: this.user
      });
      this.name = "";
      this.platform = "";
      this.rating = 0;
      this.user = "";
      this.ratings = [];
      db.collection("show")
        .orderBy("rating", "desc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let rating = doc.data();
            rating.id = doc.id;
            this.ratings.push(rating);
          });
        });
      this.dialog = false;
    },
    deleteRating(id) {
      // removing data from firestore
      if (confirm("Delete this rating")) {
        db.collection("show")
          .doc(id)
          .delete();
        this.ratings = [];
        db.collection("show")
          .orderBy("rating", "desc")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              let rating = doc.data();
              rating.id = doc.id;
              this.ratings.push(rating);
            });
          });
      }
    },
    setSearch(prop) {
      this.search = prop;
      this.cancel = true;
    },
    clearSearch() {
      this.search = "";
      this.cancel = false;
    }
  },
  computed: {
    filteredRatings: function() {
      return this.ratings.filter(rating => {
        return (
          rating.name.match(this.search) ||
          rating.platform.match(this.search) ||
          rating.user.match(this.search)
        );
      });
    }
  },
  created() {
    db.collection("show")
      .orderBy("rating", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let rating = doc.data();
          rating.id = doc.id;
          this.ratings.push(rating);
        });
      });
  }
};
</script>

<style scoped>
.show-card {
  box-shadow: 0 0 20px 0px #ceb88850 !important;
}
.svg-bg {
  background-repeat: repeat;
  background-color: #111111ad;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Cpath fill='%23782f40' fill-opacity='0.21' d='M192 15v2a11 11 0 0 0-11 11c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H145v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11 13 13 0 1 1 .02 26 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43a6.1 6.1 0 0 0-3.03 4.87V143h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 181 164a11 11 0 0 0 11 11v2a13 13 0 0 1-13-13 12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84a6.1 6.1 0 0 0-4.87-3.03H145v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 124 181a11 11 0 0 0-11 11h-2a13 13 0 0 1 13-13c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43a6.1 6.1 0 0 0 3.03-4.87V145h-35.02a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 107 124a11 11 0 0 0-22 0c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H49v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11A13 13 0 0 1 81 192h-2a11 11 0 0 0-11-11c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V145H11.98a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 0 1 0 177v-2a11 11 0 0 0 11-11c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H47v-35.02a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 28 109a13 13 0 1 1 0-26c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43A6.1 6.1 0 0 0 47 84.02V49H11.98a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 11 28 11 11 0 0 0 0 17v-2a13 13 0 0 1 13 13c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84A6.1 6.1 0 0 0 11.98 47H47V11.98a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 68 11 11 11 0 0 0 79 0h2a13 13 0 0 1-13 13 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43A6.1 6.1 0 0 0 49 11.98V47h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 85 68a11 11 0 0 0 22 0c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H143V11.98a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 124 13a13 13 0 0 1-13-13h2a11 11 0 0 0 11 11c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V47h35.02a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 179 28a13 13 0 0 1 13-13zM84.02 143a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 83 124a13 13 0 1 1 26 0c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84a6.1 6.1 0 0 0 4.87 3.03H143v-35.02a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 164 107a11 11 0 0 0 0-22c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V49h-35.02a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 1 1 83 68a12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84A6.1 6.1 0 0 0 84.02 49H49v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 28 85a11 11 0 0 0 0 22c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V143h35.02z'%3E%3C/path%3E%3C/svg%3E");
}
</style>