<template>
  <div>
      <v-app-bar app>
        <template v-slot:img="{ props }">
            <v-img v-bind="props" gradient="to top right, #FFFFFF, #F5F5F5"></v-img>
        </template>

        <v-toolbar-title class="ml-3">Aliens4Friends Dashboard</v-toolbar-title>
         <v-spacer></v-spacer>
          <v-btn elevation="0" width="250"  class="mr-4" :class="{ filtered : isFiltered }">
            {{ current.length }}/{{ entries.length }}  packages
        </v-btn>
        <search-component  :class="{ filtered : isFiltered }" @search="triggerSearch" :needle="needle"></search-component>

        <v-spacer></v-spacer>
        <upload-component
            class="mr-3"
        ></upload-component>
    </v-app-bar>
    <v-container fluid>
      <v-row v-if="false">
        <v-progress-linear
          :value="progress"
          :color="palette[0]"
          :height="30"
          class="mx-3"
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) || 0 }}%</strong>
          </template>
        </v-progress-linear>
      </v-row>
      <v-row align="stretch">

        <v-col cols="6" :class="{ filtered : isFiltered }">
          <v-card flat tile>
            <v-card-title>FOSSology audit progress</v-card-title>
            <v-card-subtitle>Total audit files</b>
            </v-card-subtitle>
            <v-card-text class="pa-0">
              <apexchart
                v-if="entries.length > 0 && current.length > 0"
                height="110px"
                type="bar"
                :options="
                  getCharts(
                    [
                      stats.counts.audit_done.value,
                      stats.counts.audit_to_do.value,
                      auditdiff.value
                    ],
                    [
                      stats.counts.audit_done.subtitle,
                      stats.counts.audit_to_do.subtitle,
                      auditdiff.subtitle
                    ],
                    false,
                    true,
                    false,
                    '100%'
                  ).chartOptions
                "
                :series="
                  getCharts(
                    [
                      stats.counts.audit_done.value,
                      stats.counts.audit_to_do.value,
                      auditdiff.value
                    ],
                    [
                      stats.counts.audit_done.subtitle,
                      stats.counts.audit_to_do.subtitle,
                      auditdiff.subtitle
                    ],
                    false,
                    true,
                    false,
                    '100%'
                  ).series
                "
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" :class="{ filtered : isFiltered }">
          <v-card flat tile>
            <v-card-title>Provenance</v-card-title>
            <v-card-subtitle>Upstream source total: <b>{{ stats.counts.upstream_source_total.value }}</b></v-card-subtitle>
            <v-card-text class="pa-0">
              <apexchart
                v-if="entries.length > 0 && current.length > 0"
                height="110px"
                type="bar"
                :options="
                  getCharts(
                    [
                      stats.counts.known_provenance.value,
                      stats.counts.unknown_provenance.value
                    ],
                    [
                      stats.counts.known_provenance.subtitle,
                      stats.counts.unknown_provenance.subtitle
                    ],
                    false,
                    true,
                    false
                  ).chartOptions
                "
                :series="
                  getCharts(
                    [
                      stats.counts.known_provenance.value,
                      stats.counts.unknown_provenance.value
                    ],
                    [
                      stats.counts.known_provenance.subtitle,
                      stats.counts.unknown_provenance.subtitle
                    ],
                    false,
                    true,
                    false
                  ).series
                "
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>


        <v-col cols="4" :class="{ filtered : isFiltered }">
          <v-card flat tile>
            <v-card-title>
              <v-row no-gutters>
                <v-col cols="8">{{ stats.charts.scan.title }}</v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right">{{
                  Object.keys(stats.charts.scan.value).length
                }}</v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle>{{ stats.charts.scan.subtitle }}</v-card-subtitle>
            <v-card-text v-if="Object.keys(stats.charts.scan.value).length > 0">
              <apexchart
                v-if="entries.length > 0 && current.length > 0"
                height="300px"
                type="pie"
                :options="getCharts(stats.charts.scan.value).chartOptions"
                :series="getCharts(stats.charts.scan.value).series[0].data"
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4" :class="{ filtered : isFiltered }">
          <v-card flat tile>
            <v-card-title>
              <v-row no-gutters>
                <v-col cols="8">{{ stats.charts.main_licenses.title }}</v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right">{{
                  stats.counts.main_licenses.value.length
                }}</v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle>{{
              stats.charts.main_licenses.subtitle
            }}</v-card-subtitle>
            <v-card-text v-if="stats.counts.main_licenses.value.length > 0">
              <apexchart
                v-if="entries.length > 0 && current.length > 0"
                height="300px"
                type="pie"
                :options="
                  getCharts(stats.charts.main_licenses.value).chartOptions
                "
                :series="
                  getCharts(stats.charts.main_licenses.value).series[0].data
                "
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4" :class="{ filtered : isFiltered }">
          <v-card flat tile>
            <v-card-title>
              <v-row no-gutters>
                <v-col cols="8">{{ stats.charts.audit_all.title }}</v-col>
                <v-spacer></v-spacer>
                <v-col class="text-right">{{
                  Object.keys(stats.charts.audit_all.value).length
                }}</v-col>
              </v-row>
            </v-card-title>
            <v-card-subtitle>{{
              stats.charts.audit_all.subtitle
            }}</v-card-subtitle>
            <v-card-text v-if="Object.keys(stats.charts.audit_all.value).length > 0">
              <apexchart
                v-if="entries.length > 0 && current.length > 0"
                height="300px"
                type="pie"
                :options="getCharts(stats.charts.audit_all.value).chartOptions"
                :series="getCharts(stats.charts.audit_all.value).series[0].data"
              ></apexchart>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-row fill-height>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.main_licenses.title"
                :subtitle="stats.counts.main_licenses.subtitle"
                :value="stats.counts.main_licenses.value.length"
                :items="stats.counts.main_licenses.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.total.title"
                :subtitle="stats.counts.total.subtitle"
                :value="stats.counts.total.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component

                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.flavours.title"
                :subtitle="stats.counts.flavours.subtitle"
                :value="stats.counts.flavours.value.length"
                :items="stats.counts.flavours.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.images.title"
                :subtitle="stats.counts.images.subtitle"
                :value="stats.counts.images.value.length"
                :items="stats.counts.images.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.machines.title"
                :subtitle="stats.counts.machines.subtitle"
                :value="stats.counts.machines.value.length"
                :items="stats.counts.machines.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered : isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.buildtags.title"
                :subtitle="stats.counts.buildtags.subtitle"
                :value="stats.counts.buildtags.value.length"
                :items="stats.counts.buildtags.value"
              ></stats-component>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-container fill-height fluid>

      <v-row>
        <v-col :class="{ filtered : isFiltered }">
          <table-component
            :entries="current"
            :headers="headers"
            :stats="total_stats"
            :palette="palette"
            :colors="colors"
            ident="Meta"
          ></table-component>
        </v-col>
      </v-row>
      <v-row class="mt-0">
          <v-col class="text-right" style="font-size:11px">
              powered by
              <b><a style="color:rgb(213,61,14)" href="https://www.linkedin.com/in/martinrabanser" target="_blank">rmb Martin Rabanser</a></b> &amp;
              <b><a style="color:rgb(213,61,14)" href="mailto:alex@agon-e.com" target="_blank">Alex Complojer</a></b>
          </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="timeout" color="red">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn  width="230" color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import headers from "../presets/table_headers";
import colors from "../presets/colors";

export default {
  data() {
    return {
      needle: "",
      headers: headers.headers,
      snackbar: false,
      current: [],
      text: "",
      timeout: 5000,
      progress: 0,
      total_stats: {
        known: 0,
        audited: 0,
        total: 0,
        min: 0,
        max: 0
      },
      palette: colors.colors,
      colors: {
        "Known provenance": "#4ea262",
        "Unknown provenance": "#808080",
        "Audit done": "#4ea262",
        "Audit todo": "#ff3232",
        audit_total: "#777777",
        upstream_source_total: "#DDDDDD",
        total: "#999999",
        "Audit not required": "#999999"
      }
    };
  },
  computed: {
    ...mapGetters({
      json: "file/json"
    }),
    entries: function() {
      let source = this.json.source_packages || [];
      let res = [];
      let index = 0;

      let all = {
        known: 0,
        audited: 0,
        not_audited: 0,
        audit_total: 0,
        total: 0,
        min: 0,
        max: 0
      };

      // TODO: validate input data
      for (let i = 0; i < source.length; i++) {
        if (source[i].statistics) {
          const filestats = source[i].statistics.files;

          // es fehlen oft die audit-knoten
          if (isNaN(filestats.unknown_provenance)) filestats.unknown_provenance = 0;
          if (isNaN(filestats.known_provenance)) filestats.known_provenance = 0;
          if (isNaN(filestats.total)) filestats.total = 0;
          if (isNaN(filestats.audit_total)) filestats.audit_total = 0;
          if (isNaN(filestats.audit_done)) filestats.audit_done = 0;
          if (isNaN(filestats.audit_to_do)) filestats.audit_to_do = 0;
          if (isNaN(filestats.upstream_source_total)) filestats.upstream_source_total = 0;

          // predefine license colors
          let licenses = [];
          if (source[i].statistics.licenses) {
            licenses = licenses.concat(
              source[i].statistics.licenses.license_audit_findings.all_licenses
            );
            licenses = licenses.concat(
              source[i].statistics.licenses.license_scanner_findings
            );
          }

          for (let a = 0; a < licenses.length; a++) {
            if (!this.palette[index]) index = 0;
            if (!this.colors[licenses[a].shortname]) {
              this.colors[licenses[a].shortname] = this.palette[index];
              index++;
            }
          }

          // patch table index and single progresses
          source[i].uid = i;
          source[i].progress = parseInt(
            (filestats.audit_done / filestats.audit_total) * 100
          );
          source[i].workload = filestats.audit_done;
          source[i].workload_total = filestats.audit_total;

          // overall progress & normalization params
          all.known += filestats.known_provenance;
          all.audited += filestats.audit_done;
          all.not_audited += filestats.audit_to_do;
          all.audit_total += filestats.audit_total;
          all.total += filestats.total;

          all.max =
            all.max == 0 || filestats.audit_total > all.max
              ? filestats.audit_total
              : all.max;

          all.min =
            all.min == 0 || filestats.audit_total < all.min
              ? filestats.audit_total
              : all.min;
        }

        res.push(source[i]);
      }

      this.progress = parseInt((all.audited / all.audit_total) * 100);
      this.total_stats = all;
      this.current = res;

      return res;
    },
    auditdiff: function() {
      let res = {
        title: "Files",
        subtitle: "Audit not required",
        value:
          this.stats.counts.total.value - this.stats.counts.audit_total.value
      };
      return res;
    },
    isFiltered: function() {
      return this.needle != "";
    },
    stats: function() {
      let res = {
        counts: {
          known_provenance: {
            title: "Files",
            subtitle: "Known provenance",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.known_provenance)
              )
                return accumulator;
              return (
                accumulator + currentValue.statistics.files.known_provenance
              );
            }, 0)
          },
          total: {
            title: "Files",
            subtitle: "total",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.total)
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.total;
            }, 0)
          },
          audit_total: {
            title: "Files",
            subtitle: "Audit total",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_total)
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_total;
            }, 0)
          },
          unknown_provenance: {
            title: "Files",
            subtitle: "Unknown provenance",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.unknown_provenance)
              )
                return accumulator;
              return (
                accumulator + currentValue.statistics.files.unknown_provenance
              );
            }, 0)
          },
          audit_done: {
            title: "Files",
            subtitle: "Audit done",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_done)
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_done;
            }, 0)
          },
          audit_to_do: {
            title: "Files",
            subtitle: "Audit todo",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_to_do)
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_to_do;
            }, 0)
          },
          upstream_source_total: {
            title: "Files",
            subtitle: "upstream_source_total",
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.upstream_source_total)
              )
                return accumulator;
              return (
                accumulator +
                currentValue.statistics.files.upstream_source_total
              );
            }, 0)
          },
          flavours: {
            title: "Distros",
            subtitle: "accumulated",
            value: this.accumulatedTags("distro")
          },
          images: {
            title: "Images",
            subtitle: "accumulated",
            value: this.accumulatedTags("image")
          },
          main_licenses: {
            title: "Main Licenses",
            subtitle: "accumulated",
            value: this.accumulatedMainLicenses()
          },
          machines: {
            title: "Machines",
            subtitle: "accumulated",
            value: this.accumulatedTags("machine")
          },
          buildtags: {
            title: "Releases",
            subtitle: "accumulated",
            value: this.accumulatedTags("release")
          }
        },
        charts: {
          scan: {
            title: "License types scanned",
            subtitle:
              "Results from automated scanners such as scancode, monk, nomos, ojo",
            value: this.accumulatedLicenses("license_scanner_findings")
          },
          audit_all: {
            title: "License types audited",
            subtitle: "Results by human auditor analysis",
            value: this.accumulatedLicenses("license_audit_findings.all_licenses")
          },
          main_licenses: {
            title: "Main license types",
            subtitle: "Accumulated main licenses",
            value: this.accumulatedLicenses("license_audit_findings.main_licenses", true)
          }
        }
      };

      return res;
    }
  },
  methods: {
    resolve(path, obj = self, separator = ".") {
      var properties = Array.isArray(path) ? path : path.split(separator);
      return properties.reduce((prev, curr) => prev && prev[curr], obj);
    },
    triggerSearch(e) {
      this.filter(e);
    },
    filter(needle) {
      this.needle = needle;

      let res = [];

      let splitted = needle.split(" ");

      for (var a = 0; a < this.entries.length; a++) {
        let found = true;
        let str = JSON.stringify(this.entries[a]).toLowerCase() || "";

        for (var i = 0; i < splitted.length; i++) {
          found = str.indexOf(splitted[i].toLowerCase()) != -1 && found;
        }

        if (found) {
          res.push(this.entries[a]);
        }
      }

      this.current = res;
    },
    accumulatedMainLicenses: function() {
      let res = {};

      for (let i = 0; i < this.current.length; i++) {
        let license_names = [];

        if (this.current[i].statistics && this.current[i].statistics.licenses) {
          license_names = this.current[i].statistics.licenses
            .license_audit_findings.main_licenses;
        }

        for (let a = 0; a < license_names.length; a++) {
          res[license_names[a]] = { name: license_names[a] };
        }
      }

      return Object.values(res);
    },
    accumulatedLicenses: function(node, count = false) {
      let res = {};
      for (let i = 0; i < this.current.length; i++) {
        let licenses = this.current[i].statistics
          ? this.resolve(node, this.current[i].statistics.licenses) || []
          : [];
        for (let a = 0; a < licenses.length; a++) {
          const license = licenses[a];

          if (!count) {
            res[license.shortname]
              ? (res[license.shortname] += license.file_count)
              : (res[license.shortname] = license.file_count);
          } else {
            res[license] ? (res[license] += 1) : (res[license] = 1);
          }
        }
      }

      return res;
    },
    accumulatedTags: function(node) {
      let res = {};

      for (let i = 0; i < this.current.length; i++) {
        let tags = this.resolve(node, this.current[i].tags) || [];
        for (let a = 0; a < tags.length; a++) {
          res[tags[a]] = { name: tags[a] };
        }
      }

      return Object.values(res);
    },
    sortNamesAndValueArrays: function(names = [], values = []) {
      var list = [];
      for (var j = 0; j < names.length; j++)
        list.push({ name: names[j], val: values[j] });

      list.sort(function(a, b) {
        return a.val > b.val ? -1 : a.val == b.val ? 0 : 1;
      });

      for (var k = 0; k < list.length; k++) {
        names[k] = list[k].name;
        values[k] = list[k].val;
      }

      return {
        names: names,
        values: values
      };
    },
    getCharts(
      data = [],
      labels = [],
      grouping = 10,
      stacked = false,
      sorting = true,
      stackType = "normal"
    ) {
      if (
        typeof data === "object" &&
        !(data instanceof Array) &&
        data !== null
      ) {
        const odata = data;
        data = [];
        labels = [];

        Object.keys(odata).forEach(function(key, index) {
          labels.push(key);
          data.push(odata[key]);
        });
      }

      // sorting
      if (sorting) {
        const sorted = this.sortNamesAndValueArrays(labels, data);
        labels = sorted.names;
        data = sorted.values;
      }

      if (grouping) {
        const odata = data;

        labels = labels.slice(0, grouping);
        data = odata.slice(0, grouping);

        // grouping
        let others = odata.slice(grouping);

        if (others.reduce((a, b) => a + b, 0) > 0) {
          labels.push("Others (" + others.length + ")");
          data.push(others.reduce((a, b) => a + b, 0));
        }

        this.colors["Others (" + others.length + ")"] = "#999999";
      }

      // colorizing
      this.colors["Others"] = "#999999";
      var colors = [];
      for (var a = 0; a < labels.length; a++) {
        colors.push(this.colors[labels[a]] || this.palette[a]);
      }

      let series = [
        {
          name: "Files",
          data: data
        }
      ];

      if (stacked) {
        var odata = data;
        series = [];
        for (var a = 0; a < odata.length; a++) {
          series.push({
            name: labels[a],
            data: [odata[a]]
          });
        }
      }

      let res = {
        chartOptions: {
          colors: colors,
          labels: labels,
          chart: {
            toolbar: {
              show: false
            },
            stacked: stacked,
            stackType: stackType
          },
          tooltip: {
            x: {
              show: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              distributed: false,
              horizontal: true,
              barHeight: "100%"
            }
          }
        },
        series: series
      };

      return res;
    }
  }
};
</script>

<style lang="scss">
.apexcharts-legend.position-right {
  width: 180px;
  overflow: hidden;
}

.v-card,
.v-data-table {
  border: 2px solid white !important;
}

.v-input__append-inner .v-icon {
  color: green !important;
}

.filtered {
  > .v-card,
  > div .v-data-table {
    border: 2px solid green !important;
  }
}
.filtered.v-btn {
  border: 2px solid green !important;
}

.v-text-field__details {
  display: none !important;
}
.v-input__slot {
  margin-bottom: 4px !important;

  .v-application .primary--text {
    color: green !important;
  }
}
</style>
