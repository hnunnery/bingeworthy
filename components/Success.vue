<template>
  <v-overlay :value="success" opacity=".9">
    <v-alert
      v-model="success"
      text
      outlined
      elevation="15"
      color="success"
      type="success"
    >{{ message }}</v-alert>
  </v-overlay>
</template>

<script>
export default {
  computed: {
    message() {
      return this.$store.getters.fetchMessage;
    },
    success() {
      return this.$store.getters.fetchSuccess;
    }
  }
};
</script>