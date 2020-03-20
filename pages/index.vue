<template>
  <v-container
    fluid
    class="svg-bg"
    style="min-height: 100vh; padding-bottom: 100px;"
  >
    <v-layout column>
      <v-row class="justify-left ma-0 pa-0 hidden-sm-and-down">
        <v-col
          cols="12"
          class="ml-1 mt-1 mr-0 pa-0"
          style="margin-bottom: -100px;"
        >
          <v-text-field
            solo
            rounded
            placeholder="Search"
            v-model="search"
            style="width: 250px;"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10" class="mt-0">
          <h1
            class="secondary--text text-center font-weight-bold font-italic mt-0 mb-4"
            style="letter-spacing: 2px; font-size: 6vmax;"
          >
            BingeWorthy
          </h1>
          <v-row justify="center">
            <v-btn
              class="mr-3"
              dark
              rounded
              large
              color="accent"
              v-show="this.cancel"
              @click="clearSearch"
              >Clear Filter</v-btn
            >
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  rounded
                  large
                  class="hidden-md-and-up text-capitalize"
                  color="primary"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
                </v-btn>
                <v-btn
                  large
                  rounded
                  absolute
                  bottom
                  right
                  class="secondary primary--text"
                  href="https://github.com/hnunnery/bingeworthy"
                  target="_blank"
                  >GitHub</v-btn
                >
                <v-btn
                  dark
                  rounded
                  large
                  top
                  right
                  absolute
                  class="hidden-sm-and-down text-capitalize"
                  style="padding: 10px 50px;"
                  color="primary"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>&nbsp;Add Your Show
                </v-btn>
              </template>
              <v-card class="px-6 pt-2 pb-4" color="#111111">
                <v-row align="center" justify="center">
                  <v-col cols="12" class="pb-0">
                    <h2
                      class="secondary--text text-center font-italic mt-1 pb-0"
                      style="letter-spacing: 1.2px;"
                    >
                      Add Show to List
                    </h2>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="text"
                      name="name"
                      label="Name of Show"
                      v-model="name"
                    ></v-text-field>
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
                    <v-rating
                      v-model="rating"
                      half-increments
                      size="35"
                      color="secondary"
                    ></v-rating>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      type="text"
                      name="user"
                      label="Your Name"
                      v-model="user"
                    ></v-text-field>
                  </v-col>
                  <v-card-actions>
                    <v-btn
                      large
                      @click="dialog = false"
                      class="accent secondary--text mx-2 px-6"
                      >Cancel</v-btn
                    >
                    <v-btn large @click="addRating" class="primary mx-2 px-4">
                      <v-icon>mdi-plus</v-icon>&nbsp;Add Show
                    </v-btn>
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- PROGRESS SPINNER -->
          <v-row
            v-show="loading"
            class="justify-center align-center"
            style="height: 50vh"
          >
            <v-col class="text-center">
              <v-progress-circular
                :size="150"
                :width="12"
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-col>
          </v-row>

          <!-- START RATINGS CARDS -->
          <v-row v-show="!loading" class="justify-center mt-2 mb-6">
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
              <v-card
                class="px-4 pt-3 ma-2 align-center d-flex"
                color="#111111ad"
                elevation="15"
                height="100%"
                style="box-shadow: 0 0 20px 0px #ceb88850 !important;"
                data-aos="flip-left"
                data-aos-offset="0"
                data-aos-delay="0"
                data-aos-duration="500"
                data-aos-easing="ease-in-out"
                data-aos-once="false"
              >
                <v-row class="text-center justify-center align-center">
                  <v-col
                    cols="12"
                    class="display-1 mt-2"
                    style="cursor: pointer;"
                    @click="setSearch(rating.name)"
                    >{{ rating.name }}</v-col
                  >
                  <v-col cols="12">
                    <v-rating
                      :value="parseFloat(rating.rating)"
                      half-increments
                      size="40"
                      readonly
                      color="secondary"
                    ></v-rating>
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-2 font-weight-medium primary--text"
                    style="cursor: pointer; font-size: 1.9em;"
                    @click="setSearch(rating.platform)"
                  >
                    {{ rating.platform }}
                  </v-col>
                  <v-col
                    cols="12"
                    class="headline font-weight-light font-italic"
                    style="cursor: pointer;"
                    @click="setSearch(rating.user)"
                    >{{ rating.user }}</v-col
                  >
                  <v-card-actions>
                    <v-btn
                      fab
                      x-small
                      absolute
                      bottom
                      right
                      class="body-2"
                      color="primary"
                      @click="deleteRating(rating.id)"
                      >X</v-btn
                    >
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
    // enables search by filtering
    filteredRatings() {
      return this.ratings.filter(rating => {
        return (
          rating.name.toLowerCase().match(this.search.toLowerCase()) ||
          rating.platform.toLowerCase().match(this.search.toLowerCase()) ||
          rating.user.toLowerCase().match(this.search.toLowerCase())
        );
      });
    },
    // ratingNames() {
    //   return this.ratings.map(rating => rating.name);
    // },
    // controls loading progress spinner
    loading() {
      return this.ratings.length < 1;
    }
  },
  created() {
    // fetchRatings() method
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
.svg-bg {
  background-repeat: repeat;
  background-color: #111111ad;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
