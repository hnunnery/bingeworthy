<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-97 flex items-center justify-center z-50" @click="dialog = false">
      <div class="card max-w-sm w-full mx-4 px-6 py-2" @click.stop>
        <div class="flex flex-col items-center justify-center">
          <div class="w-full pb-2">
            <h2
              class="text-4xl text-secondary text-center font-italic mt-1 pb-0"
              style="letter-spacing: 1.2px;"
            >Reset Password</h2>
          </div>
          <div class="w-full">
            <div class="mt-2">
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                class="input-field"
                name="email"
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div class="w-full my-2 text-center">
            <button
              @click="dialog=false"
              class="btn-secondary px-4 mx-2"
            >Cancel</button>
            <button @click="resetPassword" class="btn-primary px-6 mx-2">
              <i class="fas fa-check mr-2"></i>Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Trigger Button -->
    <button @click="dialog = true" class="text-xl text-secondary hover:text-secondary/80 font-normal">Reset Password</button>
  </div>
</template>

<script>
import { auth } from "@/plugins/firebase.js";

export default {
  data() {
    return {
      email: "",
      dialog: false
    };
  },
  methods: {
    resetPassword() {
      auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.$store.commit("passwordReset", this.email);
          this.dialog = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
