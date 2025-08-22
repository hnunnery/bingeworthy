<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 v-if="error.statusCode === 404" class="text-4xl font-bold text-secondary mb-4">
      {{ pageNotFound }}
    </h1>
    <h1 v-else class="text-4xl font-bold text-secondary mb-4">
      {{ otherError }}
    </h1>
    <NuxtLink to="/" class="btn-primary mt-4">
      Home page
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
