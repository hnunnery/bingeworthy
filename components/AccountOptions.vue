<template>
  <div>
    <!-- Modal Overlay -->
    <div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-97 flex items-center justify-center z-50" @click="dialog = false">
      <div class="card max-w-sm w-full mx-4 px-6 py-2" @click.stop>
        <div class="flex flex-col items-center justify-center">
          <div class="w-full pb-0">
            <h2
              class="text-4xl text-secondary text-center font-normal font-italic mt-0 pb-0"
            >Account Options</h2>
          </div>
          <div class="w-full">
            <div class="flex justify-center">
              <!-- DISPLAY IF USER IS NOT AUTHENTICATED -->
              <div class="w-full text-center" v-if="!userAuth">
                <nuxt-link
                  to="/signup"
                  @click="dialog=false"
                  class="btn-primary mx-2 my-3 px-6 inline-flex items-center"
                >
                  <i class="fas fa-user-plus text-xl mr-2"></i>&nbsp;Create an Account
                </nuxt-link>
                <nuxt-link
                  to="/signin"
                  @click="dialog=false"
                  class="btn-primary mx-2 my-3 px-6 inline-flex items-center"
                >
                  <i class="fas fa-user-check text-xl mr-2"></i>&nbsp;Sign In to Account
                </nuxt-link>
              </div>
              <!-- DISPLAY IF USER IS AUTHENTICATED -->
              <div class="w-full text-center" v-else>
                <button
                  @click="onLogout"
                  class="btn-primary mx-2 my-3 px-5 inline-flex items-center"
                >
                  <i class="fas fa-user-minus text-xl mr-2"></i>&nbsp;Sign Out of Account
                </button>
                <nuxt-link
                  to="/updatename"
                  @click="dialog=false"
                  class="btn-primary mx-2 my-3 px-7 inline-flex items-center"
                >
                  <i class="fas fa-user-cog text-xl mr-2"></i>&nbsp;Update User Name
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trigger Buttons -->
    <button
      @click="dialog = true"
      class="block sm:hidden p-2 bg-transparent border-none text-white"
      style="margin-right: -4px; margin-left: -4px;"
    >
      <i class="fas fa-user text-lg"></i>
    </button>
    <button
      @click="dialog = true"
      class="hidden md:block btn-primary ml-3 hover:scale-105 transition-transform"
      style="margin-top: 1.5px;"
    >
      <i class="fas fa-user text-lg mr-2"></i>Account
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    userAuth() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("logout");
        this.$router.push("/");
        this.dialog = false;
      }
    }
  }
};
</script>
