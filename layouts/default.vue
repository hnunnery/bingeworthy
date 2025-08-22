<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-hidden">
    <div class="flex">
      <MobileNavBar v-if="!smAndUp" v-on:toggle-menu="drawer=!drawer" />
      <Success />
      <!-- Navigation Drawer -->
      <div 
        :class="[
          'fixed inset-y-0 left-0 z-50 w-60 bg-surface border-r border-primary/30 transform transition-transform duration-300 ease-in-out',
          smAndUp ? 'translate-x-0' : (drawer ? 'translate-x-0' : '-translate-x-full')
        ]"
      >
        <img
          src="https://res.cloudinary.com/missionwebdev/image/upload/c_scale,f_auto,w_110/v1586282035/BingeWorthy/garnet-gold.png"
          alt="logo"
          class="mx-auto mt-5 w-28 h-28"
        />

        <div class="h-11 text-center mb-1 cursor-pointer py-2" @click="updateName">
          <div class="text-secondary font-medium">
            <div v-if="this.$store.state.user">{{ this.$store.state.user.name }}</div>
            <div v-else>See what's worth watching</div>
          </div>
        </div>

        <div class="border-t border-gray-600 my-2"></div>

        <nav class="px-2">
          <!-- ALL RATINGS -->
          <nuxt-link to="/" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-home w-6 text-center mr-3 text-secondary"></i>
            <span>All Ratings</span>
          </nuxt-link>

          <!-- MY RATINGS -->
          <nuxt-link v-if="userAuth" to="/ratings" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-star w-6 text-center mr-3 text-secondary"></i>
            <span>My Ratings</span>
          </nuxt-link>

          <!-- RECENT RATINGS -->
          <nuxt-link to="/recent" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-clock w-6 text-center mr-3 text-secondary"></i>
            <span>Recent Ratings</span>
          </nuxt-link>

          <!-- ADD A RATING -->
          <nuxt-link v-if="userAuth" to="/addrating" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-plus-circle w-6 text-center mr-3 text-secondary"></i>
            <span>Add A Rating</span>
          </nuxt-link>
          <nuxt-link v-else to="/signin" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-plus-circle w-6 text-center mr-3 text-secondary"></i>
            <span>Add A Rating</span>
          </nuxt-link>

          <!-- SEARCH -->
          <button @click="searchBar = !searchBar; drawer=false" class="w-full flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-search w-6 text-center mr-3 text-secondary"></i>
            <span>Search</span>
          </button>

          <!-- SIGN IN -->
          <nuxt-link v-if="!userAuth" to="/signin" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-sign-in-alt w-6 text-center mr-3 text-secondary"></i>
            <span>Sign In</span>
          </nuxt-link>

          <!-- SIGN UP -->
          <nuxt-link v-if="!userAuth" to="/signup" class="flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-user-plus w-6 text-center mr-3 text-secondary"></i>
            <span>Sign Up</span>
          </nuxt-link>

          <!-- SIGN OUT -->
          <button v-if="userAuth" @click="onLogout" class="w-full flex items-center px-3 py-3 text-white hover:bg-primary/20 rounded-lg transition-colors duration-200 mb-1">
            <i class="fas fa-sign-out-alt w-6 text-center mr-3 text-secondary"></i>
            <span>Sign Out</span>
          </button>
        </nav>

        <div class="mt-6 px-4">
          <label class="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="dark" 
              class="sr-only"
            />
            <div class="relative">
              <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div :class="[
                'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform',
                dark ? 'translate-x-6 bg-secondary' : ''
              ]"></div>
            </div>
            <span class="ml-3 text-white">Dark Mode</span>
          </label>
        </div>
      </div>
      
      <!-- Floating Action Button -->
      <button
        v-show="fab"
        @click="toTop"
        class="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-all duration-300 z-40 flex items-center justify-center"
      >
        <i class="fas fa-chevron-up text-2xl"></i>
      </button>
      
      <!-- Main Content -->
      <main :class="[
        'transition-all duration-300 min-h-screen',
        smAndUp ? 'ml-60' : 'ml-0',
        dark ? 'svg-bg' : 'svg-bg-light'
      ]">
        <nuxt />
      </main>
    </div>
  </div>
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
    smAndUp() {
      if (typeof window === 'undefined') return false;
      return window.innerWidth >= 768;
    }
  },
  watch: {
    searchBar() {
      this.$store.commit("searchBarToggle");
    },
    dark() {
      if (typeof document !== 'undefined') {
        if (this.dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      this.$store.commit("setUserDark", this.dark);
      if (this.userAuth) {
        this.$store.dispatch("saveUserDark", this.dark);
      }
    },
    userDark() {
      this.dark = this.userDark;
    }
  },
  created() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
    // fetching events from firebase
    this.$store.dispatch("loadRatings");
    this.$store.dispatch("createRecentRatings");
    // log returning users in automatically
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });
  },
  mounted() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('scroll', this.onScroll);
    }
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('scroll', this.onScroll);
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
    },
    handleResize() {
      this.$forceUpdate();
    }
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
/* .hidden {
  display: none !important;
} */
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
@media screen and (min-width: 960px) {
  .svg-bg {
    background-repeat: repeat;
    background-color: #111;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .svg-bg-light {
    background-repeat: repeat;
    background-color: #fafafa;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23782f40' fill-opacity='0.1'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}
</style>
