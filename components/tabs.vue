<template>
  <div>
    <ul class="flex border-b select-none">
      <li v-for="(_,tab) in $slots" class="mr-1" :class="{ '-mb-px': selected == tab }">
        <a
          :class="{
            'bg-white inline-block font-semibold py-2 px-4': true,
            'border-l border-t border-r rounded-t text-blue-700': tab == selected,
            'text-blue-500 hover:text-blue-800 font-semibold': tab != selected,
          }"
          href="#"
          @click.prevent="selected = tab">
          {{ tab }}
        </a>
      </li>
    </ul>
    <div class="bg-white border border-gray-400 p-4 border-t-0">
      <slot :name="selected" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: Object.keys(this.$slots)[0],
      };
    },
  };
</script>
