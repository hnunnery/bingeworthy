<template>
  <v-container fluid class="pt-0">
    <v-row class="justify-center align-center" style="min-height: 80vh !important;">
      <v-col cols="12" sm="8" md="6" style="max-width: 500px;">
        <v-card class="pa-6 px-lg-10" elevation="15">
          <form @submit.prevent="updateDisplayName">
            <v-row class="align-center justify-center">
              <v-col cols="12" class="pb-2">
                <h2
                  class="display-1 text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Set Display Name</h2>

                <v-text-field
                  class="mt-6"
                  name="displayName"
                  label="Full Name"
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
                        <v-btn large to="/" class="secondary--text text-capitalize mx-2">Cancel</v-btn>
                        <v-btn
                          type="submit"
                          large
                          class="primary text-capitalize px-8 mx-2"
                          :loading="loading"
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
