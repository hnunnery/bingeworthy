<template>
  <v-dialog v-model="dialog" persistent max-width="400" overlay-color="black" overlay-opacity=".97">
    <template v-slot:activator="{ on }">
      <v-btn
        large
        class="hidden-sm-and-down primary text-capitalize mt-md-2 mb-md-1 mx-3 scale-btn"
        v-on="on"
      >
        <v-icon left>mdi-plus</v-icon>Rate This Show
      </v-btn>
      <!-- for xs screen size only -->
      <v-btn
        class="hidden-md-and-up primary text-capitalize"
        style="margin-right: -10px !important;"
        v-on="on"
      >Rate Show</v-btn>
    </template>
    <v-card class="px-6 py-2" elevation="15">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-0">
          <h2
            class="display-1 secondary--text text-center font-weight-regular font-italic my-0 pb-0"
          >{{ name }}</h2>
        </v-col>
        <v-col cols="12" class="mb-0 text-center">
          <span class="display-3 font-weight-regular">{{ rating }}/5</span>
          <v-rating
            v-model="rawRating"
            size="25"
            :length="10"
            dense
            color="gold"
            required
            class="mt-4"
          ></v-rating>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <v-col cols="12" class="text-center mt-2">
              <v-btn
                large
                outlined
                elevation="15"
                @click="dialog = false;"
                class="secondary--text text-capitalize mx-2 px-6 scale-btn"
              >Cancel</v-btn>
              <v-btn
                large
                elevation="15"
                @click="addRating"
                class="primary text-capitalize mx-2 px-4 scale-btn"
              >
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
  props: ["rateName", "ratePlatform"],
  data() {
    return {
      name: this.rateName,
      platform: this.ratePlatform,
      rating: 0,
      user: this.$store.getters.user.name,
      search: "",
      rawRating: 0,
      dialog: false,
      duplicate: false
    };
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
            this.$store.dispatch("createRecentRatings");
            this.$store.commit("addAlert");
            this.name = "";
            this.platform = "";
            this.rating = 0;
            this.dialog = false;
            this.$emit("close-panel");
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else {
        alert("Please complete all fields.");
      }
    }
  },
  computed: {
    userRatings() {
      return this.$store.getters.userRatings;
    }
  },
  watch: {
    rawRating() {
      this.rating = this.rawRating / 2;
    }
  }
};
</script>
