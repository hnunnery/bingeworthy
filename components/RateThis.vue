<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-97 flex items-center justify-center z-50" @click="dialog = false">
      <div class="card max-w-sm w-full mx-4 px-6 py-2" @click.stop>
        <div class="flex flex-col items-center justify-center">
          <div class="w-full pb-0">
            <h2
              class="text-4xl text-secondary text-center font-normal font-italic my-0 pb-0"
            >{{ name }}</h2>
          </div>
          <div class="w-full mb-0 text-center">
            <span class="text-6xl font-normal">{{ rating }}/5</span>
            <div class="flex justify-center items-center mt-4">
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
                  @click="dialog = false;"
                  class="btn-secondary mx-2 px-6 shadow-lg"
                >Cancel</button>
                <button
                  @click="addRating"
                  class="btn-primary mx-2 px-4 shadow-lg"
                >
                  <i class="fas fa-plus mr-2"></i>Add Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trigger Buttons -->
    <button
      @click="dialog = true"
      class="hidden md:block btn-primary mt-2 mb-1 mx-3 hover:scale-105 transition-transform"
    >
      <i class="fas fa-plus mr-2"></i>Rate This Show
    </button>
    <!-- for xs screen size only -->
    <button
      @click="dialog = true"
      class="block md:hidden btn-primary"
      style="margin-right: -10px !important;"
    >Rate Show</button>
  </div>
</template>

<script>
import { db } from "@/plugins/firebase.js";

export default {
  props: ["rateName", "ratePlatform"],
  data() {
    return {
      name: this.rateName,
      platform: this.ratePlatform,
      rating: 0,
      user: this.$store.getters.user.name,
      search: "",
      rawRating: 0,
      dialog: false,
      duplicate: false
    };
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
            this.$emit("close-panel");
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else {
        alert("Please complete all fields.");
      }
    }
  },
  computed: {
    userRatings() {
      return this.$store.getters.userRatings;
    }
  },
  watch: {
    rawRating() {
      this.rating = this.rawRating / 2;
    }
  }
};
</script>
