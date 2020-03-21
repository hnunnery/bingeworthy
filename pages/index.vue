<template>
  <v-container fluid class="svg-bg" style="min-height: 120vh; padding-bottom: 100px;">
    <v-row class="justify-space-between ma-0 pa-0" no-gutters>
      <v-col cols="12" class="desktop">
        <v-row class="align-center justify-space-between" no-gutters>
          <v-col cols="6" class="mt-1 ml-1 mr-0 pa-0">
            <v-text-field
              solo
              rounded
              placeholder="Search"
              v-model="search"
              clearable
              hide-details
              @click:clear="clearSearchTime"
              style="width: 250px;"
            ></v-text-field>
          </v-col>
          <v-col cols="5" class="mt-1 mr-1 ml-0 pa-0 text-right">
            <AddRating />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="11" xl="10" class="mt-0">
        <h1
          class="secondary--text text-center font-weight-bold font-italic mt-1 mb-2"
          style="letter-spacing: 2px; font-size: 6vmax;"
        >BingeWorthy</h1>
        <v-row justify="center">
          <v-btn
            large
            rounded
            absolute
            bottom
            left
            class="secondary primary--text font-weight-bold"
            href="https://github.com/hnunnery/bingeworthy"
            target="_blank"
          >GitHub</v-btn>
          <!-- <v-btn rounded large color="accent" v-show="this.search" @click="clearSearch">Clear Filter</v-btn> -->
        </v-row>

        <!-- PROGRESS SPINNER -->
        <v-row v-show="loading" class="justify-center align-center" style="height: 50vh">
          <v-col class="text-center">
            <v-progress-circular :size="150" :width="12" color="primary" indeterminate></v-progress-circular>
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
                >{{ rating.name }}</v-col>
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
                >{{ rating.platform }}</v-col>
                <v-col
                  cols="12"
                  class="headline font-weight-light font-italic"
                  style="cursor: pointer;"
                  @click="setSearch(rating.user)"
                >{{ rating.user }}</v-col>
                <v-card-actions>
                  <EditRating :rating="rating" />
                </v-card-actions>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "@/plugins/firebase.js";
import AddRating from "@/components/AddRating";
import EditRating from "@/components/EditRating";

export default {
  components: {
    AddRating,
    EditRating
  },
  data() {
    return {
      search: "",
      load: false
    };
  },
  methods: {
    setSearch(prop) {
      this.search = prop;
      this.cancel = true;
    },
    clearSearch() {
      this.search = "";
      this.cancel = false;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    clearSearchTime() {
      this.load = true;
      setTimeout(() => {
        this.clearSearch();
        this.load = false;
      }, 50);
    }
  },
  computed: {
    ratings() {
      return this.$store.state.ratings;
    },
    // enables search by filtering
    filteredRatings() {
      if (this.search !== null) {
        return this.ratings.filter(rating => {
          return (
            rating.name.toLowerCase().match(this.search.toLowerCase()) ||
            rating.platform.toLowerCase().match(this.search.toLowerCase()) ||
            rating.user.toLowerCase().match(this.search.toLowerCase())
          );
        });
      }
    },
    // controls loading progress spinner
    loading() {
      return (this.ratings.length < 1) | this.load;
    }
  },
  created() {
    this.$store.dispatch("loadRatings");
  }
};
</script>

<style scoped>
@media screen and (min-width: 960px) {
  .desktop {
    margin-bottom: -100px;
  }
}
.svg-bg {
  background-repeat: repeat;
  background-color: #111111ad;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
