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
          <v-toolbar-title>
            Package Explorer
          </v-toolbar-title>
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
                <v-col v-if="item.source_files">
                  <v-tabs v-model="item.sourcetab">
                    <v-tab>
                      Common Source Files
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="item.sourcetab">
                    <v-tab-item>
                  <v-virtual-scroll
                    :items="item.source_files"
                    :item-height="30"
                    height="200"
                  >
                    <template v-slot:default="{ item }">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.sha1_cksum }}
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
                                                        <v-chip
                                                        color="green"
                              small
                              v-if="item.audited || item.src_uri.indexOf('file://') != -1"
                              ><v-icon>mdi-check</v-icon></v-chip
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
                    </v-tab-item>
                  </v-tabs-items>



                </v-col>
                                <v-col v-if="item.variant_files">
                  <v-tabs v-model="item.varianttab">
                    <v-tabs-slider color="green"></v-tabs-slider>
                    <v-tab v-for="(variant, name) in item.variant_files" :key="name">
                      {{ name }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="item.varianttab">
                    <v-tab-item v-for="(variant, name) in item.variant_files" :key="name">
                  <v-virtual-scroll
                    :items="variant.source_files"
                    :item-height="30"
                    height="200"
                  >
                    <template v-slot:default="{ item }">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.sha1_cksum }}
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
                                                                     <v-chip
                                                        color="green"
                              small
                              v-if="item.audited || (typeof item.audited == "undefined" && item.src_uri.indexOf('file://') != -1)"
                              ><v-icon>mdi-check</v-icon></v-chip
                            > <!-- TODO: Implement item.audited-->
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
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
                <v-col v-if="item.binary_packages">
                                    <v-tabs v-model="item.binarytab">
                    <v-tab>
                      Binary Packages
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="item.binarytab">
                    <v-tab-item>
                  <v-virtual-scroll
                    :items="getBinaries(item.binary_packages)"
                    :item-height="30"
                    height="200"
                    style="font-size:80%"
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
                    </v-tab-item>
                  </v-tabs-items>


                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </td>
      </template>

      <template v-for="h in headers" v-slot:[`header.${h.value}`]="{ header }">
        <div
          style="float: left;"
          v-if="header.filterVals && header.filterVals.length > 0"
          :key="h.value"
        >
          <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y
            transition="slide-y-transition"
            right
            fixed
          >
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="{
                  act: Object.values(header.activeVals).reduce((a, o) => {
                    return a || o;
                  }, false)
                }"
                v-on="on"
                v-bind="attrs"
                style="line-height:16px"
                ><v-icon small class="mr-1 mb-1">mdi-filter</v-icon></span
              >
            </template>
            <v-list flat dense class="pa-0" max-height="300" color="white">
              <template v-for="item in header.filterVals">
                <v-list-item
                  :key="`${item}`"
                  :value="item"
                  :ripple="false"
                  dense
                  style="background:white;"
                >
                  <v-list-item-action style="margin:0;" class="mr-2">
                    <v-checkbox
                      v-model="header.activeVals[item]"
                      @click="toggle(header, item)"
                      color="primary"
                      dense
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-divider></v-divider>
              <v-row no-gutters> </v-row>
            </v-list>
          </v-menu>
        </div>
        <div style="float: left;" v-if="header.valueFilter" :key="h.value">
          <v-menu
            :close-on-content-click="false"
            offset-y
            transition="slide-y-transition"
            right
            fixed
          >
            <template v-slot:activator="{ on, attrs }">
              <span
                v-on="on"
                v-bind="attrs"
                style="line-height:16px"
                :class="{ act: header.valueFilter.value != '' }"
              >
                <v-icon small class="mr-1 mb-1"
                  >mdi-numeric-1-box-multiple-outline</v-icon
                ></span
              >
            </template>
            <v-row
              style="background:white;width:250px;overflow:hidden"
              class="pa-2"
              no-gutters
            >
              <v-spacer></v-spacer>
              <v-col>
                <v-select
                  :items="['=', '>', '<', '!']"
                  dense
                  v-model="header.valueFilter.operator"
                  single-line
                  class="mr-4"
                  style="top:2px;position:relative"
                  @change="$emit('filter-change')"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="header.valueFilter.value"
                  label=""
                  single-line
                  :rules="[rules.isnumber]"
                  :suffix="header.valueFilter.unit"
                  style="text-align:center;"
                  class="pt-0 mt-0 text-center"
                  @blur="$emit('filter-change')"
                >
                </v-text-field>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
          </v-menu>
        </div>
        <v-tooltip top :key="h.text">
          <template v-slot:activator="{ on }">
            <span v-on="on" style="line-height:16px">{{ h.text }}</span>
          </template>
          <span>{{ h.tooltip }}</span>
        </v-tooltip>
      </template>

      <template
        v-for="head in headers"
        v-slot:[`item.${head.value}`]="{ item }"
      >
        <div v-if="head.type == 'implode'" :key="head.value">
          <div
            v-for="text in resolve(head.value, item)"
            style="font-size:11px"
            :key="text"
          >
            {{ text }}
          </div>
        </div>

        <div v-if="head.type == 'implode_tag'" :key="head.value">
          <div
            v-for="text in resolve(head.value, item)"
            style="font-size:11px"
            :key="text"
          >
            <v-chip small class="mb-1">{{ text }}</v-chip>
          </div>
        </div>

        <div v-if="head.type == 'progress'" :key="head.value">
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

        <div v-if="head.type == 'flags'" :key="head.value">
          <v-icon v-if="item.isVariant">mdi-link-variant-plus</v-icon>
          <v-icon v-if="item.isCve" color="red">mdi-security</v-icon>
        </div>

        <div v-if="head.type == 'workload'" :key="head.value">
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

        <div v-if="head.type == 'chart'" :key="head.value">
          <div
            class="ma-1"
            v-if="
              head.value ==
                'statistics.licenses.license_audit_findings.all_licenses'
            "
          >
            <div
              class="ma-1 text-center"
              style="font-weight:bold;min-height:21px"
            >
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
            <div
              class="ma-1 text-center"
              style="font-weight:bold;min-height:21px"
            >
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

        <div
          v-if="head.type == 'match' && item.debian_matching"
          :key="head.value"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon
                v-on="on"
                large
                :color="match(item.match)"
                v-if="match(item.match) == 'red'"
                >mdi-network-strength-1</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item.match)"
                v-if="match(item.match) == 'orange'"
                >mdi-network-strength-2</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item.match)"
                v-if="match(item.match) == 'yellow'"
                >mdi-network-strength-3</v-icon
              >
              <v-icon
                v-on="on"
                large
                :color="match(item.match)"
                v-if="match(item.match) == 'green'"
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
          :key="head.value"
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
      rules: {
        isnumber: value => !isNaN(value) || "numbers only"
      },
      singleExpand: false
    };
  },
  methods: {
    getBinaries(item) {
      // input file array inconsistencies
      if (item.length > 0 && typeof item[0].name == "undefined") {
        return item[0];
      } else return item;
    },
    toggle(header, item) {
      this.$emit("filter-clicked", {
        col: header.value,
        val: item,
        active: header.activeVals,
        item: item
      });
    },
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
    emitFiltered(e) {
      this.$emit("filtered-items", e);
    },

    normalize(x, faktor = 1) {
      if (isNaN(x)) x = 0;
      let norm =
        ((x - this.stats.min) / (this.stats.max - this.stats.min)) * faktor;
      return norm + 0.1 * faktor;
    },
    match: function(match) {
      if (match >= 95) return "green";
      if (match >= 60) return "yellow";
      if (match >= 10) return "orange";

      return "red";
    },
    columnFiltered: function(items) {
      return items.reduce((acc, cur) => acc || cur, false);
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
