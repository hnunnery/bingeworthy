<template>
  <div class="container mx-auto px-4 pt-0">
    <div class="flex justify-center items-center" style="min-height: 80vh !important;">
      <div class="w-full sm:w-2/3 md:w-1/2" style="max-width: 500px;">
        <div class="card p-6 lg:px-10">
          <form @submit.prevent="updateDisplayName">
            <div class="flex flex-col items-center justify-center">
              <div class="w-full pb-2">
                <h2
                  class="text-4xl text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Set Display Name</h2>

                <div class="mt-6">
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

                <div class="w-full">
                  <div class="flex justify-center">
                    <div class="w-full text-center py-0">
                      <div class="w-full lg:w-2/3 mx-auto text-center" v-if="error">
                        <Alert @dismissed="onDismissed" :text="error.message" />
                      </div>
                      <div class="w-full my-2 text-center">
                        <nuxt-link
                          to="/"
                          class="btn-secondary mx-2"
                        >Cancel</nuxt-link>
                        <button
                          type="submit"
                          class="btn-primary px-8 mx-2"
                          :disabled="loading"
                        >{{ loading ? 'Updating...' : 'Update' }}</button>
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
    updateDisplayName() {
      this.loading = true;
      this.$store.dispatch("updateDisplayName", this.displayName);
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  }
};
</script>
