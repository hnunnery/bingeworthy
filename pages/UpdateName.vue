<template>
  <v-container fluid class="pt-0">
    <v-row class="justify-center align-center" style="height: 65vh !important;">
      <v-col cols="12" class="hidden-xs-only mt-0">
        <h1
          class="secondary--text text-center font-weight-bold font-italic mt-1 mb-2"
          style="letter-spacing: 2px; font-size: 6vmax;"
        >BingeWorthy</h1>
      </v-col>
      <v-col cols="12" sm="8" md="6" style="max-width: 600px;">
        <v-card class="pa-6 px-lg-10" color="rgba(17, 17, 17, 0.5)" elevation="15">
          <form @submit.prevent="updateDisplayName">
            <v-row class="align-center justify-center">
              <v-col cols="12" class="pb-2">
                <h2
                  class="display-1 text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Name to Display on Ratings</h2>

                <v-text-field
                  class="mt-6"
                  name="displayName"
                  label="Name (John Doe / John D.)"
                  id="displayName"
                  v-model="displayName"
                  type="text"
                  required
                ></v-text-field>

                <v-card-actions style="width: 100%;">
                  <v-row class="justify-center">
                    <v-col cols="12" class="text-center py-0">
                      <v-col cols="12" lg="8" class="text-xs-center" v-if="error">
                        <Alert @dismissed="onDismissed" :text="error.message" />
                      </v-col>
                      <v-col cols="12" class="my-2 text-center">
                        <v-btn
                          type="submit"
                          large
                          rounded
                          class="text-capitalize px-12"
                          style="background-color: rgba(120, 47, 64, 0.6);"
                        >Update</v-btn>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-col>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Alert from "@/components/Alert";

export default {
  components: {
    Alert
  },
  data() {
    return {
      displayName: ""
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
      this.$store.dispatch("updateDisplayName", this.displayName);
      this.$router.push("/");
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  }
};
</script>
