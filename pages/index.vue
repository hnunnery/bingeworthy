<template>
  <v-container fluid class="ma-0 pa-0">
    <v-app-bar dense dark class="hidden-sm-and-up" color="#111">
      <v-toolbar-title
        class="secondary--text font-weight-bold font-italic"
        style="letter-spacing: 1px; font-size: 5vw;"
      >BingeWorthy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="searchBar=!searchBar"
        class="text-capitalize"
        style="margin-right: -6px; margin-left: -6px;"
      >
        <v-icon>mdi-magnify</v-icon>
        <span v-show="!userAuth" style="letter-spacing: .5px;">Search</span>
      </v-btn>
      <v-btn
        text
        class="text-capitalize"
        v-if="!userAuth"
        to="/signin"
        style="letter-spacing: .5px;"
      >
        <v-icon>mdi-account-check</v-icon>&nbsp;Sign In
      </v-btn>
      <v-btn
        text
        class="text-capitalize"
        style="margin-right: -6px; margin-left: -6px;"
        @click="onLogout"
        v-if="userAuth"
      >
        <v-icon>mdi-account-remove</v-icon>
        <!-- <span class="three-seventy">&nbsp;Sign Out</span> -->
      </v-btn>
      <v-btn
        text
        class="text-capitalize"
        style="margin-right: 1px; margin-left: -6px;"
        color="#111"
        to="/"
        v-if="userAuth"
      >
        <v-icon color="white">mdi-star</v-icon>
      </v-btn>
      <AddRating v-if="userAuth" />
    </v-app-bar>

    <v-container fluid class="svg-bg" style="min-height: 100vh; padding-bottom: 100px;">
      <v-row class="justify-space-between ma-0 pa-0" no-gutters>
        <v-col cols="12" class="desktop">
          <!-- MENU -->
          <v-row
            class="align-center justify-center justify-sm-space-between justify-md-space-between"
            no-gutters
          >
            <!-- mobile search bar that drops down when search icon is clicked -->
            <v-col cols="12" sm="4" v-show="searchBar" class="mt-1 ml-1 mr-0 mb-2 pa-0">
              <v-text-field solo rounded placeholder="Search" v-model="search" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" class="hidden-xs-only mt-1 ml-1 mr-0 mb-2 pa-0">
              <v-text-field
                solo
                rounded
                placeholder="Search"
                v-model="search"
                hide-details
                class="limit-width"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="7"
              class="hidden-xs-only mt-1 mr-1 ml-0 pa-0 text-center text-sm-right"
            >
              <v-btn
                rounded
                large
                class="mr-5 primary text-capitalize mr-2"
                v-if="!userAuth"
                to="/signin"
              >
                <v-icon>mdi-account-check</v-icon>
                <span class>&nbsp;Sign In</span>
              </v-btn>
              <v-btn
                rounded
                large
                class="primary text-capitalize mr-2"
                v-if="!userAuth"
                to="/signup"
              >
                <v-icon>mdi-account-plus</v-icon>
                <span class>&nbsp;Sign Up</span>
              </v-btn>
              <v-btn
                rounded
                large
                class="primary text-capitalize mr-2"
                @click="onLogout"
                v-if="userAuth"
              >
                <v-icon>mdi-account-minus</v-icon>&nbsp;Sign Out
              </v-btn>
              <AddRating v-if="userAuth" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" lg="11" xl="10" class="mt-0 pt-0">
          <h1
            class="hidden-xs-only secondary--text text-center font-weight-bold font-italic my-2"
            style="letter-spacing: 2px; font-size: 6vmax;"
          >BingeWorthy</h1>
          <v-row class="justify-center mb-0 pb-0">
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
            <v-btn
              rounded
              large
              class="accent white--text text-capitalize"
              v-show="this.search"
              @click="clearSearch"
            >
              <v-icon>mdi-filter-remove</v-icon>&nbsp;Clear Filter
            </v-btn>
          </v-row>

          <!-- PROGRESS SPINNER -->
          <v-row v-show="loading" class="justify-center align-center" style="height: 50vh">
            <v-col class="text-center">
              <v-progress-circular :size="150" :width="12" color="primary" indeterminate></v-progress-circular>
            </v-col>
          </v-row>

          <!-- START - MOBILE - MASTER RATINGS CARDS -->
          <v-row v-show="!loading" class="hidden-md-and-up justify-center">
            <v-col
              cols="12"
              sm="6"
              v-for="(rating, index) in filteredMasterRatings"
              :key="index"
              class="pb-0"
            >
              <v-card
                class="px-2 ma-1 align-center d-flex"
                color="rgba(17, 17, 17, 0.5)"
                elevation="15"
                @click="setSearch(rating.name); expandedName=rating.name;"
                style="box-shadow: 0 0 5px 1px #ceb888 !important;"
              >
                <v-row class="text-center justify-center align-center">
                  <v-col cols="12" class="mt-1 pb-0" style="font-size: 1.6em;">{{ rating.name }}</v-col>
                  <v-col cols="12" class="py-0">
                    <v-rating
                      :value="rating.averageRating"
                      half-increments
                      size="30"
                      readonly
                      color="secondary"
                    ></v-rating>
                  </v-col>
                  <v-col
                    cols="12"
                    class="headline pt-0 font-weight-medium primary--text"
                  >{{ rating.platform }}</v-col>
                  <v-btn
                    fab
                    x-small
                    absolute
                    bottom
                    right
                    class="primary body-1"
                  >{{ rating.users.length }}</v-btn>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- START MASTER RATINGS CARDS -->
          <v-row v-show="!loading" class="hidden-sm-and-down justify-center mt-2 mb-6">
            <v-col
              cols="12"
              sm="8"
              md="6"
              lg="4"
              xl="3"
              v-for="(rating, index) in filteredMasterRatings"
              :key="index"
              class="mb-5"
            >
              <v-card
                class="px-4 pt-3 ma-2 align-center d-flex"
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
                  <v-col cols="12" class="display-1 mt-2">{{ rating.name }}</v-col>
                  <v-col cols="12">
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
                    class="pb-2 font-weight-medium primary--text"
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
          <v-row v-show="!loading && this.search" class="hidden-md-and-up justify-center mt-0 mb-6">
            <v-col cols="12" sm="6" v-for="rating in filteredRatings" :key="rating.id" class="pb-0">
              <v-card
                class="px-2 ma-1 align-center d-flex"
                color="rgba(17, 17, 17, 0.5)"
                elevation="15"
                style="box-shadow: 0 0 5px 1px #782f40 !important;"
              >
                <v-row class="text-center justify-center align-center">
                  <v-col
                    cols="12"
                    class="mt-1 pb-0"
                    @click="setSearch(rating.name)"
                    style="font-size: 1.6em;"
                  >{{ rating.name }}</v-col>
                  <v-col cols="12" class="py-0">
                    <v-rating
                      :value="parseFloat(rating.rating)"
                      half-increments
                      size="30"
                      readonly
                      color="secondary"
                    ></v-rating>
                  </v-col>
                  <v-col
                    cols="12"
                    class="headline py-0 font-weight-medium primary--text"
                    @click="setSearch(rating.platform)"
                  >{{ rating.platform }}</v-col>
                  <v-col
                    cols="12"
                    class="title py-0 font-weight-light font-italic"
                    @click="setSearch(rating.user)"
                  >{{ rating.user }}</v-col>
                  <v-card-actions>
                    <EditRating :rating="rating" v-if="userId===rating.userId || userIsAdmin" />
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- START RATINGS CARDS -->
          <v-row
            v-show="!loading && this.search"
            class="hidden-sm-and-down justify-center mt-2 mb-6"
          >
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
                    <EditRating :rating="rating" v-if="userId===rating.userId || userIsAdmin" />
                  </v-card-actions>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
      search: "",
      expandedName: "",
      searchBar: false
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
            rating.name.toLowerCase().match(this.search.toLowerCase()) ||
            rating.platform.toLowerCase().match(this.search.toLowerCase())
          );
        }
      });
    },
    filteredRatings() {
      return this.ratings.filter(rating => {
        return (
          rating.name.toLowerCase().match(this.search.toLowerCase()) ||
          rating.platform.toLowerCase().match(this.search.toLowerCase()) ||
          rating.user.toLowerCase().match(this.search.toLowerCase())
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
      if (this.search !== this.expandedName) {
        this.expandedName = "";
      }
    }
  },
  created() {
    // fetching events from firebase
    this.$store.dispatch("loadRatings");
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });
  }
};
</script>

<style scoped>
.limit-width {
  max-width: 80vw;
}
@media screen and (max-width: 369px) {
  .three-seventy {
    display: none;
  }
}
@media screen and (min-width: 600px) {
  .limit-width {
    max-width: 250px;
  }
}
@media screen and (min-width: 960px) {
  .desktop {
    margin-bottom: -100px;
  }
}
@media screen and (min-width: 1050px) {
  .limit-width {
    width: 290px;
  }
}

@media screen and (min-width: 1200px) {
  .limit-width {
    width: 330px;
  }
}
</style>

<style >
.svg-bg {
  background-repeat: repeat;
  background-color: #111111ad;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
