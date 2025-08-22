<template>
  <div class="container mx-auto px-4 pt-0 pb-12">
    <div class="flex justify-between ma-0 pa-0">
      <div class="w-full desktop">
        <!-- DROP DOWN SEARCH BAR FOR XS-MD BREAKPOINTS; LEAVE ON PAGES -->
        <div
          class="flex items-center justify-center"
          v-show="
            this.$store.state.searchBar && window.innerWidth < 600
          "
        >
          <div class="w-full sm:w-5/6 md:w-1/2 mt-1 mx-0 mb-2 px-2 py-0">
            <input class="input-field" placeholder="Search" v-model="search" />
          </div>
        </div>
      </div>
    </div>
    <!-- DESKTOP NAV END -->

    <div class="flex justify-center">
      <div class="w-full xl:w-11/12 mt-0 pt-0 px-5">
        <h1
          class="hidden sm:block text-secondary text-center font-bold font-italic my-2"
          style="letter-spacing: -2px; font-size: 6vmax;"
        >BingeWorthy</h1>
        <div
          class="flex items-center justify-center"
          v-show="
            this.$store.state.searchBar && window.innerWidth >= 600
          "
        >
          <div class="w-full md:w-1/2 lg:w-1/3 mt-1 mx-0 mb-2 px-2 py-0">
            <input class="input-field" placeholder="Search" v-model="search" />
          </div>
        </div>
        <div class="flex justify-center mt-0 mb-0 pb-0">
          <button
            class="block md:hidden btn-secondary mx-1"
            v-show="this.search"
            @click="clearSearch"
          >Clear Search</button>
          <button
            class="hidden sm:block btn-primary mb-3 lg:mb-6 mx-2 hover:scale-105 transition-transform"
            v-show="this.search"
            @click="clearSearch"
          >
            <i class="fas fa-arrow-left mr-2"></i>Back / Clear
          </button>
        </div>

        <!-- USER HAS NO RATINGS -->
        <div v-show="noRatings" class="flex justify-center items-center" style="height: 50vh">
          <div class="text-center">
            <h2 class="text-4xl capitalize">The ratings that you create will be listed here</h2>
          </div>
        </div>

        <!-- START - MOBILE - RATINGS CARDS -->
        <div
          v-show="!noRatings && window.innerWidth <= 768"
          class="flex flex-col justify-center my-0"
        >
          <div
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="w-full pa-0 relative"
          >
            <div class="text-center flex flex-col justify-center items-center pt-3 pb-4 px-4 sm:px-8">
              <div class="w-full text-left flex items-start py-0 px-0">
                <span
                  class="text-xl cursor-pointer"
                  style="line-height: 1em; margin-top: 5px;"
                  @click="setSearch(rating.name)"
                >{{ rating.name }}</span>

                <div class="flex-grow"></div>
                <div class="flex items-center">
                  <i 
                    v-for="star in 10" 
                    :key="star"
                    :class="[
                      'fas mx-0.5',
                      star <= rating.rating * 2 ? 'text-yellow-400 fa-star' : 
                      star === Math.ceil(rating.rating * 2) && (rating.rating * 2) % 1 >= 0.5 ? 'text-yellow-400 fa-star-half-alt' : 'text-gray-600 far fa-star'
                    ]"
                    style="font-size: 25px;"
                  ></i>
                </div>
              </div>
              <div
                class="w-full text-accent flex items-center py-0 pl-0 pr-1"
                style="font-size: 1rem; margin-bottom: -2px;"
              >
                <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
                <span
                  @click="setSearch(rating.platform)"
                  class="cursor-pointer"
                  style="padding-left: 2px;"
                >{{ rating.platform }}</span>
                <div class="flex-grow"></div>
                <span>{{ rating.user }}</span>
              </div>
            </div>
            <hr class="border-gray-600 px-0" />
          </div>
        </div>

        <!-- START RATINGS CARDS -->
        <div
          v-if="!noRatings && window.innerWidth > 768"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center mt-2 mb-6"
        >
          <div v-for="rating in filteredRatings" :key="rating.id" class="w-full">
            <div
              class="card px-4 pt-1 ma-0 flex items-center h-full"
              style="box-shadow: 0 0 5px 1px #782f40 !important;"
            >
              <div class="text-center flex flex-col justify-center items-center w-full">
                <div class="flex justify-center items-center" style="height: 80px;">
                  <div
                    class="text-4xl py-0 mt-0 cursor-pointer"
                    style="line-height: 1em;"
                    @click="setSearch(rating.name)"
                  >{{ rating.name }}</div>
                </div>
                <div class="w-full py-0" style="margin-top: -10px;">
                  <div class="flex justify-center items-center">
                    <i 
                      v-for="star in 10" 
                      :key="star"
                      :class="[
                        'fas mx-1',
                        star <= rating.rating * 2 ? 'text-yellow-400 fa-star' : 
                        star === Math.ceil(rating.rating * 2) && (rating.rating * 2) % 1 >= 0.5 ? 'text-yellow-400 fa-star-half-alt' : 'text-gray-600 far fa-star'
                      ]"
                      style="font-size: 40px;"
                    ></i>
                  </div>
                </div>
                <div
                  class="w-full py-0 font-medium cursor-pointer text-3xl"
                  style="color: #782F40;"
                  @click="setSearch(rating.platform)"
                >{{ rating.platform }}</div>
                <div
                  class="w-full text-2xl font-light font-italic pt-1 cursor-pointer"
                >{{ rating.user }}</div>
                <EditRating :rating="rating" v-if="userId === rating.userId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddRating from "@/components/AddRating";
import EditRating from "@/components/EditRating";
import AccountOptions from "@/components/AccountOptions";

export default {
  components: {
    AddRating,
    EditRating,
    AccountOptions
  },
  data() {
    return {
      search: ""
    };
  },
  methods: {
    setSearch(prop) {
      this.search = prop;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    },
    clearSearch() {
      this.search = "";
    },
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("logout");
        this.$router.push("/");
      }
    }
  },
  computed: {
    filteredRatings() {
      return this.$store.getters.userRatings.filter(rating => {
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
    ratingsChange() {
      return this.$store.getters.ratingsChange;
    },
    // controls loading progress spinner
    noRatings() {
      return this.$store.getters.userRatings.length < 1;
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
    }
  },
  watch: {
    userAuth() {
      if (
        this.$store.getters.user === null &&
        this.$store.getters.user === undefined
      ) {
        this.$router.push("/");
      }
    }
  }
};
</script>
