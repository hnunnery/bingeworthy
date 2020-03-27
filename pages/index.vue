<template>
  <v-container fluid class="pt-0 pb-12">
    <!-- DESKTOP NAV START -->
    <v-row class="justify-space-between ma-0 pa-0" no-gutters>
      <v-col cols="12" class="desktop">
        <!-- MENU -->
        <v-row class="align-center justify-center justify-lg-space-between">
          <!-- mobile search bar that drops down when search icon is clicked; for xs and sm -->
          <v-col
            cols="12"
            sm="10"
            md="8"
            lg="4"
            class="mt-3 mx-0 mb-2 px-2 py-0 align-self-center"
            v-show="this.$store.state.searchBar && this.$vuetify.breakpoint.smAndDown"
          >
            <v-text-field
              solo
              rounded
              placeholder="Search"
              v-model="search"
              @click:clear="clearSearch"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            lg="6"
            class="hidden-md-and-down d-inline-flex mt-lg-3 ml-lg-4 mr-0 mb-0 pa-0"
          >
            <v-text-field
              solo
              rounded
              placeholder="Search"
              v-model="search"
              @click:clear="clearSearch"
              clearable
              hide-details
              class="limit-width hidden-md-and-down"
            ></v-text-field>
            <v-btn
              rounded
              large
              class="primary text-capitalize ml-3 hidden-md-and-down"
              @click="onLogout"
              v-if="userAuth"
            >
              <v-icon left>mdi-account-minus</v-icon>Sign Out
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="7"
            lg="5"
            class="hidden-md-and-down mt-lg-3 mr-lg-4 ml-0 pa-0 text-center text-sm-right"
          >
            <v-btn
              rounded
              large
              class="mr-5 primary text-capitalize mr-2 hidden-md-and-down"
              v-if="!userAuth"
              to="/signin"
            >
              <v-icon>mdi-account-check</v-icon>
              <span class>&nbsp;Sign In</span>
            </v-btn>
            <v-btn
              rounded
              large
              class="primary text-capitalize hidden-md-and-down"
              v-if="!userAuth"
              to="/signup"
            >
              <v-icon>mdi-account-plus</v-icon>
              <span class>&nbsp;Sign Up</span>
            </v-btn>
            <v-btn
              rounded
              large
              class="primary text-capitalize mr-2 hidden-md-and-down"
              to="/ratings"
              v-if="userAuth"
            >
              <v-icon left>mdi-star</v-icon>My Ratings
            </v-btn>
            <AddRating v-if="userAuth && this.$vuetify.breakpoint.lgAndUp" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- DESKTOP NAV END -->

    <v-row justify="center">
      <v-col cols="12" lg="11" xl="10" class="mt-0 pt-0">
        <h1
          class="hidden-md-and-down secondary--text text-center font-weight-bold font-italic my-2"
          style="letter-spacing: 2px; font-size: 6vmax;"
        >BingeWorthy</h1>
        <v-row class="justify-center mb-0 pb-0">
          <v-btn
            rounded
            large
            class="mt-md-2 primary text-capitalize"
            v-show="this.search"
            @click="clearSearch"
          >
            <v-icon>mdi-filter-remove</v-icon>&nbsp;Clear Filter
          </v-btn>
        </v-row>

        <!-- PROGRESS SPINNER -->
        <v-row v-show="loading" class="justify-center align-center" style="height: 50vh;">
          <v-col class="text-center">
            <v-progress-circular :size="150" :width="12" color="primary" indeterminate></v-progress-circular>
          </v-col>
        </v-row>

        <!-- START - MOBILE - MASTER RATINGS CARDS -->
        <v-row v-show="!loading" class="hidden-lg-and-up justify-center mt-1">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(rating, index) in filteredMasterRatings"
            :key="index"
            class="pb-0"
          >
            <v-card
              class="px-2 ma-1 align-center d-flex"
              color="rgba(17, 17, 17, 0.5)"
              height="100%"
              elevation="15"
              @click="setSearch(rating.name); expandedName=rating.name;"
              style="box-shadow: 0 0 5px 1px #ceb888 !important;"
            >
              <v-row class="text-center justify-center align-center">
                <v-col cols="12" class="mt-2 py-0" style="font-size: 1.6em;">{{ rating.name }}</v-col>
                <v-col cols="12" class="py-0">
                  <v-rating
                    :value="rating.averageRating"
                    half-increments
                    size="35"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-row class="justify-left" style="margin-bottom: -10px;">
                  <v-col
                    cols="2"
                    class="pl-8 py-0 display-1 font-weight-bold font-italic"
                    style="opacity: 0.2; margin: -15px 0px 0px 0px;"
                  >
                    {{ rating.users.length }}
                    <p
                      v-if="rating.users.length > 1"
                      class="py-0 text-no-wrap"
                      style="font-size: 12px; margin: -20px 0px 0px -10px;"
                    >ratings</p>
                    <p
                      v-else
                      class="py-0 text-no-wrap"
                      style="font-size: 12px; margin: -20px 0px 0px -8px;"
                    >rating</p>
                  </v-col>
                  <v-col
                    cols="8"
                    class="headline font-weight-medium primary--text pa-0"
                  >{{ rating.platform }}</v-col>
                </v-row>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- START MASTER RATINGS CARDS -->
        <v-row v-show="!loading" class="hidden-md-and-down justify-center mt-2 mb-6">
          <v-col
            cols="12"
            lg="4"
            xl="3"
            v-for="(rating, index) in filteredMasterRatings"
            :key="index"
            class="mb-5"
          >
            <v-card
              class="px-4 pt-1 ma-2 align-center d-flex"
              color="rgba(17, 17, 17, 0.7)"
              elevation="15"
              height="100%"
              @click="setSearch(rating.name); expandedName=rating.name;"
              style="box-shadow: 0 0 15px 5px #ceb888 !important; cursor: pointer;"
              data-aos="flip-left"
              data-aos-offset="0"
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-easing="ease-in-out"
              data-aos-once="false"
            >
              <v-row class="text-center justify-center align-center">
                <v-row class="justify-center align-center" style="height: 85px;">
                  <v-col cols="12" class="display-1 py-0 mt-0">{{ rating.name }}</v-col>
                </v-row>
                <v-col cols="12" class="pt-0">
                  <v-rating
                    :value="rating.averageRating"
                    half-increments
                    size="40"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-col
                  cols="12"
                  class="py-0 font-weight-medium primary--text"
                  style="font-size: 1.9em;"
                >{{ rating.platform }}</v-col>
                <v-col
                  v-if="rating.users.length === 1"
                  cols="12"
                  class="title font-weight-light font-italic"
                >Rated by Only {{ rating.users.length }} User</v-col>
                <v-col
                  v-else
                  cols="12"
                  class="title font-weight-light font-italic"
                >Rated by {{ rating.users.length }} Users</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- START - MOBILE - RATINGS CARDS -->
        <v-row v-show="!loading && this.search" class="hidden-lg-and-up justify-center mt-1 mb-6">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="pb-0"
          >
            <v-card
              class="px-2 ma-1 align-center d-flex"
              color="rgba(17, 17, 17, 0.5)"
              height="100%"
              elevation="15"
              style="box-shadow: 0 0 5px 1px #782f40 !important;"
            >
              <v-row class="text-center justify-center align-center">
                <v-col
                  cols="12"
                  class="mt-2 py-0"
                  @click="setSearch(rating.name)"
                  style="font-size: 1.6em;"
                >{{ rating.name }}</v-col>
                <v-col cols="12" class="py-0">
                  <v-rating
                    :value="parseFloat(rating.rating)"
                    half-increments
                    size="35"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-row class="justify-left">
                  <v-col cols="2" class="pl-6 py-0">
                    <EditRating :rating="rating" v-if="userId===rating.userId || userIsAdmin" />
                  </v-col>
                  <v-col
                    cols="8"
                    class="headline py-0 font-weight-medium primary--text"
                    @click="setSearch(rating.platform)"
                  >{{ rating.platform }}</v-col>
                </v-row>
                <v-col
                  cols="12"
                  class="title py-0 mb-2 font-weight-light font-italic"
                  @click="setSearch(rating.user)"
                >{{ rating.user }}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- START RATINGS CARDS -->
        <v-row v-show="!loading && this.search" class="hidden-md-and-down justify-center mt-2 mb-6">
          <v-col
            cols="12"
            lg="4"
            xl="3"
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="mb-5"
          >
            <v-card
              class="px-4 pt-1 ma-2 align-center d-flex"
              color="rgba(17, 17, 17, 0.7)"
              elevation="15"
              height="100%"
              style="box-shadow: 0 0 15px 5px #782f40 !important;"
              data-aos="flip-left"
              data-aos-offset="0"
              data-aos-delay="0"
              data-aos-duration="500"
              data-aos-easing="ease-in-out"
              data-aos-once="false"
            >
              <v-row class="text-center justify-center align-center">
                <v-row class="justify-center align-center" style="height: 85px;">
                  <v-col
                    cols="12"
                    class="display-1 py-0 mt-2"
                    style="cursor: pointer;"
                    @click="setSearch(rating.name)"
                  >{{ rating.name }}</v-col>
                </v-row>
                <v-col cols="12" class="pt-0">
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
                  class="py-0 font-weight-medium primary--text"
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
                  <EditRating :rating="rating" v-if="userId===rating.userId || userIsAdmin" />
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
import { db, auth } from "@/plugins/firebase.js";
import AddRating from "@/components/AddRating";
import EditRating from "@/components/EditRating";

export default {
  components: {
    AddRating,
    EditRating
  },
  data() {
    return {
      search: this.$store.state.search,
      expandedName: ""
    };
  },
  methods: {
    setSearch(prop) {
      this.search = prop;
      setTimeout(() => {
        this.$vuetify.goTo(0);
      }, 50);
    },
    clearSearch() {
      this.search = "";
    },
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("logout");
        this.search = "";
        this.$store.dispatch("loadRatings");
      }
    }
  },
  computed: {
    masterRatings() {
      return this.$store.state.masterRatings;
    },
    ratings() {
      return this.$store.state.ratings;
    },
    names() {
      return this.ratings.map(rating => rating.name);
    },
    filteredMasterRatings() {
      return this.masterRatings.filter(rating => {
        if (!this.expandedName) {
          return (
            rating.name.toLowerCase().match(this.$store.state.search) ||
            rating.platform.toLowerCase().match(this.$store.state.search)
          );
        }
      });
    },
    filteredRatings() {
      return this.ratings.filter(rating => {
        return (
          rating.name.toLowerCase().match(this.$store.state.search) ||
          rating.platform.toLowerCase().match(this.$store.state.search) ||
          rating.user.toLowerCase().match(this.$store.state.search)
        );
      });
    },
    // controls loading progress spinner
    loading() {
      return this.ratings.length < 1;
    },
    userAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    userId() {
      if (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      ) {
        return this.$store.getters.user.id;
      }
    },
    userIsAdmin() {
      if (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      ) {
        if (this.$store.getters.user.id === "FLPuGBEpiyYce5QQuO4azAK0qwk2") {
          return true;
        }
      }
    }
  },
  watch: {
    search() {
      this.$store.commit("setSearch", this.search);
      if (this.search !== this.expandedName) {
        this.expandedName = "";
      }
    }
  },
  created() {
    // fetching events from firebase
    this.$store.dispatch("loadRatings");

    // SEND THE BELOW TO VUEX STORE
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });
  }
};
</script>