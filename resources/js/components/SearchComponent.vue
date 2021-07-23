<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="mneedle"
        class="mr-2"
        :label="'Filter...'"
        @keydown.enter="$emit('search', mneedle)"
        @click:clear="$emit('search', '')"
        clearable
        single-line
        v-bind="attrs"
        v-on="on"
      >
        <template v-slot:label>
          <v-icon style="vertical-align: middle">
            mdi-file-find
          </v-icon>
          Filter...
        </template>
      </v-text-field>
    </template>
    <span>global match: all space-separated substrings must be present</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "Search",
  props: {
    needle: { type: String, default: "" }
  },
  watch: {
    needle: function(val) {
      this.mneedle = val;
    }
  },
  data: () => {
    return {
      mneedle: ""
    };
  }
};
</script>
