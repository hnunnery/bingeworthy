<template>
  <div class="bg-red-600 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
    <span>{{ text }}</span>
    <button @click="onClose" class="text-white bg-transparent border-none ml-4 text-xl hover:text-gray-200">
      <i class="fas fa-times"></i>
    </button>
  </div>
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
