<template>
  <v-container>
    <v-layout column>
      <h1 class="mb-4">Binge Watch Ratings</h1>
      <h2 class="mt-2 mb-4">Binge Watch Ratings</h2>
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
          <v-card class="px-6 pt-2 pb-4">
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-text-field type="text" name="name" label="Name of Show" v-model="name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field type="text" name="platform" label="Where to Watch" v-model="platform"></v-text-field>
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
          <v-card class="px-4 pt-3 ma-2">
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
                <span>Filter by Show</span>
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
                    class="headline font-weight-medium primary--text"
                    style="cursor: pointer;"
                    @click="setSearch(rating.platform)"
                  >
                    {{
                    rating.platform
                    }}
                  </v-col>
                </template>
                <span>Filter by Platform</span>
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
                <span>Filter by User</span>
              </v-tooltip>
              <v-card-actions>
                <v-spacer />
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
h1 {
  color: #ceb888;
  font-size: 64px;
  letter-spacing: 2px;
  margin-top: 50px;
  text-align: center;
}

h2 {
  color: #ceb888;
  font-size: 32px;
  letter-spacing: 1.5px;
  margin-top: 30px;
  text-align: center;
  display: none;
}

/* MEDIA QUERIES */

@media only screen and (max-width: 1000px) {
  h1 {
    display: none;
  }
  h2 {
    display: block;
  }
}
</style>
