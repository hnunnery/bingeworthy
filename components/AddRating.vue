<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
    overlay-color="#1d1d1d"
    overlay-opacity=".97"
  >
    <template v-slot:activator="{ on }">
      <!-- button for lg and xl screen sizes -->
      <v-btn large class="hidden-md-and-down primary text-capitalize mx-1 scale-btn" v-on="on">
        <v-icon left size="20">mdi-plus-circle-outline</v-icon>Rating
      </v-btn>
      <!-- button for sm - md screen size -->
      <v-btn
        fab
        small
        class="hidden-xs-only hidden-lg-and-up primary text-capitalize mt-4"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <!-- button for xs only -->
      <v-btn fab small elevation="15" class="hidden-sm-and-up primary mt-3 ml-1" v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card class="px-6 py-2" color="#1d1d1d" elevation="15">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="display-1 secondary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >Add Your Rating</h2>
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
        <v-col cols="12" class="text-center pt-0 pb-3">
          <span class="display-2 secondary--text">{{ rating }}/5</span>
          <v-rating
            :length="10"
            class="mt-2"
            v-model="rawRating"
            size="25"
            dense
            color="secondary"
            required
          ></v-rating>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center mt-2">
              <v-btn
                large
                @click="resetForm"
                color="#212121"
                class="secondary--text text-capitalize mx-2 px-6 scale-btn"
              >Cancel</v-btn>
              <v-btn large @click="addRating" class="primary text-capitalize mx-2 px-4 scale-btn">
                <v-icon size="22" left>mdi-plus</v-icon>Add Rating
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
      rating: 0,
      platform: "",
      user: this.$store.getters.user.name,
      search: "",
      rawRating: 0,
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
    ratings() {
      return this.$store.getters.ratingsChange;
    },
    userRatings() {
      return this.$store.getters.userRatings;
    }
  },
  methods: {
    addRating() {
      this.duplicate = false;
      this.userRatings.forEach(rating => {
        if (this.name === rating.name) {
          this.duplicate = true;
        }
      });
      // saving data to firestore
      if (
        this.name &&
        this.platform &&
        this.rating &&
        this.user &&
        !this.duplicate
      ) {
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
            this.$store.commit("addAlert");
            this.name = "";
            this.platform = "";
            this.rating = 0;
            this.dialog = false;
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
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
  },
  watch: {
    name() {
      this.ratings.forEach(rating => {
        if (this.name === rating.name) {
          this.platform = rating.platform;
        }
      });
    },
    rawRating() {
      this.rating = this.rawRating / 2;
    }
  }
};
</script>
