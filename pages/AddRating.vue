<template>
  <div class="container mx-auto px-4 pt-0">
    <div class="flex justify-center items-center mt-12 lg:mt-24" style="min-height: 70vh !important;">
      <div class="w-full sm:w-2/3 md:w-1/2" style="max-width: 600px;">
        <div class="card py-6 px-6 lg:px-10 shadow-2xl">
          <form @submit.prevent="addRating">
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
                      type="button"
                      @click="resetForm"
                      class="btn-secondary mx-2 px-6"
                    >Reset</button>
                    <button type="submit" class="btn-primary mx-2 px-4">
                      <i class="fas fa-plus mr-2"></i>Add Rating
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
            this.rawRating = 0;
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
      this.rawRating = 0;
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
