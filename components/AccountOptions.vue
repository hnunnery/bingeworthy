<template>
  <v-dialog v-model="dialog" max-width="400" overlay-color="#111" overlay-opacity=".97">
    <template v-slot:activator="{ on }">
      <v-btn fab v-show="nav" class="hidden-sm-and-up primary" v-on="on" active-class="no-active">
        <v-icon size="35">mdi-account</v-icon>
      </v-btn>
      <v-btn
        large
        class="hidden-md-and-down primary text-capitalize ml-3 scale-btn"
        v-on="on"
        style="margin-top: 1.5px;"
        v-if="userAuth"
      >
        <v-icon left size="20">mdi-account</v-icon>Account
      </v-btn>
    </template>

    <v-card class="px-6 py-2" color="rgba(17, 17, 17, 0.85)" elevation="15">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-0">
          <h2
            class="display-1 secondary--text text-center font-weight-regular font-italic mt-0 pb-0"
          >Account Options</h2>
        </v-col>
        <v-card-actions style="width: 100%;">
          <v-row class="justify-center">
            <!-- DISPLAY IF USER IS NOT AUTHENTICATED -->
            <v-col cols="12" class="text-center" v-if="!userAuth">
              <v-btn
                large
                to="/signup"
                @click="dialog=false"
                active-class="no-active"
                class="text-capitalize mx-2 my-3 px-5"
                style="background-color: rgba(120, 47, 64, 0.5);"
              >
                <v-icon size="25" left>mdi-account-plus</v-icon>Create an Account
              </v-btn>
              <v-btn
                large
                to="/signin"
                @click="dialog=false"
                active-class="no-active"
                class="text-capitalize mx-2 my-3 px-5"
                style="background-color: rgba(120, 47, 64, 0.5);"
              >
                <v-icon size="25" left>mdi-account-check</v-icon>Sign In to Account
              </v-btn>
            </v-col>
            <!-- DISPLAY IF USER IS AUTHENTICATED -->
            <v-col cols="12" class="text-center" v-else>
              <v-btn
                large
                @click="onLogout"
                active-class="no-active"
                class="text-capitalize mx-2 my-3 px-4"
                style="background-color: rgba(120, 47, 64, 0.5);"
              >
                <v-icon size="25" left>mdi-account-remove</v-icon>Sign Out of Account
              </v-btn>
              <v-btn
                large
                to="/updatename"
                @click="dialog=false"
                active-class="no-active"
                class="text-capitalize mx-2 my-3 px-6"
                style="background-color: rgba(120, 47, 64, 0.5);"
              >
                <v-icon size="25" left>mdi-account-cog</v-icon>Update User Name
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
props: ["nav"],
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
