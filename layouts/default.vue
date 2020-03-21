<template>
  <v-app>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      class="hidden-md-and-up"
      fab
      dark
      fixed
      top
      right
      color="primary"
      @click="toTop"
    >
      <v-icon size="40">mdi-chevron-up</v-icon>
    </v-btn>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      class="hidden-sm-and-down"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon size="40">mdi-chevron-up</v-icon>
    </v-btn>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fab: false
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>
