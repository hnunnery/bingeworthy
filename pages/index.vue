<template>
  <div class="container mx-auto px-4 pt-0 pb-12 max-w-full">
    <div class="flex justify-between m-0 p-0">
      <div class="w-full desktop">
        <!-- DROP DOWN SEARCH BAR FOR XS-MD BREAKPOINTS; LEAVE ON PAGES -->
        <div
          class="flex items-center justify-center"
          v-show="
            this.$store.state.searchBar && windowWidth < 600
          "
        >
          <div class="w-full sm:w-5/6 md:w-1/2 mt-1 mx-0 mb-2 px-2 py-0">
            <input 
              type="text" 
              placeholder="Search" 
              v-model="search" 
              class="input-field"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="w-full xl:w-11/12 mt-0 pt-0 px-5">
        <h1
          class="hidden sm:block text-secondary text-center font-bold italic my-2"
          style="letter-spacing: -2px; font-size: 6vmax;"
        >BingeWorthy</h1>
        <div
          class="flex items-center justify-center"
          v-show="
            this.$store.state.searchBar && windowWidth >= 600
          "
        >
          <div class="w-full md:w-1/2 lg:w-1/3 mt-1 mx-0 mb-2 px-2 py-0">
            <input 
              type="text" 
              placeholder="Search" 
              v-model="search" 
              class="input-field"
            />
          </div>
        </div>
        <div v-show="this.search" class="flex justify-center items-center mt-2 mb-0 pb-0">
          <button
            class="hidden md:block btn-primary text-capitalize mt-2 mb-1 mx-3 hover:scale-105 transition-transform"
            @click="clearSearch"
          >
            <i class="fas fa-arrow-left mr-2"></i>Back / Clear
          </button>
          <button
            class="block md:hidden text-white bg-transparent border-none text-capitalize mt-2 mb-3 mx-2 py-0"
            @click="clearSearch"
          >
            <i class="fas fa-arrow-left mr-2"></i>Back / Clear
          </button>
          <RateThis
            v-if="expandedName && userAuth && windowWidth >= 768"
            :rateName="expandedName"
            :ratePlatform="expandedPlatform"
          />
        </div>
        <div class="hidden md:block my-5"></div>

        <!-- PROGRESS SPINNER -->
        <div v-show="loading" class="flex justify-center items-center" style="height: 80vh;">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>

        <!-- START - MOBILE - MASTER RATINGS CARDS -->
        <div
          v-if="!loading && windowWidth <= 768"
          class="block md:hidden flex justify-center"
          style="margin: 0px -19px !important;"
        >
          <div class="w-full">
            <div
              v-for="(rating, index) in filteredMasterRatingsMobile"
              :key="index"
              class="bg-surface border border-primary/30 rounded-lg mb-2"
              :class="{ 'bg-gray-900': dark }"
            >
              <div class="p-0 m-0 cursor-pointer" @click="panel = panel === index ? null : index">
                <div
                  class="text-center flex justify-center items-center pt-3 px-5 sm:px-8"
                  style="padding-bottom: 20px;"
                >
                  <div
                    class="w-full text-left flex pt-0 px-0"
                    style="padding-bottom: 3.5px;"
                  >
                    <span class="text-xl font-medium" style="line-height: 1em; margin-top: 5px;">{{ rating.name }}</span>
                    <div class="flex-grow"></div>
                    <div class="flex items-center">
                      <div class="flex">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          :class="[
                            'fas text-yellow-400',
                            star <= Math.floor(rating.averageRating) ? 'fa-star' : 
                            star === Math.ceil(rating.averageRating) && rating.averageRating % 1 >= 0.5 ? 'fa-star-half-alt' : 'far fa-star'
                          ]"
                          style="font-size: 25px;"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="w-full text-secondary flex"
                  style="font-size: 1.02rem; padding: 0px 5px 0px 0px;"
                >
                  <span style="padding-left: 2px;">
                    <span>#{{ rating.rank }} &nbsp;-&nbsp;</span>
                    {{ rating.platform }}
                  </span>
                  <div class="flex-grow"></div>
                  <span class="mr-2">{{ rating.users.length }} Ratings &nbsp;-</span>
                  <span class="font-bold">{{rating.roundedRating}}</span>
                </div>
              </div>
              
              <div v-if="panel === index" class="px-4 py-2 border-t border-primary/30">
                <div class="w-full ml-0 px-0 pt-2 pb-0 flex">
                  <button
                    v-if="expandedName !== rating.name"
                    class="p-0 text-secondary text-left bg-transparent border-none"
                    style="margin-left: -14px !important; font-size: 1rem;"
                    @click="
                setSearch(rating.name);
                expandedName = rating.name;
                expandedPlatform = rating.platform;
                expandedRank = rating.rank;
                expandedRating = rating.averageRating.toFixed(2);
              "
                  >See Individual Ratings</button>
                  <div class="flex-grow"></div>
                  <RateThis
                    v-if="userAuth"
                    v-on:close-panel="panel=false"
                    :rateName="rating.name"
                    :ratePlatform="rating.platform"
                  />
                  <nuxt-link
                    v-else
                    to="/signin"
                    class="block sm:hidden btn-primary mb-3 mx-2"
                    style="margin-right: -10px !important;"
                  >Rate Show</nuxt-link>
                </div>
              </div>
              <div class="border-b border-primary"></div>
            </div>
          </div>
          <div class="border-b border-primary" style="padding: .5px;"></div>
        </div>
        
        <!-- START MASTER RATINGS CARDS -->
        <div v-if="!loading && windowWidth >= 768" class="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center mt-2 mb-1">
          <div
            v-for="(rating, index) in filteredMasterRatingsDesktop"
            :key="index"
            class="relative"
          >
            <div
              class="card px-4 pt-1 m-0 flex items-center h-full cursor-pointer relative"
              @click="
                setSearch(rating.name);
                expandedName = rating.name;
                expandedPlatform = rating.platform;
                expandedRank = rating.rank;
                expandedRating = rating.averageRating.toFixed(2);
              "
              :style="{ boxShadow: shadow}"
            >
              <div class="text-center w-full">
                <div class="flex justify-center items-center" style="height: 80px;">
                  <div class="text-4xl py-0 mt-0" style="line-height: 1em;">
                    {{ rating.name }}
                  </div>
                </div>
                <div class="py-0" style="margin-top: -10px;">
                  <div class="flex justify-center items-center">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      :class="[
                        'fas text-yellow-400 mx-1',
                        star <= Math.floor(rating.averageRating) ? 'fa-star' : 
                        star === Math.ceil(rating.averageRating) && rating.averageRating % 1 >= 0.5 ? 'fa-star-half-alt' : 'far fa-star'
                      ]"
                      style="font-size: 40px;"
                    ></i>
                  </div>
                </div>
                <!-- IF EXPANDED NAME -->
                <div
                  v-if="expandedName===rating.name"
                  class="text-2xl font-medium p-0 mb-3 text-primary"
                >{{rating.roundedRating}} Average</div>

                <!-- PLATFORM -->
                <div
                  v-else
                  class="p-0 mb-2 font-medium text-primary"
                  style="font-size: 1.9em;"
                >{{ rating.platform }}</div>
                <div
                  class="p-0 text-4xl font-bold italic text-center absolute bottom-0 right-0"
                  style="opacity: 0.2; margin-right: -10px;"
                >
                  {{ rating.users.length }}
                  <p
                    v-if="rating.users.length > 1"
                    class="p-0 text-xs"
                    style="margin: -20px 0px -10px 0px;"
                  >ratings</p>
                  <p
                    v-else
                    class="p-0 text-xs"
                    style="margin: -20px 0px -10px 0px;"
                  >rating</p>
                </div>
                <!-- RANKING SECTION -->
                <button
                  class="absolute top-2 left-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
                  style="font-size: 1.2em; letter-spacing: .1px;"
                >
                  <span style="margin-right: 2px;">{{ rating.rank }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- START - MOBILE - RATINGS CARDS -->
        <div v-show="!loading && this.search && windowWidth <= 768" class="block md:hidden flex justify-center my-0">
          <div class="w-full">
            <div
              v-for="rating in filteredRatings"
              :key="rating.id"
              class="p-0 relative"
            >
              <div class="text-center flex justify-center items-center pt-3 pb-4 px-4 sm:px-7">
                <div
                  class="w-full text-left flex pt-0 px-0"
                  style="padding-bottom: 0px;"
                >
                  <span
                    class="text-xl font-medium cursor-pointer"
                    style="line-height: 1em; margin-top: 5px;"
                    @click="setSearch(rating.name)"
                  >{{ rating.name }}</span>
                  <div class="flex-grow"></div>
                  <div class="flex items-center">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      :class="[
                        'fas text-yellow-400',
                        star <= Math.floor(parseFloat(rating.rating)) ? 'fa-star' : 
                        star === Math.ceil(parseFloat(rating.rating)) && parseFloat(rating.rating) % 1 >= 0.5 ? 'fa-star-half-alt' : 'far fa-star'
                      ]"
                      style="font-size: 25px;"
                    ></i>
                  </div>
                </div>
              </div>
              <div
                class="w-full text-secondary flex py-0 pl-0 pr-1"
                style="font-size: 1.02rem; margin-bottom: -2px;"
              >
                <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
                <span
                  @click="setSearch(rating.platform)"
                  class="cursor-pointer"
                  style="padding-left: 2px;"
                >{{ rating.platform }}</span>
                <div class="flex-grow"></div>
                <span @click="setSearch(rating.user)" class="cursor-pointer">{{ rating.user }}</span>
              </div>
              <div class="border-b border-primary"></div>
            </div>
          </div>
        </div>

        <!-- START RATINGS CARDS -->
        <div v-if="!loading && this.search && windowWidth >= 768" class="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center mt-2 mb-6">
          <div v-for="rating in filteredRatings" :key="rating.id">
            <div
              class="card px-4 pt-1 m-0 flex items-center h-full"
              style="box-shadow: 0 0 5px 1px #782f40 !important;"
            >
              <div class="text-center w-full">
                <div class="flex justify-center items-center" style="height: 80px;">
                  <div
                    class="text-4xl py-0 mt-2 cursor-pointer"
                    style="line-height: 1em;"
                    @click="setSearch(rating.name)"
                  >{{ rating.name }}</div>
                </div>
                <div class="py-0" style="margin-top: -10px;">
                  <div class="flex justify-center items-center">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      :class="[
                        'fas text-yellow-400 mx-1',
                        star <= Math.floor(parseFloat(rating.rating)) ? 'fa-star' : 
                        star === Math.ceil(parseFloat(rating.rating)) && parseFloat(rating.rating) % 1 >= 0.5 ? 'fa-star-half-alt' : 'far fa-star'
                      ]"
                      style="font-size: 40px;"
                    ></i>
                  </div>
                </div>
                <div
                  class="py-0 font-medium cursor-pointer text-primary"
                  style="font-size: 1.9em;"
                  @click="setSearch(rating.platform)"
                >{{ rating.platform }}</div>
                <div
                  class="text-2xl font-light italic pt-1 cursor-pointer"
                  @click="setSearch(rating.user)"
                >{{ rating.user }}</div>
                <EditRating :rating="rating" v-if="userId === rating.userId || userIsAdmin" />
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
      panel: false,
      windowWidth: 0
    };
  },
  mounted() {
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
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
    dark() {
      return this.$store.state.userDark;
    },
    shadow() {
      if (this.dark && this.windowWidth >= 960 && this.windowWidth < 1264) {
        return "0 0 5px 1px #ceb888 !important";
      } else if (this.dark && this.windowWidth >= 1264) {
        return "0 0 10px 3px #ceb888 !important";
      } else {
        return "0 0 5px 1px #782f40 !important";
      }
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
