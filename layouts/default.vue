<template>
  <v-app style="overflow: hidden;">
    <v-container
      fluid
      class="svg-bg px-0 pt-0 pb-12"
      style="min-height: 110vh; padding-bottom: 100px;"
    >
      <SpeedDial v-if="this.$vuetify.breakpoint.xsOnly" />
      <NavBar />
      <Success />
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
import NavBar from "@/components/NavBar";
import SpeedDial from "@/components/SpeedDial";
import Success from "@/components/Success";

export default {
  components: {
    NavBar,
    SpeedDial,
    Success
  },
  data() {
    return {
      fab: false
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  },
  created() {
    // fetching events from firebase
    this.$store.dispatch("loadRatings");
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
.modal-title {
  font-size: 1.6em;
}
.limit-width {
  max-width: 210px;
}
.limit-width-no-auth {
  max-width: 270px;
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
.svg-bg {
  background-repeat: repeat;
  background-color: #111111ad;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
