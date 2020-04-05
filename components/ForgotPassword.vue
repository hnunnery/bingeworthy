<template>
  <v-dialog v-model="dialog" persistent max-width="400" overlay-color="#111" overlay-opacity=".97">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on" class="title secondary--text text-capitalize">Reset Password</v-btn>
    </template>
    <v-card class="px-6 py-2" color="rgba(17, 17, 17, 0.85)" elevation="15">
      <v-row class="align-center justify-center">
        <v-col cols="12" class="pb-2">
          <h2
            class="display-1 secondary--text text-center font-italic mt-1 pb-0"
            style="letter-spacing: 1.2px;"
          >Reset Password</h2>
        </v-col>
        <v-col cols="12">
          <v-text-field
            class="mt-2"
            name="email"
            label="Email"
            id="email"
            v-model="email"
            type="email"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="my-2 text-center">
          <v-btn
            large
            @click="dialog=false"
            color="#212121"
            class="secondary--text text-capitalize px-8 mx-2"
          >Cancel</v-btn>
          <v-btn large @click="resetPassword" class="primary text-capitalize px-8 mx-2">
            <v-icon left>mdi-check</v-icon>Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
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