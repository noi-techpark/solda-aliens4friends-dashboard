<template>
  <v-card flat tile class="chart-component">
    <v-card-title>
      <v-row no-gutters>
        <v-col cols="8">{{ title }}</v-col>
        <v-spacer></v-spacer>
        <v-col class="text-right">{{ count }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
    <v-card-text>
      <apexchart
        v-show="!showTable"
        :height="height"
        :type="type"
        :options="options"
        :series="series"
      ></apexchart>
      <div v-if="showTable">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          hide-details
        ></v-text-field>
        <v-data-table
          dense
          :headers="chartTableHeaders"
          :items="chartTableItems"
          :search="search"
          item-key="name"
        ></v-data-table>
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
        <div
          style="display:inline-block"
          @click="showTable = !showTable"
          v-if="tableview"
        >
          <v-btn icon> <v-icon>mdi-table</v-icon> </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Stats",
  props: {
    series: {
      type: Array,
      default: () => {
        return [];
      }
    },
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    tabledata: {
      type: Object,
      default: () => {
        return {};
      }
    },
    height: { type: String, default: "auto" },
    type: { type: String, default: "bar" },
    tooltip: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    count: { type: String, default: "" }
  },
  computed: {
    tableview: function() {
      return typeof this.tabledata.labels != "undefined";
    },
    chartTableItems: function() {
      var res = [];
      for (var a = 0; a < this.tabledata.labels.length; a++) {
        res.push({
          type: this.tabledata.labels[a],
          count: this.tabledata.data[a]
        });
      }

      return res;
    }
  },
  data() {
    return {
      showTable: false,
      search: "",
      chartTableHeaders: [
        {
          text: "License type",
          value: "type",
          fixed: true,
          width: "60%",
          align: "start"
        },
        {
          text: "File count",
          value: "count",
          fixed: true,
          width: "40%",
          align: "end"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.chart-component .v-data-footer__select {
  display: none;
}
</style>
