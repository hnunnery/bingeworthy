<template>
  <v-container fluid class="pt-0 pb-12">
    <v-row class="justify-space-between ma-0 pa-0" no-gutters>
      <v-col cols="12" class="desktop">
        <!-- DROP DOWN SEARCH BAR FOR XS-MD BREAKPOINTS; LEAVE ON PAGES -->
        <v-row
          class="align-center justify-center"
          v-show="
            this.$store.state.searchBar && this.$vuetify.breakpoint.mdAndDown
          "
        >
          <v-col cols="12" sm="10" md="6" class="mt-1 mx-0 mb-2 px-2 py-0">
            <v-text-field solo placeholder="Search" v-model="search" hide-details></v-text-field>
          </v-col>
        </v-row>
        <!-- DESKTOP NAV FOR LG AND XL BREAKPOINTS -->
        <v-row class="align-center justify-center justify-lg-space-between">
          <v-col
            cols="12"
            sm="4"
            lg="6"
            class="hidden-md-and-down d-inline-flex mt-lg-3 ml-lg-4 mr-0 mb-0 pa-0"
          >
            <v-text-field
              solo
              placeholder="Search"
              v-model="search"
              hide-details
              :class="{ 'hidden-md-and-down': true, 'limit-width': userAuth, 'limit-width-no-auth': !userAuth }"
            ></v-text-field>
            <AccountOptions v-if="userAuth && this.$vuetify.breakpoint.lgAndUp" />
          </v-col>
          <v-col
            cols="12"
            sm="7"
            lg="5"
            class="hidden-md-and-down mt-lg-3 mr-lg-4 ml-0 pa-0 text-center text-sm-right"
          >
            <v-btn
              large
              class="hidden-md-and-down primary mr-5 text-capitalize scale-btn"
              v-if="!userAuth"
              to="/signin"
            >
              <v-icon left size="20">mdi-account-check</v-icon>Sign In
            </v-btn>
            <v-btn
              large
              class="hidden-md-and-down primary text-capitalize mx-1 scale-btn"
              v-if="!userAuth"
              to="/signup"
            >
              <v-icon left size="20">mdi-account-plus</v-icon>Sign Up
            </v-btn>
            <v-btn
              large
              class="hidden-md-and-down primary text-capitalize mx-1 scale-btn"
              to="/ratings"
              v-if="userAuth"
            >
              <v-icon left size="20">mdi-star</v-icon>My Ratings
            </v-btn>
            <AddRating v-if="userAuth && this.$vuetify.breakpoint.lgAndUp" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- DESKTOP NAV END -->

    <v-row justify="center">
      <v-col cols="12" xl="11" class="mt-0 pt-0 px-5">
        <h1
          class="hidden-md-and-down secondary--text text-center font-weight-bold font-italic my-2"
          style="letter-spacing: -2px; font-size: 6vmax;"
        >BingeWorthy</h1>
        <v-row v-show="this.search" class="justify-center align-center mt-2 mb-0 pb-0">
          <v-btn
            large
            class="hidden-xs-only primary text-capitalize mt-md-2 mb-md-1 mx-3 scale-btn"
            @click="clearSearch"
          >
            <v-icon left>mdi-arrow-left</v-icon>Back / Clear
          </v-btn>
          <v-btn
            text
            dense
            class="hidden-sm-and-up text-capitalize mt-md-2 mb-sm-3 mx-2 py-0"
            @click="clearSearch"
          >
            <v-icon left>mdi-arrow-left</v-icon>Back / Clear
          </v-btn>
          <RateThis
            v-if="expandedName && userAuth && this.$vuetify.breakpoint.smAndUp"
            :rateName="expandedName"
            :ratePlatform="expandedPlatform"
          />
        </v-row>

        <!-- PROGRESS SPINNER -->
        <v-row v-show="loading" class="justify-center align-center" style="height: 80vh;">
          <v-col class="text-center">
            <v-progress-circular :size="150" :width="12" color="primary" indeterminate></v-progress-circular>
          </v-col>
        </v-row>

        <!-- START - MOBILE - MASTER RATINGS CARDS -->
        <v-row
          v-show="!loading"
          class="hidden-sm-and-up justify-center"
          style=" margin: 0px -19px !important;"
        >
          <v-expansion-panels v-model="panel" flat>
            <v-expansion-panel
              v-for="(rating, index) in filteredMasterRatingsMobile"
              :key="index"
              class="pa-0"
              style="background-color: #1d1d1d !important;"
            >
              <v-expansion-panel-header class="pa-0 ma-0">
                <v-row
                  class="text-center justify-center align-center pt-3 px-5"
                  style="padding-bottom: 20px;"
                >
                  <v-col
                    cols="12"
                    class="text-left d-inline-flex pt-0 px-0"
                    style="padding-bottom: 3.5px;"
                  >
                    <span class="title" style="line-height: 1em; margin-top: 5px;">{{ rating.name }}</span>
                    <v-spacer />
                    <v-rating
                      :value="rating.averageRating"
                      color="secondary"
                      size="25"
                      half-icon="mdi-star-half-full"
                      half-increments
                      dense
                      readonly
                    ></v-rating>
                  </v-col>
                  <v-col
                    cols="12"
                    class="accent--text d-inline-flex"
                    style="font-size: 1.02rem; padding: 0px 5px 0px 0px;"
                  >
                    <span style="padding-left: 2px;">
                      <span>#{{ rating.rank }} &nbsp;-&nbsp;</span>
                      {{ rating.platform }}
                    </span>
                    <v-spacer />
                    <span class="mr-2">{{ rating.users.length }} Ratings &nbsp;-</span>

                    <span class="font-weight-bold">{{rating.roundedRating}}</span>
                  </v-col>
                </v-row>
                <template v-slot:actions>
                  <v-icon style="display: none;">$expand</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-col cols="12" class="ml-0 px-0 pt-2 pb-0 d-inline-flex">
                  <v-btn
                    v-if="expandedName !== rating.name"
                    text
                    dense
                    class="pa-0 secondary--text text-capitalize"
                    style="margin-left: -14px !important; font-size: 1rem;"
                    @click="
                setSearch(rating.name);
                expandedName = rating.name;
                expandedPlatform = rating.platform;
                expandedRank = rating.rank;
                expandedRating = rating.averageRating.toFixed(2);
              "
                  >See Individual Ratings</v-btn>
                  <v-spacer />
                  <RateThis
                    v-if="userAuth"
                    v-on:close-panel="panel=false"
                    :rateName="rating.name"
                    :ratePlatform="rating.platform"
                  />
                  <v-btn
                    v-else
                    to="/signin"
                    class="hidden-sm-and-up primary text-capitalize mb-3 mx-2"
                    style="margin-right: -10px !important;"
                  >Rate Show</v-btn>
                </v-col>
              </v-expansion-panel-content>
              <!-- <v-col cols="12" class="text-center pa-0" style="margin: -8px 0px -5px;">
                <v-btn fab text x-small disabled>
                  <v-icon color="accent">$expand</v-icon>
                </v-btn>
              </v-col>-->
              <v-divider class="primary px-0" />
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider class="primary" style="padding: .5px;" />
        </v-row>

        <!-- START SM - MD MASTER RATINGS CARDS -->
        <v-row v-show="!loading" class="hidden-xs-only hidden-lg-and-up justify-center my-0">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="(rating, index) in filteredMasterRatingsMobile"
            :key="index"
            class="pt-1 pt-sm-2 pb-2 px-1"
          >
            <v-card
              class="px-2 ma-1 align-center d-flex"
              color="rgba(29, 29, 29, 0.5)"
              height="100%"
              elevation="15"
              @click="
                setSearch(rating.name);
                expandedName = rating.name;
                expandedPlatform = rating.platform;
                expandedRank = rating.rank;
                expandedRating = rating.averageRating.toFixed(2);
              "
              style="box-shadow: 0 0 5px 1px #ceb888 !important; position: relative;"
            >
              <v-row class="text-center justify-center align-center">
                <v-col cols="12" class="mt-2 py-1" style="font-size: 1.6em; line-height: 1em;">
                  {{
                  rating.name
                  }}
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-rating
                    :value="rating.averageRating"
                    half-increments
                    half-icon="mdi-star-half-full"
                    size="35"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-col
                  cols="3"
                  class="pa-0 display-1 font-weight-bold font-italic text-center"
                  style="opacity: 0.2; margin-right: -10px; position: absolute; bottom: 0; right: 0;"
                >
                  {{ rating.users.length }}
                  <p
                    v-if="rating.users.length > 1"
                    class="pa-0"
                    style="font-size: 12px; margin: -20px 0px -10px 0px;"
                  >ratings</p>
                  <p
                    v-else
                    class="pa-0"
                    style="font-size: 12px; margin: -20px 0px -10px 0px;"
                  >rating</p>
                </v-col>
                <!-- RANKING SECTION -->
                <v-btn
                  fab
                  x-small
                  absolute
                  top
                  left
                  class="font-weight-bold secondary--text"
                  style="font-size: 1.2em; letter-spacing: .1px;"
                >
                  <span style="margin-right: 2px;">{{ rating.rank }}</span>
                </v-btn>

                <!-- IF EXPANDED NAME -->
                <v-col
                  cols="12"
                  v-if="expandedName===rating.name"
                  class="headline font-weight-medium pa-0 mb-1"
                  style="color: #782F40;"
                >{{rating.roundedRating}} Average</v-col>

                <!-- PLATFORM -->
                <v-col
                  v-else
                  cols="12"
                  class="headline font-weight-medium pa-0 mb-1"
                  style="color: #782F40;"
                >{{ rating.platform }}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- START MASTER RATINGS CARDS -->
        <v-row v-show="!loading" class="hidden-md-and-down justify-center mt-2 mb-1">
          <v-col
            cols="12"
            lg="4"
            xl="3"
            v-for="(rating, index) in filteredMasterRatingsDesktop"
            :key="index"
          >
            <v-card
              class="px-4 pt-1 ma-0 align-center d-flex"
              color="rgba(29, 29, 29, 0.7)"
              elevation="15"
              height="100%"
              @click="
                setSearch(rating.name);
                expandedName = rating.name;
                expandedPlatform = rating.platform;
                expandedRank = rating.rank;
                expandedRating = rating.averageRating.toFixed(2);
              "
              style="box-shadow: 0 0 10px 3px #ceb888 !important; cursor: pointer;"
            >
              <v-row class="text-center justify-center align-center">
                <v-row class="justify-center align-center" style="height: 80px;">
                  <v-col cols="12" class="display-1 py-0 mt-0" style="line-height: 1em;">
                    {{
                    rating.name
                    }}
                  </v-col>
                </v-row>
                <v-col cols="12" class="py-0" style="margin-top: -10px;">
                  <v-rating
                    :value="rating.averageRating"
                    half-increments
                    half-icon="mdi-star-half-full"
                    size="40"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <!-- IF EXPANDED NAME -->
                <v-col
                  cols="12"
                  v-if="expandedName===rating.name"
                  class="headline font-weight-medium pa-0 mb-3"
                  style="color: #782F40;"
                >{{rating.roundedRating}} Average</v-col>

                <!-- PLATFORM -->
                <v-col
                  cols="12"
                  v-else
                  class="pa-0 mb-2 font-weight-medium"
                  style="font-size: 1.9em; color: #782F40;"
                >{{ rating.platform }}</v-col>
                <v-col
                  cols="3"
                  class="pa-0 display-1 font-weight-bold font-italic text-center"
                  style="opacity: 0.2; margin-right: -15px; position: absolute; bottom: 0; right: 0;"
                >
                  {{ rating.users.length }}
                  <p
                    v-if="rating.users.length > 1"
                    class="pa-0"
                    style="font-size: 12px; margin: -20px 0px -10px 0px;"
                  >ratings</p>
                  <p
                    v-else
                    class="pa-0"
                    style="font-size: 12px; margin: -20px 0px -10px 0px;"
                  >rating</p>
                </v-col>
                <!-- RANKING SECTION -->
                <v-btn
                  fab
                  x-small
                  absolute
                  top
                  left
                  class="primary"
                  style="font-size: 1.2em; letter-spacing: .1px;"
                >
                  <span style="margin-right: 2px;">{{ rating.rank }}</span>
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- START - MOBILE - RATINGS CARDS -->
        <v-row v-show="!loading && this.search" class="hidden-sm-and-up justify-center my-0">
          <v-col
            cols="12"
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="pa-0"
            style="position: relative;"
          >
            <v-row class="text-center justify-center align-center py-3 px-4">
              <v-col
                cols="12"
                class="text-left d-inline-flex pt-0 px-0"
                style="padding-bottom: 0px;"
              >
                <span
                  class="title"
                  style="line-height: 1em; margin-top: 5px;"
                  @click="setSearch(rating.name)"
                >{{ rating.name }}</span>
                <v-spacer />
                <v-rating
                  :value="parseFloat(rating.rating)"
                  color="secondary"
                  size="25"
                  half-icon="mdi-star-half-full"
                  half-increments
                  dense
                  readonly
                ></v-rating>
              </v-col>
              <v-col
                cols="12"
                class="accent--text d-inline-flex py-0 pl-0 pr-1"
                style="font-size: 1.02rem;"
              >
                <span
                  @click="setSearch(rating.platform)"
                  style="padding-left: 2px; margin-right: 15px;"
                >{{ rating.platform }}</span>
                <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
                <v-spacer />
                <span @click="setSearch(rating.user)">{{ rating.user }}</span>
              </v-col>
            </v-row>
            <v-divider class="primary px-0" />
          </v-col>
        </v-row>

        <!-- START SM - MD RATINGS CARDS -->
        <v-row
          v-if="!loading && this.search"
          class="hidden-xs-only hidden-lg-and-up justify-center mt-0 mb-6"
        >
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="pb-0 px-1"
          >
            <v-card
              class="px-2 ma-1 align-center d-flex"
              color="rgba(29, 29, 29, 0.5)"
              height="100%"
              elevation="15"
              style="box-shadow: 0 0 5px 1px #782f40 !important;"
            >
              <v-row class="text-center justify-center align-center">
                <v-col
                  cols="12"
                  class="mt-2 py-1"
                  @click="setSearch(rating.name)"
                  style="font-size: 1.6em; line-height: 1em;"
                >{{ rating.name }}</v-col>
                <v-col cols="12" class="py-0">
                  <v-rating
                    :value="parseFloat(rating.rating)"
                    half-increments
                    half-icon="mdi-star-half-full"
                    size="35"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-row class="justify-left">
                  <v-col cols="2" class="pl-6 py-0">
                    <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
                  </v-col>
                  <v-col
                    cols="8"
                    class="headline py-0 font-weight-medium"
                    style="color: #782F40;"
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
        <v-row v-if="!loading && this.search" class="hidden-md-and-down justify-center mt-2 mb-6">
          <v-col cols="12" lg="4" xl="3" v-for="rating in filteredRatings" :key="rating.id">
            <v-card
              class="px-4 pt-1 ma-0 align-center d-flex"
              color="rgba(29, 29, 29, 0.7)"
              elevation="15"
              height="100%"
              style="box-shadow: 0 0 5px 1px #782f40 !important;"
            >
              <v-row class="text-center justify-center align-center">
                <v-row class="justify-center align-center" style="height: 80px;">
                  <v-col
                    cols="12"
                    class="display-1 py-0 mt-2"
                    style="cursor: pointer; line-height: 1em;"
                    @click="setSearch(rating.name)"
                  >{{ rating.name }}</v-col>
                </v-row>
                <v-col cols="12" class="py-0" style="margin-top: -10px;">
                  <v-rating
                    :value="parseFloat(rating.rating)"
                    half-increments
                    half-icon="mdi-star-half-full"
                    size="40"
                    readonly
                    color="secondary"
                  ></v-rating>
                </v-col>
                <v-col
                  cols="12"
                  class="py-0 font-weight-medium"
                  style="cursor: pointer; font-size: 1.9em; color: #782F40;"
                  @click="setSearch(rating.platform)"
                >{{ rating.platform }}</v-col>
                <v-col
                  cols="12"
                  class="headline font-weight-light font-italic pt-1"
                  style="cursor: pointer;"
                  @click="setSearch(rating.user)"
                >{{ rating.user }}</v-col>
                <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddRating from "@/components/AddRating";
import EditRating from "@/components/EditRating";
import RateThis from "@/components/RateThis";
import AccountOptions from "@/components/AccountOptions";

export default {
  components: {
    AddRating,
    EditRating,
    RateThis,
    AccountOptions
  },
  data() {
    return {
      search: "",
      expandedName: "",
      expandedPlatform: "",
      expandedRank: "",
      expandedRating: "",
      panel: false
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
    filteredMasterRatingsMobile() {
      return this.masterRatings.filter(rating => {
        if (this.expandedName) {
          return rating.name === this.expandedName;
        } else {
          return (
            rating.name
              .toLowerCase()
              .replace(/[^a-zA-Z ]/g, "")
              .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, "")) ||
            rating.platform
              .toLowerCase()
              .replace(/[^a-zA-Z ]/g, "")
              .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, ""))
          );
        }
      });
    },
    filteredMasterRatingsDesktop() {
      return this.masterRatings.filter(rating => {
        return (
          rating.name
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, "")) ||
          rating.platform
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
            .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, ""))
        );
      });
    },
    filteredRatings() {
      return this.ratings.filter(rating => {
        if (!this.expandedName) {
          return (
            rating.name
              .toLowerCase()
              .replace(/[^a-zA-Z ]/g, "")
              .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, "")) ||
            rating.user
              .toLowerCase()
              .replace(/[^a-zA-Z ]/g, "")
              .match(this.search.toLowerCase().replace(/[^a-zA-Z ]/g, ""))
          );
        } else {
          return rating.name === this.expandedName;
        }
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
        if (this.$store.getters.user.id === this.$store.state.admin) {
          return true;
        }
      }
    }
  },
  watch: {
    search() {
      if (this.search !== this.expandedName.replace(/[^a-zA-Z ]/g, "")) {
        this.expandedName = "";
        this.expandedPlatform = "";
      }
    }
  }
};
</script>