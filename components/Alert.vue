<template>
  <v-alert class="error" dismissible :value="true" @input="onClose">{{ text }}</v-alert>
</template>

<script>
export default {
  props: ["text"],
  methods: {
    onClose() {
      this.$emit("dismissed");
    }
  }
};
</script>
