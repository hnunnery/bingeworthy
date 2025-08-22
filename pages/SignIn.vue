<template>
  <div class="container mx-auto px-4 pt-0">
    <div class="flex justify-center items-center mt-12 lg:mt-24" style="min-height: 70vh !important;">
      <div class="w-full sm:w-2/3 md:w-1/2" style="max-width: 600px;">
        <div class="card p-6 lg:px-10 shadow-2xl">
          <form @submit.prevent="onSignIn">
            <div class="flex flex-col items-center justify-center">
              <div class="w-full pb-2">
                <h2
                  class="text-4xl text-secondary text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Sign In Here</h2>

                <div class="mt-6">
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

                <div class="mt-6">
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
                        >{{ loading ? 'Signing In...' : 'Sign In' }}</button>
                      </div>
                      <div class="w-full text-center mt-2 pb-0">
                        <nuxt-link
                          to="/signup"
                          class="text-xl text-secondary hover:text-secondary/80 font-normal"
                        >Register for Account</nuxt-link>
                      </div>
                      <div class="w-full text-center py-0">
                        <ForgotPassword />
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
import ForgotPassword from "@/components/ForgotPassword";

export default {
  components: {
    Alert,
    ForgotPassword
  },
  data() {
    return {
      email: "",
      password: "",
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
    onSignIn() {
      this.loading = true;
      this.$store.dispatch("signUserIn", {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  }
};
</script>
