<template>
  <div class="container mx-auto px-4 pt-0">
    <div class="flex justify-center items-center mt-12 lg:mt-24" style="min-height: 70vh !important;">
      <div class="w-full sm:w-2/3 md:w-1/2" style="max-width: 600px;">
        <div class="card py-6 px-6 lg:px-10 shadow-2xl">
          <form @submit.prevent="onSignUp">
            <div class="flex flex-col items-center justify-center">
              <div class="w-full pb-2">
                <h2
                  class="text-4xl text-secondary text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Create Account</h2>

                <div class="mt-5">
                  <label for="displayName" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    class="input-field"
                    name="displayName"
                    id="displayName"
                    v-model="displayName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div class="mt-5">
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

                <div class="mt-5">
                  <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    class="input-field"
                    name="password"
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <div class="w-full">
                  <div class="flex justify-center">
                    <div class="w-full text-center py-0">
                      <div class="w-full lg:w-2/3 mx-auto text-center" v-if="error">
                        <Alert @dismissed="onDismissed" :text="error.message" />
                      </div>
                      <div class="w-full my-2 text-center">
                        <button
                          type="submit"
                          class="btn-primary px-12"
                          :disabled="loading"
                        >{{ loading ? 'Creating Account...' : 'Sign Up' }}</button>
                      </div>
                    </div>
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
import Alert from "@/components/Alert";

export default {
  components: {
    Alert
  },
  data() {
    return {
      email: "",
      password: "",
      displayName: "",
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    onSignUp() {
      this.loading = true;
      this.$store.dispatch("signUserUp", {
        email: this.email,
        password: this.password,
        displayName: this.displayName
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  }
};
</script>
