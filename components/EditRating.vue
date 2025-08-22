<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-97 flex items-center justify-center z-50" @click="dialog = false">
      <div class="card max-w-md w-full mx-4 px-6 py-2" @click.stop>
        <div class="flex flex-col items-center justify-center">
          <div class="w-full pb-2">
            <h2
              class="text-secondary text-center font-normal font-italic mt-1 pb-0 text-2xl"
            >Edit {{ this.updatedName }}</h2>
          </div>
          <div class="w-full py-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Name of Show</label>
            <input
              type="text"
              name="name"
              v-model="updatedName"
              :list="'edit-show-names'"
              required
              class="input-field"
              placeholder="Enter show name"
            />
            <datalist id="edit-show-names">
              <option v-for="showName in uniqueNames" :key="showName" :value="showName" />
            </datalist>
          </div>
          <div class="w-full py-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Platform (Netflix, Hulu, etc.)</label>
            <input
              type="text"
              name="platform"
              v-model="updatedPlatform"
              :list="'edit-platforms'"
              required
              class="input-field"
              placeholder="Enter platform"
            />
            <datalist id="edit-platforms">
              <option v-for="platformName in uniquePlatforms" :key="platformName" :value="platformName" />
            </datalist>
          </div>
          <div class="w-full text-center">
            <div class="flex justify-center items-center">
              <i 
                v-for="star in 10" 
                :key="star"
                :class="[
                  'fas cursor-pointer mx-1',
                  star <= updatedRating * 2 ? 'text-yellow-400 fa-star' : 
                  star === Math.ceil(updatedRating * 2) && (updatedRating * 2) % 1 >= 0.5 ? 'text-yellow-400 fa-star-half-alt' : 'text-gray-600 far fa-star'
                ]"
                style="font-size: 40px;"
                @click="updatedRating = star / 2"
              ></i>
            </div>
          </div>
          <div class="w-full pt-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
            <input 
              type="text" 
              name="user" 
              v-model="updatedUser" 
              required 
              class="input-field"
              placeholder="Enter your name"
            />
          </div>
          <div class="w-full">
            <div class="w-full py-1">
              <div class="flex justify-between">
                <div class="text-left py-0">
                  <button @click="removeRating" class="w-10 h-10 bg-transparent border-none text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors">
                    <i class="fas fa-trash text-2xl"></i>
                  </button>
                </div>
                <div class="text-right py-0">
                  <button
                    @click="dialog = false"
                    class="btn-secondary mx-1"
                  >Cancel</button>
                  <button @click="updateRating" class="btn-primary mx-1">
                    <i class="fas fa-check mr-2"></i>Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trigger Buttons -->
    <button
      @click="dialog = true"
      class="hidden md:block absolute bottom-2 right-2 w-6 h-6 bg-gray-800 text-yellow-400 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
      style="z-index: 1;"
    >
      <i class="fas fa-cog text-xs"></i>
    </button>
    <!-- FOR XS (MOBILE) SCREEN SIZE ONLY -->
    <button
      @click="dialog = true"
      class="block md:hidden w-6 h-6 bg-transparent text-secondary border-none hover:bg-secondary hover:text-white rounded-full flex items-center justify-center transition-colors"
      style="margin: -4px 0px -4px -6px; font-size: 1em;"
    >
      <i class="fas fa-cog"></i>
    </button>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  props: ["rating"],
  data() {
    return {
      originalName: this.rating.name,
      updatedName: this.rating.name,
      updatedRating: parseFloat(this.rating.rating),
      updatedPlatform: this.rating.platform,
      updatedUser: this.rating.user,
      ratingId: this.rating.id,
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
    userRatings() {
      return this.$store.getters.userRatings;
    }
  },
  methods: {
    updateRating() {
      this.duplicate = false;
      this.userRatings.forEach(rating => {
        if (
          this.updatedName === rating.name &&
          this.updatedName !== this.originalName
        ) {
          this.duplicate = true;
        }
      });
      // saving data to firestore
      if (
        this.updatedName &&
        this.updatedPlatform &&
        this.updatedRating &&
        this.updatedUser &&
        !this.duplicate
      ) {
        const updatedObject = {
          name: this.updatedName,
          rating: this.updatedRating,
          platform: this.updatedPlatform,
          user: this.updatedUser,
          id: this.ratingId
        };
        db.collection("show")
          .doc(this.ratingId)
          .update({
            name: this.updatedName,
            rating: this.updatedRating,
            platform: this.updatedPlatform,
            user: this.updatedUser
          })
          .then(() => {
            this.$store.commit("updateRating", updatedObject);
            this.$store.dispatch("createRecentRatings");
            this.dialog = false;
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else alert("Please complete all fields.");
    },
    removeRating() {
      if (confirm("Delete this rating")) {
        db.collection("show")
          .doc(this.ratingId)
          .delete()
          .then(() => {
            this.$store.dispatch("createRecentRatings");
            this.$store.commit("deleteAlert");
            this.dialog = false;
          });
      }
    }
  }
};
</script>

<style>
</style>
