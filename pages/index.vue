<template>
  <v-container>
    <v-layout column justify-center align-center>
      <h1 class="mb-6">Binge Watch Ratings</h1>
      <h2 class="pt-4">Binge Watch Ratings</h2>
      <v-row justify="center">
        <v-btn absolute left top dark color="secondary" :v-show=this.cancel>
          Cancel
        </v-btn>
        <v-dialog v-model="dialog" persistent max-width="800">
          <template v-slot:activator="{ on }">
            <v-btn absolute right top dark color="primary" v-on="on">
              <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
            </v-btn>
          </template>
          <v-card class="pa-6">
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-text-field type="text" name="name" label="Name of Show" v-model="name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="text"
                  name="platform"
                  label="Netflix/Hulu/Disney+"
                  v-model="platform"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field type="text" name="rating" label="Rating (0-5)" v-model="rating"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field type="text" name="user" label="Your Name" v-model="user"></v-text-field>
              </v-col>
              <v-card-actions>
                <v-btn large @click="addRating" class="primary mx-2">Add Show</v-btn>
                <v-btn large @click="dialog = false" class="secondary mx-2">Cancel</v-btn>
              </v-card-actions>
            </v-row>
          </v-card>
        </v-dialog>

        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          xl="3"
          v-for="rating in ratings"
          :key="rating.id"
          class="mb-5"
        >
          <v-card class="px-4 pt-3 ma-2">
            <v-layout>
              <v-flex>
                <v-row align="center" justify="center" class="text-center">
                  <v-col cols="12" class="display-1">{{ rating.name }}</v-col>
                  <v-col cols="12">
                    <v-rating :value="rating.rating" half-increments size="40" color="secondary"></v-rating>
                  </v-col>
                  <v-col cols="12" class="headline font-weight-medium primary--text">
                    {{
                    rating.platform
                    }}
                  </v-col>
                  <v-col cols="12" class="headline font-weight-light font-italic">{{ rating.user }}</v-col>
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
                    > <v-icon>mdi-delete</v-icon></v-btn>
                  </v-card-actions>
                </v-row>
              </v-flex>
            </v-layout>
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
      rating: "",
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
        rating: this.rating,
        user: this.user
      });
      this.name = "";
      this.platform = "";
      this.rating = "";
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
      if (confirm("Delete this event?")) {
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
    }
  },
  computed: {
    filterResults: function() {
      return true
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
  margin-top: 80px;
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
