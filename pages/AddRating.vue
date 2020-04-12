<template>
  <v-container fluid class="pt-0">
    <v-row class="mt-lg-12 justify-center align-center" style="min-height: 80vh !important;">
      <v-col cols="12" sm="8" md="6" style="max-width: 600px;">
        <v-card class="py-6 px-6 px-lg-10" color="rgba(17, 17, 17, 0.5)" elevation="15">
          <form @submit.prevent="addRating">
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
                    <v-btn type="submit" large class="primary text-capitalize mx-2 px-4 scale-btn">
                      <v-icon size="22" left>mdi-plus</v-icon>Add Rating
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
            this.rawRating = 0;
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
      this.rawRating = 0;
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
