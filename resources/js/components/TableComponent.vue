<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="entries"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
      :options="{ page: 1, itemsPerPage: 20 }"
      item-key="uid"
      show-expand
      @current-items="getCDef"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Package Explorer</v-toolbar-title>
        </v-toolbar>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="padding:0">
          <v-card flat tile>
            <v-card-title>{{ item.name || "Missing name" }}</v-card-title>
            <v-card-subtitle
              >{{ item.version || "0.0.0" }} |
              {{ item.revision || "-" }}</v-card-subtitle
            >
            <v-card-text>
              <v-row>
                <v-col cols="6" v-if="item.source_files">
                  <h4 class="mt-3">SOURCE FILES</h4>
                  <v-virtual-scroll
                    :items="item.source_files"
                    :item-height="30"
                    height="200"
                  >
                    <template v-slot:default="{ item }">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.name }}
                            <v-chip small v-if="item.files_in_archive"
                              >{{ item.files_in_archive }} Files</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('tar.gz') != -1"
                              >tar.gz</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('http://') != -1"
                              >http</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('https://') != -1"
                              >https</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('file://') != -1"
                              >local</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('gnu.org') != -1"
                              >gnu.org</v-chip
                            >
                            <v-chip
                              small
                              v-if="item.src_uri.indexOf('patch') != -1"
                              >patch</v-chip
                            >
                          </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-btn
                            depressed
                            small
                            :href="item.src_uri"
                            target="_blank"
                          >
                            File
                            <v-icon color="orange darken-4" right>
                              mdi-open-in-new
                            </v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-col>
                <v-col cols="6" v-if="item.binary_packages">
                  <h4 class="mt-3">BINARY PACKAGES</h4>
                  <v-virtual-scroll
                    :items="item.binary_packages[0]"
                    :item-height="30"
                    height="200"
                  >
                    <template v-slot:default="{ item }">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.name }}
                            <v-chip small>{{ item.version }}</v-chip>
                            <v-chip small>{{ item.revision }}</v-chip>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </td>
      </template>

      <template v-for="h in headers" v-slot:[`header.${h.value}`]="{ header }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{ h.text }}</span>
          </template>
          <span>{{ h.tooltip }}</span>
        </v-tooltip>
      </template>

      <template
        v-for="head in headers"
        v-slot:[`item.${head.value}`]="{ item }"
      >
        <div v-if="head.type == 'implode'">
          <div v-for="text in resolve(head.value, item)" style="font-size:11px">
            {{ text }}
          </div>
        </div>

        <div v-if="head.type == 'implode_tag'">
          <div v-for="text in resolve(head.value, item)" style="font-size:11px">
            <v-chip small class="mb-1">{{ text }}</v-chip>
          </div>
        </div>

        <div v-if="head.type == 'progress'">
          <v-progress-linear
            :value="item.progress"
            :color="palette[0]"
            :height="25"
          >
            <template v-slot:default="{ value }">
              <strong style="font-size:11px">{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
          <div style="font-size:11px" class="text-center mt-1">
            {{ item.workload }} Files done
          </div>
        </div>

        <div v-if="head.type == 'workload'">
          <div>
            <v-icon size="15" v-if="normalize(item.workload_total) < 0.2"
              >mdi-weight</v-icon
            >
            <v-icon
              size="30"
              v-if="
                normalize(item.workload_total) < 0.4 &&
                  normalize(item.workload_total) >= 0.2
              "
              >mdi-weight</v-icon
            >
            <v-icon
              size="45"
              v-if="
                normalize(item.workload_total) < 0.6 &&
                  normalize(item.workload_total) >= 0.4
              "
              >mdi-weight</v-icon
            >
            <v-icon
              size="60"
              v-if="
                normalize(item.workload_total) < 0.8 &&
                  normalize(item.workload_total) >= 0.6
              "
              >mdi-weight</v-icon
            >
            <v-icon size="75" v-if="normalize(item.workload_total) >= 0.8"
              >mdi-weight</v-icon
            >
          </div>

          <div style="font-size:11px" class="text-center mt-2">
            {{ item.workload_total }} Files total
          </div>
        </div>

        <div v-if="head.type == 'chart'">
          <div
            class="ma-1"
            v-if="
              head.value ==
                'statistics.licenses.license_audit_findings.all_licenses'
            "
          >
            <div class="ma-1 text-center" style="font-weight:bold;min-height:21px">
              {{ sums["all_" + item.uid] }}
            </div>

            <v-img
              width="200"
              lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2M4c+bMfwAIMANkq3cY2wAAAABJRU5ErkJggg=="
              :src="srcs['all_' + item.uid]"
              height="200"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <canvas
              style="display:none;width:200px;height:120px;"
              width="200"
              :ref="'canvas_' + item.uid"
              :id="'all_' + item.uid"
            ></canvas>
          </div>

          <div
            class="ma-1"
            v-if="head.value == 'statistics.licenses.license_scanner_findings'"
          >
            <div class="ma-1 text-center" style="font-weight:bold;min-height:21px">
              {{ sums["scan_" + item.uid] }}
            </div>

            <v-img
              width="200"
              lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2M4c+bMfwAIMANkq3cY2wAAAABJRU5ErkJggg=="
              :src="srcs['scan_' + item.uid]"
              height="200"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="white"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <canvas
              style="display:none;width:200px;height:120px;"
              width="200"
              :ref="'canvas3_' + item.uid"
              :id="'scan_' + item.uid"
            ></canvas>
          </div>
        </div>

        <div v-if="head.type == 'match' && item.debian_matching">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                large
                :color="match(item)"
                v-if="match(item) == 'red'"
                >mdi-network-strength-1</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item)"
                v-if="match(item) == 'orange'"
                >mdi-network-strength-2</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item)"
                v-if="match(item) == 'yellow'"
                >mdi-network-strength-3</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item)"
                v-if="match(item) == 'green'"
                >mdi-network-strength-4</v-icon
              >
            </template>
            <span
              >{{ item.debian_matching.ip_matching_files }} /
              {{ item.statistics.files.total }} ({{
                item.debian_matching.name
              }})</span
            >
          </v-tooltip>
        </div>

        <div
          v-if="head.type == 'string'"
          style="font-size:11px;word-break: break-all;"
        >
          {{ item[head.value] }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import ChartDataLabels from "../beta/chartjs-plugin-datalabels";

export default {
  props: {
    entries: {
      type: Array,
      default: () => {
        return [];
      }
    },
    all: {
      type: Array,
      default: () => {
        return [];
      }
    },
    headers: {
      type: Array,
      default: () => {
        return [];
      }
    },
    stats: {
      type: Object,
      default: () => {
        return {};
      }
    },
    ident: {
      type: String,
      default: "ident key"
    },
    palette: {
      type: Array,
      default: () => {
        return [];
      }
    },
    colors: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null,
      srcs: {},
      sums: {},
      charts: {},
      expanded: [],
      singleExpand: false
    };
  },
  methods: {
    getCDef(e) {
      Vue.nextTick(() => {
        this.getCharts(e);
      });
    },
    getCharts(e) {
      for (var i = 0; i < e.length; i++) {
        if (e[i].statistics && e[i].statistics.licenses) {
          this.getStaticChartsJS(
            e[i].statistics.licenses.license_audit_findings.all_licenses,
            e[i],
            3,
            res => {},
            "all_" + e[i].uid
          );

          this.getStaticChartsJS(
            e[i].statistics.licenses.license_scanner_findings,
            e[i],
            3,
            res => {},
            "scan_" + e[i].uid
          );
        } else {
          this.srcs["all_" + e[i].uid] =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
          this.sums["all_" + e[i].uid] = 0;
          this.srcs["scan_" + e[i].uid] =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
          this.sums["scan_" + e[i].uid] = 0;
          e[i].chartSRC =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }
      }
    },
    resolve(path, obj = self, separator = ".") {
      var properties = Array.isArray(path) ? path : path.split(separator);
      const res = properties.reduce((prev, curr) => prev && prev[curr], obj);
      return properties.reduce((prev, curr) => prev && prev[curr], obj) || [];
    },
    getColor(score) {
      if (score > 89) return "green";
      else if (score > 49) return "orange";
      else return "red";
    },
    getDiversity(score) {
      if (score < 20) return "green";
      else if (score < 50) return "orange";
      else return "red";
    },
    emitFiltered(e) {
      this.$emit("filtered-items", e);
    },
    normalize(x, faktor = 1) {
      if (isNaN(x)) x = 0;
      let norm =
        ((x - this.stats.min) / (this.stats.max - this.stats.min)) * faktor;
      return norm + 0.1 * faktor;
    },
    match: function(str) {
      if (!str.debian_matching || !str.statistics) return "red";

      let match =
        str.debian_matching.ip_matching_files /
        str.statistics.files.upstream_source_total;

      if (match >= 0.95) return "green";
      if (match >= 0.6) return "yellow";
      if (match >= 0.1) return "orange";

      return "red";
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
    getStaticChartsJS: function(
      data,
      item,
      grouping = 3,
      callback = () => {},
      uid
    ) {
      let names = data.map(ob => ob.shortname);
      let values = data.map(ob => ob.file_count);

      if (values.length == 0) {
        this.srcs[uid] =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        return false;
      }

      // total
      this.sums[uid] =
        values.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        ) || 0;

      // sorting
      const sorted = this.sortNamesAndValueArrays(names, values);

      names = sorted.names.slice(0, grouping);
      values = sorted.values.slice(0, grouping);

      // grouping
      let others = sorted.values.slice(grouping);

      if (others.reduce((a, b) => a + b, 0) > 0) {
        names.push("Others (" + others.length + ")");
        this.colors["Others (" + others.length + ")"] = "#999999";
        values.push(others.reduce((a, b) => a + b, 0));
      }

      // colorizing
      var colors = [];
      for (var a = 0; a < names.length; a++) {
        colors.push(this.colors[names[a]] || this.palette[a]);
      }

      let dat = {
        labels: names,
        datasets: [
          {
            data: values,
            backgroundColor: colors
          }
        ]
      };

      let chartjs = {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: dat,
        options: {
          animation: {
            onComplete: () => {
              callback(this.charts[uid].toBase64Image());
              this.srcs[uid] = this.charts[uid].toBase64Image();
              this.charts[uid].destroy();
              this.$forceUpdate();
            }
          },
          plugins: {
            legend: {
              display: true,
              position: "bottom",
              labels: {
                boxWidth: 10,
                font: {
                  size: 10
                }
              }
            },
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  sum += data;
                });
                let res = (value * 100) / sum;
                if (res < 4) return "";
                let percentage = ((value * 100) / sum).toFixed(2) + "%";
                return value;
              },
              responsive: false,
              font: {
                size: 12
              },
              color: "#000"
            }
          }
        }
      };

      if (document.getElementById(uid)) {
        this.charts[uid] = new Chart(
          document.getElementById(uid).getContext("2d"),
          chartjs
        );
      } else
        this.srcs[uid] =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
  }
};
</script>
