<template>
  <v-text-field
    v-model="mneedle"
    :label="'Filter...'"
    @keydown.enter="$emit('search', mneedle)"
    @click:clear="$emit('search', '')"
    clearable
    single-line
  >
    <template v-slot:label>
      <v-icon style="vertical-align: middle">
        mdi-file-find
      </v-icon>
      Filter...
    </template>
  </v-text-field>
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
