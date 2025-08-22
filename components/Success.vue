<template>
  <div v-if="success" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div class="bg-green-600 text-white p-6 rounded-lg shadow-2xl max-w-md mx-4 transform transition-transform scale-100">
      <div class="flex items-center">
        <i class="fas fa-check-circle text-2xl mr-3"></i>
        <span class="text-lg">{{ message }}</span>
      </div>
    </div>
  </div>
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
