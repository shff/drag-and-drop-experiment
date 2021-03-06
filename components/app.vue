<template>
  <main class="h-screen">
    <nav
      class="flex border-b border-gray-200 inset-x-0 z-100 h-16 items-center p-6"
    >
      <div class="flex items-center flex-shrink-0 mr-6">
        <span class="font-semibold text-xl tracking-tight">
          Campaign Editor
        </span>
      </div>
    </nav>
    <div class="flex">
      <div class="border-right border-r h-screen w-64 p-4">
        <draggable
          v-model="partials"
          :group="{ name: 'all', pull: 'clone', put: false }"
          :clone="cloned"
          class="select-none"
          ghost-class="opacity-25"
        >
          <template v-for="partial in partials">
            <div
              :key="partial.id"
              class="p-2 border-gray-300 border cursor-move"
            >
              {{ partial.title }}
            </div>
          </template>
        </draggable>
      </div>
      <tabs class="flex-grow p-4 items-start">
        <div class="select-none" slot="Editor">
          <draggable
            v-model="elements"
            :group="{ name: 'all' }"
            ghost-class="opacity-25"
            class="select-none"
            @start="drag = true"
            @end="drag = false"
          >
            <div
              v-for="element in elements"
              v-html="compile(element)"
              class="p-2 border-2 border-transparent hover:border-blue-300 rounded cursor-move"
              :key="element.id"
            />
          </draggable>
        </div>
        <div slot="Globals">
          <template v-for="variable in variables">
            <label :key="variable" class="block mb-4">
              {{ variable }}:
              <input
                :value="globals[variable]"
                type="text"
                class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                @input="$set(globals, variable, $event.target.value)"
              />
            </label>
          </template>
        </div>
        <div slot="Result">
          <pre
            class="m-2 p-4 bg-gray-200 border border-gray-400 whitespace-normal"
            v-text="result"
          />
        </div>
      </tabs>
    </div>
  </main>
</template>

<script>
import draggable from "vuedraggable";
import { compile } from "handlebars";
import juice from "juice";
import declassify from "declassify";
import cheerio from "cheerio";
const Inky = require("inky/lib/inky");

import tabs from "./tabs.vue";
import partials from "./partials.json";

export default {
  components: { tabs, draggable },
  data() {
    return {
      drag: false,
      globals: {},
      elements: [],
      partials
    };
  },
  computed: {
    result() {
      const preamble = "<style>.row { color: black }</style>";
      const content = this.elements.map(e => this.compile(e)).join("\n");

      return declassify.process(juice(preamble + content));
    },
    variables() {
      const names = this.elements.map(a => a.name);
      const partials = this.partials.filter(a => names.includes(a.id));
      return partials.flatMap(a => a.variables);
    },
    nextId() {
      const ids = this.elements.map(a => a.id);
      return Math.max(0, ...ids) + 1;
    }
  },
  methods: {
    cloned({ id }) {
      return { id: this.nextId, name: id };
    },
    compile({ name }) {
      const template = this.partials.find(a => a.id == name).template;
      const content = compile(template)(this.globals);

      // Maybe this instead: https://github.com/schwarzdavid/bootstrap-email/blob/master/lib/BootstrapEmail.js
      return new Inky().releaseTheKraken(cheerio.load(content));
    }
  }
};
</script>

<style>
.flip-list-move {
  transition: transform 0.2s;
}
</style>
