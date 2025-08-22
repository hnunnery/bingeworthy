<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-97 flex items-center justify-center z-50" @click="dialog = false">
      <div class="card max-w-md w-full mx-4 px-6 py-2" @click.stop>
        <div class="flex flex-col items-center justify-center">
          <div class="w-full pb-2">
            <h2
              class="text-4xl text-secondary text-center font-italic mt-1 pb-0"
              style="letter-spacing: 1.2px;"
            >Add Your Rating</h2>
          </div>
          <div class="w-full py-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Name of Show</label>
            <input
              name="name"
              v-model="name"
              :list="'show-names'"
              required
              type="text"
              class="input-field"
              placeholder="Enter show name"
            />
            <datalist id="show-names">
              <option v-for="showName in uniqueNames" :key="showName" :value="showName" />
            </datalist>
          </div>
          <div class="w-full py-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Platform (Netflix, Hulu, etc.)</label>
            <input
              name="platform"
              v-model="platform"
              :list="'platforms'"
              required
              type="text"
              class="input-field"
              placeholder="Enter platform"
            />
            <datalist id="platforms">
              <option v-for="platformName in uniquePlatforms" :key="platformName" :value="platformName" />
            </datalist>
          </div>
          <div class="w-full text-center pt-0 pb-3">
            <span class="text-5xl text-secondary">{{ rating }}/5</span>
            <div class="flex justify-center items-center mt-2">
              <i 
                v-for="star in 10" 
                :key="star"
                :class="[
                  'fas cursor-pointer mx-1',
                  star <= rawRating ? 'text-yellow-400 fa-star' : 'text-gray-600 far fa-star'
                ]"
                style="font-size: 25px;"
                @click="rawRating = star"
              ></i>
            </div>
          </div>
          <div class="w-full">
            <div class="flex justify-center">
              <div class="w-full text-center mt-2">
                <button
                  @click="resetForm"
                  class="btn-secondary mx-2 px-6"
                >Cancel</button>
                <button @click="addRating" class="btn-primary mx-2 px-4">
                  <i class="fas fa-plus mr-2"></i>Add Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trigger Buttons -->
    <!-- button for lg and xl screen sizes -->
    <button @click="dialog = true" class="hidden md:block btn-primary mx-1 hover:scale-105 transition-transform">
      <i class="fas fa-plus-circle mr-2"></i>Rating
    </button>
    <!-- button for sm - md screen size -->
    <button
      @click="dialog = true"
      class="hidden sm:block md:hidden w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mt-4 hover:scale-105 transition-transform"
    >
      <i class="fas fa-plus"></i>
    </button>
    <!-- button for xs only -->
    <button @click="dialog = true" class="block sm:hidden w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mt-3 ml-1 shadow-lg hover:scale-105 transition-transform">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  data() {
    return {
      name: "",
      rating: 0,
      platform: "",
      user: this.$store.getters.user.name,
      search: "",
      rawRating: 0,
      dialog: false,
      duplicate: false
    };
  },
  computed: {
    uniqueNames() {
      let a = [];
      this.$store.state.names.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    uniquePlatforms() {
      let a = [];
      this.$store.state.platforms.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    ratings() {
      return this.$store.getters.ratingsChange;
    },
    userRatings() {
      return this.$store.getters.userRatings;
    }
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
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else {
        alert("Please complete all fields.");
      }
    },
    resetForm() {
      this.name = "";
      this.platform = "";
      this.rating = 0;
      this.user = "";
      this.dialog = false;
    }
  },
  watch: {
    name() {
      this.ratings.forEach(rating => {
        if (this.name === rating.name) {
          this.platform = rating.platform;
        }
      });
    },
    rawRating() {
      this.rating = this.rawRating / 2;
    }
  }
};
</script>
