<template>
  <v-card flat tile>
    <v-card-title>
      <v-row no-gutters>
        <v-col cols="8">{{ title }}</v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">{{ count }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
    <v-card-text>
      <apexchart v-show="!showTable"
        :height="height"
        :type="type"
        :options="options"
        :series="series"
      ></apexchart>
      <div v-if="showTable">
          <v-chip :key="entry" class="ml-1" x-small v-for="(entry,index) in tabledata.labels">{{ entry }}: {{ tabledata.data[index] }} Files</v-chip>
      </div>
      <div style="text-align:right">
        <v-tooltip bottom v-if="tooltip != ''">
          <template v-slot:activator="{ on, attrs }">
            <div style="display:inline-block" v-bind="attrs" v-on="on">
              <v-spacer />
              <v-icon>mdi-information</v-icon>
            </div>
          </template>
          <span>{{ tooltip }}</span>
        </v-tooltip>
        <div style="display:inline-block" @click="showTable = !showTable" v-if="tableview">
            <v-btn icon>  <v-icon >mdi-table</v-icon> </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Stats",
  props: {
    series: { type: Array, default: () => {return [] } },
    options: { type: Object, default: () => {return {}} },
    tabledata: { type: Object, default: () => {return {}} },
    height: { type: String, default: "auto" },
    type: { type: String, default: "bar" },
    tooltip: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    count: { type: String, default: "" },
  },
  computed: {
    tableview: function() {
      return typeof this.tabledata.labels != "undefined";
    }
  },
  data() {
    return {
      showTable: false
    };
  }
};
</script>
