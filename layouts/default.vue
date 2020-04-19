<template>
  <v-app style="overflow: hidden;">
    <v-container fluid class="px-0 pt-0 pb-12" style="min-height: 110vh; padding-bottom: 100px;">
      <MobileNavBar v-if="this.$vuetify.breakpoint.mdAndDown" v-on:toggle-menu="drawer=!drawer" />
      <Success />
      <v-navigation-drawer v-model="drawer" app class="title" width="237px">
        <v-img
          src="https://res.cloudinary.com/missionwebdev/image/upload/c_scale,f_auto,w_110/v1586282035/BingeWorthy/garnet-gold.png"
          alt="logo"
          class="mx-auto mt-5"
          style="width: 110px; height: 110px;"
        ></v-img>

        <v-list-item style="height: 43px;" class="no-active text-center mb-1" @click="updateName">
          <v-list-item-content>
            <v-list-item-title
              v-if="this.$store.state.user"
              class="secondary--text"
            >{{ this.$store.state.user.name }}</v-list-item-title>
            <v-list-item-title v-else class="secondary--text">See what's worth watching</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="primary" />

        <v-list class="ml-5">
          <!-- ALL RATINGS -->
          <v-list-item to="/" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-home-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>All Ratings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- MY RATINGS -->
          <v-list-item to="/ratings" v-if="userAuth" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-star-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>My Ratings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- RECENT RATINGS -->
          <v-list-item to="/recent" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-clock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Recent Ratings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- ADD A RATING -->
          <v-list-item to="/addrating" v-if="userAuth" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add A Rating</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/signin" v-else>
            <v-list-item-icon>
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add A Rating</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- SEARCH -->
          <v-list-item
            v-if="this.$vuetify.breakpoint.mdAndDown"
            @click="searchBar = !searchBar; drawer=false"
          >
            <v-list-item-icon>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Search</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- SIGN IN -->
          <v-list-item to="/signin" v-if="!userAuth" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-account-check-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign In</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- SIGN UP -->
          <v-list-item to="/signup" v-if="!userAuth" active-class="hidden">
            <v-list-item-icon>
              <v-icon>mdi-account-plus-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Up</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <!-- SIGN OUT -->
          <v-list-item @click="onLogout" v-if="userAuth">
            <v-list-item-icon>
              <v-icon>mdi-account-cancel-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <div class="mt-12 ml-12">
          <v-switch v-model="dark" color="secondary" label="Dark Mode"></v-switch>
        </div>
      </v-navigation-drawer>
      <v-btn
        v-show="this.$store.state.ratings"
        large
        absolute
        bottom
        left
        class="secondary primary--text font-weight-bold"
        href="https://github.com/hnunnery/bingeworthy"
        target="_blank"
      >GitHub</v-btn>
      <v-btn
        v-scroll="onScroll"
        v-show="fab"
        fab
        dark
        fixed
        bottom
        right
        color="primary"
        @click="toTop"
      >
        <v-icon size="40">mdi-chevron-up</v-icon>
      </v-btn>
      <v-content>
        <nuxt />
      </v-content>
    </v-container>
  </v-app>
</template>

<script>
import { auth } from "@/plugins/firebase.js";
import MobileNavBar from "@/components/MobileNavBar";
import Success from "@/components/Success";

export default {
  components: {
    MobileNavBar,
    Success
  },
  data() {
    return {
      dark: true,
      fab: false,
      drawer: null,
      searchBar: false
    };
  },
  computed: {
    userDark() {
      return this.$store.getters.userDark;
    },
    userAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    lgAndUp() {
      return this.$vuetify.breakpoint.lgAndUp;
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("logout");
      }
    },
    updateName() {
      if (this.userAuth) {
        if (confirm("Change Display Name?")) {
          this.$router.push("/updatename");
        }
      } else {
        this.$router.push("/signin");
      }
    }
  },
  watch: {
    searchBar() {
      this.$store.commit("searchBarToggle");
    },
    dark() {
      this.$vuetify.theme.dark = this.dark;
      this.$store.commit("setUserDark", this.dark);
      if (this.userAuth) {
        this.$store.dispatch("saveUserDark", this.dark);
      }
    },
    userDark() {
      this.dark = this.userDark;
    },
    lgAndUp() {
      if (this.$vuetify.breakpoint.lgAndUp) {
        this.drawer = true;
      } else {
        this.drawer = false;
      }
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
    // fetching events from firebase
    this.$store.dispatch("loadRatings");
    this.$store.dispatch("createRecentRatings");
    // log returning users in automatically
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });
  }
};
</script>

<style>
.theme--dark.v-navigation-drawer,
.theme--dark.v-card,
.theme--dark.v-expansion-panels {
  background-color: #121212 !important;
}
/* stops route highlighting of nav buttons */
.v-btn--active.no-active::before {
  opacity: 0 !important;
}
.v-btn {
  transition: all 0.2s ease-in-out;
}
.scale-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 0 5px 1px #ceb888 !important;
}
.v-card {
  border-radius: 5px !important;
}
form {
  font-size: 16px !important;
}
.hidden {
  display: none;
}
.modal-title {
  font-size: 1.6em;
}
.limit-width {
  max-width: 210px;
}
@media screen and (max-width: 369px) {
  .three-seventy {
    display: none;
  }
}
@media screen and (min-width: 600px) {
  .modal-title {
    font-size: 2em;
  }
}
@media screen and (min-width: 1264px) {
  .desktop {
    margin-bottom: -100px;
  }
}
@media screen and (min-width: 600px) {
  .svg-bg {
    background-repeat: repeat;
    background-color: #111111ad;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}
</style>
