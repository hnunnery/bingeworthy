<template>
  <div class="block sm:hidden bg-primary text-white px-4 py-2 mb-1 flex items-center">
    <button @click="$emit('toggle-menu')" class="text-white bg-transparent border-none p-2" style="margin-left: -16px;">
      <i class="fas fa-bars text-xl"></i>
    </button>
    <div class="flex-grow"></div>
    <div
      class="text-secondary font-bold font-italic text-center px-1"
      style="letter-spacing: -1px; font-size: 1.7em; margin-right: 47px;"
    >
      <nuxt-link to="/" class="text-white no-underline">BingeWorthy</nuxt-link>
    </div>
    <div class="flex-grow"></div>
  </div>
</template>
