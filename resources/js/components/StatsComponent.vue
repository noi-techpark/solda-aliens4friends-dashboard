<template>
  <v-card tile flat>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle :style="'color:' + colors[level]">{{ subtitle }}</v-card-subtitle>
    <v-card-text class="text-center pa-0" style="font-size:30px">
      {{ value }}
      <v-expansion-panels accordion class="mt-2 pa-0" flat tile>
        <v-expansion-panel>
          <v-expansion-panel-header class="pa-4"></v-expansion-panel-header>
          <v-expansion-panel-content style="font-size:11px; text-align:left">
            <v-virtual-scroll :items="items" height="100" item-height="20">
              <template v-slot:default="{ item }">
                <div style="cursor:pointer" @click="$emit('searchFor', item.name)">
                  {{ item.name }}
                </div>
              </template>
            </v-virtual-scroll>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Stats",
  props: {
    title: { type: String, default: "Stats" },
    subtitle: { type: String, default: "Generic" },
    value: { default: "-" },
    items: {
      type: Array,
      default: () => {
        return [{ name: "no item details" }];
      }
    },
    level: { type: Number, default: 0 }
  },
  data() {
    return {
      colors: ["black", "black", "black"]
    };
  },
  methods: {}
};
</script>
