<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon class="mb-2" v-if="item.cveStatus.unpatched > 0" color="red" v-on="on"
        >mdi-security</v-icon
      >
      <v-icon class="mb-2" v-else-if="item.cveStatus.ignored > 0" color="orange" v-on="on"
        >mdi-security</v-icon
      >
      <v-icon class="mb-2" v-else-if="item.cveStatus.patched > 0" color="green" v-on="on"
        >mdi-security</v-icon
      >
    </template>
    <ul>
      <li v-if="item.cveStatus.patched > 0">patched: {{ item.cveStatus.patched }}</li>
      <li v-if="item.cveStatus.ignored > 0">ignored: {{ item.cveStatus.ignored }}</li>
      <li v-if="item.cveStatus.unpatched > 0">unpatched: {{ item.cveStatus.unpatched }}</li>
      <li v-if="item.cveStatus.unpatched > 0">max unpatched v2/v3: {{ item.cveStatus.scores }}</li>
    </ul>
  </v-tooltip>
</template>
  
<script>
export default {
  name: "Badge",
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          cveStatus: {}
        }
      }
    }
  },
  data: () => {
    return {}
  }
}
</script>
  