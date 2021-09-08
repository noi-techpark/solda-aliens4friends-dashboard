<template>
  <div style="width:100%">
    <v-app-bar app>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, #FFFFFF, #F5F5F5"></v-img>
      </template>

      <v-toolbar-title class="ml-3">
        <v-img
          v-if="entries.length > 0"
          max-width="18"
          style="display:inline-block;position:relative;top:4px"
          class="mr-4 ml-2"
          src="img/alien.png"
        ></v-img>
        <span> Aliens4Friends Dashboard</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        elevation="0"
        width="250"
        class="mr-4"
        :class="{ filtered: isFiltered }"
      >
        {{ current.length }}/{{ entries.length }} packages
      </v-btn>

      <search-component
        :class="{ filtered: isFiltered }"
        @search="triggerSearch"
        :needle="needle"
        :tooltip="tooltips.stats.elements.searchbar"
      ></search-component>

      <v-spacer v-show="entries.length == 0"></v-spacer>
      <upload-component
        v-show="entries.length == 0"
        class="mr-3"
        @data-complete="filter(needle)"
      ></upload-component>
    </v-app-bar>

    <v-container fluid fill-height v-if="entries.length == 0">
      <v-row align="center" justify="center">
        <v-col cols="6" style="width:100%" full-width>
          <v-card tile>
            <v-card-title class="mb-4"
              >Welcome to the Aliens4Friends Dashboard
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-img
                    width="80"
                    src="img/alien.png"
                    style="display:inline-block; float:left;filter: drop-shadow(2px 0px 2px green) blur(4px);"
                    class="mr-6"
                  ></v-img>

                  To start,
                  <b
                    >please drag an evaluation file to the upper right
                    corner.</b
                  >

                  <br />
                  <br />
                  Alternatively,
                  <b
                    >you can specify a link via the ?json= parameter to load
                    your evaluation file directly via url</b
                  >. <br />
                  Each time you apply a filter setting, the url is updated and
                  you receive a deep link with which the current filter
                  configuration can be restored.
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- stats -->
    <v-container fluid v-if="entries.length > 0">
      <v-row align="stretch">
        <v-col cols="6" :class="{ filtered: isFiltered }">
          <chart-component
            v-if="entries.length > 0 && current.length > 0"
            :tooltip="stats.counts.total.tooltip"
            :series="total_charts.series"
            :options="total_charts.chartOptions"
            title="FOSSology audit progress"
            subtitle="Total audit files"
            height="110px"
            type="bar"
          ></chart-component>
        </v-col>
        <v-col cols="6" :class="{ filtered: isFiltered }">
          <chart-component
            v-if="entries.length > 0 && current.length > 0"
            :tooltip="stats.counts.known_provenance.tooltip"
            :series="provenance_charts.series"
            :options="provenance_charts.chartOptions"
            title="Provenance"
            :subtitle="
              'Upstream source total: ' +
                stats.counts.upstream_source_total.value
            "
            height="110px"
            type="bar"
          ></chart-component>
        </v-col>

        <v-col cols="4" :class="{ filtered: isFiltered }">
          <chart-component
            v-if="entries.length > 0 && current.length > 0"
            :tooltip="stats.charts.scan.tooltip"
            :tableview="true"
            :series="getCharts(stats.charts.scan.value).series[0].data"
            :options="getCharts(stats.charts.scan.value).chartOptions"
            :tabledata="getCharts(stats.charts.scan.value).raw"
            :title="stats.charts.scan.title"
            :subtitle="stats.charts.scan.subtitle"
            height="300px"
            type="pie"
          ></chart-component>
        </v-col>
        <v-col cols="4" :class="{ filtered: isFiltered }">
          <chart-component
            v-if="entries.length > 0 && current.length > 0"
            :tooltip="stats.charts.main_licenses.tooltip"
            :tableview="true"
            :series="getCharts(stats.charts.main_licenses.value).series[0].data"
            :options="getCharts(stats.charts.main_licenses.value).chartOptions"
            :tabledata="getCharts(stats.charts.main_licenses.value).raw"
            :title="stats.charts.main_licenses.title"
            :subtitle="stats.charts.main_licenses.subtitle"
            height="300px"
            type="pie"
          ></chart-component>
        </v-col>
        <v-col cols="4" :class="{ filtered: isFiltered }">
          <chart-component
            v-if="entries.length > 0 && current.length > 0"
            :tooltip="stats.charts.audit_all.tooltip"
            :tableview="true"
            :series="getCharts(stats.charts.audit_all.value).series[0].data"
            :options="getCharts(stats.charts.audit_all.value).chartOptions"
            :tabledata="getCharts(stats.charts.audit_all.value).raw"
            :title="stats.charts.audit_all.title"
            :subtitle="stats.charts.audit_all.subtitle"
            height="300px"
            type="pie"
          ></chart-component>
        </v-col>
        <v-col>
          <v-row fill-height>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.main_licenses.title"
                :subtitle="stats.counts.main_licenses.subtitle"
                :tooltip="stats.counts.main_licenses.tooltip"
                :value="stats.counts.main_licenses.value.length"
                :items="stats.counts.main_licenses.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.total.title"
                :subtitle="stats.counts.total.subtitle"
                :tooltip="stats.counts.total.tooltip"
                :value="stats.counts.total.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.flavours.title"
                :subtitle="stats.counts.flavours.subtitle"
                :tooltip="stats.counts.flavours.tooltip"
                :value="stats.counts.flavours.value.length"
                :items="stats.counts.flavours.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.images.title"
                :subtitle="stats.counts.images.subtitle"
                :tooltip="stats.counts.images.tooltip"
                :value="stats.counts.images.value.length"
                :items="stats.counts.images.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.machines.title"
                :subtitle="stats.counts.machines.subtitle"
                :tooltip="stats.counts.machines.tooltip"
                :value="stats.counts.machines.value.length"
                :items="stats.counts.machines.value"
              ></stats-component>
            </v-col>
            <v-col :class="{ filtered: isFiltered }">
              <stats-component
                @searchFor="triggerSearch"
                :level="0"
                :title="stats.counts.buildtags.title"
                :subtitle="stats.counts.buildtags.subtitle"
                :tooltip="stats.counts.buildtags.tooltip"
                :value="stats.counts.buildtags.value.length"
                :items="stats.counts.buildtags.value"
              ></stats-component>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- datatables -->
    <v-container fluid v-if="entries.length > 0">
      <v-row no-gutters class="text-right">
        <v-col cols="12">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                style="display:inline-block"
                class="mr-4"
                v-bind="attrs"
                v-on="on"
              >
                <v-switch
                  v-model="showVariantCve"
                  label="1. Level variant CVE"
                  color="red"
                  class="ma-0"
                  value="exclusive"
                  hide-details
                  @click="filterChange = true"
                ></v-switch>
              </div>
            </template>
            <span>{{ tooltips.stats.elements.show_variant_cve }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                style="display:inline-block"
                class="mr-4"
                v-bind="attrs"
                v-on="on"
              >
                <v-switch
                  v-model="filterMode"
                  label="Exclusive selection"
                  color="red"
                  class="ma-0"
                  value="exclusive"
                  hide-details
                  @click="filterChange = true"
                ></v-switch>
              </div>
            </template>
            <span>{{ tooltips.stats.elements.exclusive_mode }}</span>
          </v-tooltip>
          <v-tooltip color="green" top v-model="filterChange">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="!filterChange"
                @click="filter(needle)"
                :class="{ highlight: filterChange }"
              >
                Apply
                <v-icon right dark>
                  mdi-filter
                </v-icon>
              </v-btn>
            </template>
            <span>{{ tooltips.stats.elements.apply_button }}</span>
          </v-tooltip>
          <v-btn outlined @click="clearFilter">
            Reset
            <v-icon right dark>
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col :class="{ filtered: isFiltered }">
          <table-component
            :entries="current"
            :headers="headers"
            :stats="total_stats"
            :palette="palette"
            :colors="colors"
            :showMainCve="showVariantCve"
            @filter-clicked="triggerSearch"
            @filter-change="filterChange = true"
            ident="Meta"
          ></table-component>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col class="text-right" style="font-size:11px">
          powered by
          <b
            ><a
              style="color:rgb(213,61,14)"
              href="https://www.linkedin.com/in/martinrabanser"
              target="_blank"
              >rmb Martin Rabanser</a
            ></b
          >
          &amp;
          <b
            ><a
              style="color:rgb(213,61,14)"
              href="mailto:alex@agon-e.com"
              target="_blank"
              >Alex Complojer</a
            ></b
          >
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="timeout" color="red">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            width="230"
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
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
import tooltips from "../presets/tooltips";
import _ from "lodash";

import AlienPackage from "../models/AlienPackage";

export default {
  data() {
    return {
      showVariantCve: false,
      needle: "",
      params: {
        needle: "",
        cols: {},
        filters: {},
        excl: 0
      },
      filterChange: false,
      filtered: false,
      filterMode: "inclusive",
      columnFilter: {},
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
      palette: colors.palette,
      colors: colors.colors,
      tooltips: tooltips.tips
    };
  },
  mounted: function() {
    if (this.$route.query.params) {
      this.params = JSON.parse(this.$route.query.params);

      // preset needle
      this.needle = this.params.needle;

      // preset exclusive mode
      if (this.params.excl == 1) this.filterMode = "exclusive";
    }

    // override table header tooltips
    for (var a = 0; a < this.headers.length; a++) {
      this.headers[a].tooltip = this.tooltips.stats.table.headers[
        this.headers[a].value
      ];
    }
  },
  computed: {
    ...mapGetters({
      json: "file/json"
    }),
    entries: function() {
      console.warn("entry recalc");

      let source = this.json.source_packages || [];
      let res = [];
      let index = 0;

      let variants = {};

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
        source[i] = new AlienPackage(source[i]);



        var variant_key =
          source[i].name + "-" + source[i].version + "-" + source[i].revision;

        if (typeof variants[variant_key] == "undefined")
          variants[variant_key] = [];

        variants[variant_key].push(source[i]);

        res.push(source[i]);
      }

      // remove all variants from result
      res = res.filter(value => {
        return (
          variants[value.name + "-" + value.version + "-" + value.revision]
            .length == 1
        );
      });

      // remove unique packages from variants
      variants = _.filter(variants, val => {
        return val.length > 1;
      });

      // merge variants, generate diffs and add resulting packages to result
      var additional_packages = [];
      additional_packages = this.getVariantDiff(variants);

      res = [...res, ...additional_packages];

      let licenses = [];

      for (let i = 0; i < res.length; i++) {
        if (res[i].statistics) {
          const filestats = res[i].statistics.files;

          // predefine license colors
          if (res[i].statistics.licenses) {

            licenses = licenses.concat(
              res[i].statistics.licenses.license_audit_findings.all_licenses
            );

            licenses = licenses.concat(
              res[i].statistics.licenses.license_scanner_findings
            );

          // patch table index and single progresses
          res[i].uid = i;
          res[i].progress =
            filestats.audit_total == 0
              ? 100
              : parseInt((filestats.audit_done / filestats.audit_total) * 100);

          res[i].workload = filestats.audit_done;
          res[i].workload_total = filestats.audit_total;

          // patch debian match
          res[i].match = res[i].debian_matching
            ? (res[i].debian_matching.ip_matching_files /
                filestats.upstream_source_total) *
              100
            : 0;

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
      }

      for (let a = 0; a < licenses.length; a++) {
        if (!this.palette[index]) index = 0;
        if (!this.colors[licenses[a].shortname]) {
          this.colors[licenses[a].shortname] = this.palette[index];
          index++;
        }
      }

      this.progress =
        all.audit_total == 0
          ? 100
          : parseInt((all.audited / all.audit_total) * 100);
      this.total_stats = all;

      // generate column filter values
      for (var i = 0; i < this.headers.length; i++) {
        if (this.headers[i].autofilter) {
          this.headers[i].filterVals = [];
          this.headers[i].activeVals = {};

          for (var a = 0; a < res.length; a++) {
            let vals = this.resolve(this.headers[i].value, res[a]);

            if (vals) {
              if (this.headers[i].type == "chart") {
                vals = vals.map(o => {
                  return o.shortname;
                });
              }

              this.headers[i].filterVals = [
                ...new Set([...this.headers[i].filterVals, ...vals])
              ];
            }
          }

          this.headers[i].filterVals.sort();

          let active = false;
          for (var a = 0; a < this.headers[i].filterVals.length; a++) {
            this.headers[i].activeVals[this.headers[i].filterVals[a]] =
              this.params.cols[this.headers[i].value] &&
              this.params.cols[this.headers[i].value][
                this.headers[i].filterVals[a]
              ];
            if (this.headers[i].activeVals[this.headers[i].filterVals[a]])
              active = true;
          }

          if (active)
            this.triggerSearch({
              col: this.headers[i].value,
              active: this.headers[i].activeVals
            });
        }

        if (
          this.headers[i].valueFilter &&
          this.params.filters[this.headers[i].value]
        ) {
          this.headers[i].valueFilter = this.params.filters[
            this.headers[i].value
          ];
        }
      }

      /*
       // test aggregate flag. aggregates must be 0 if active
       res = res.filter(value => {
         return value.statistics && !value.statistics.aggregate;
       });
      */

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
      return this.filtered;
    },
    provenance_charts: function() {
      return this.getCharts(
        [
          this.stats.counts.known_provenance.value,
          this.stats.counts.unknown_provenance.value
        ],
        [
          this.stats.counts.known_provenance.subtitle,
          this.stats.counts.unknown_provenance.subtitle
        ],
        false,
        true,
        false
      );
    },
    total_charts: function() {
      return this.getCharts(
        [
          this.stats.counts.audit_done.value,
          this.stats.counts.audit_to_do.value,
          this.auditdiff.value
        ],
        [
          this.stats.counts.audit_done.subtitle,
          this.stats.counts.audit_to_do.subtitle,
          this.auditdiff.subtitle
        ],
        false,
        true,
        false,
        "100%"
      );
    },
    stats: function() {
      let res = {
        counts: {
          known_provenance: {
            title: "Files",
            subtitle: "Known provenance",
            tooltip: this.tooltips.stats.counts.known_provenance,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.known_provenance) ||
                currentValue.statistics.aggregate === false
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
            tooltip: this.tooltips.stats.counts.total,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.total) ||
                currentValue.statistics.aggregate === false
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.total;
            }, 0)
          },
          audit_total: {
            title: "Files",
            subtitle: "Audit total",
            tooltip: this.tooltips.stats.counts.audit_total,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_total) ||
                currentValue.statistics.aggregate === false
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_total;
            }, 0)
          },
          unknown_provenance: {
            title: "Files",
            subtitle: "Unknown provenance",
            tooltip: this.tooltips.stats.counts.unknown_provenance,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.unknown_provenance) ||
                currentValue.statistics.aggregate === false
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
            tooltip: this.tooltips.stats.counts.audit_done,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_done) ||
                currentValue.statistics.aggregate === false
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_done;
            }, 0)
          },
          audit_to_do: {
            title: "Files",
            subtitle: "Audit todo",
            tooltip: this.tooltips.stats.counts.audit_to_do,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.audit_to_do) ||
                currentValue.statistics.aggregate === false
              )
                return accumulator;
              return accumulator + currentValue.statistics.files.audit_to_do;
            }, 0)
          },
          upstream_source_total: {
            title: "Files/Packages",
            subtitle: "upstream_source_total",
            tooltip: this.tooltips.stats.counts.upstream_source_total,
            value: this.current.reduce((accumulator, currentValue) => {
              if (
                !currentValue.statistics ||
                isNaN(currentValue.statistics.files.upstream_source_total) ||
                currentValue.statistics.aggregate === false
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
            tooltip: this.tooltips.stats.counts.flavours,
            value: this.accumulatedTags("distro")
          },
          images: {
            title: "Images",
            subtitle: "accumulated",
            tooltip: this.tooltips.stats.counts.images,
            value: this.accumulatedTags("image")
          },
          main_licenses: {
            title: "Main Licenses",
            subtitle: "accumulated",
            tooltip: this.tooltips.stats.counts.main_licenses,
            value: this.accumulatedMainLicenses()
          },
          machines: {
            title: "Machines",
            subtitle: "accumulated",
            tooltip: this.tooltips.stats.counts.machines,
            value: this.accumulatedTags("machine")
          },
          buildtags: {
            title: "Releases",
            subtitle: "accumulated",
            tooltip: this.tooltips.stats.counts.buildtags,
            value: this.accumulatedTags("release")
          }
        },
        charts: {
          scan: {
            title: "License types scanned",
            tooltip: this.tooltips.stats.charts.scan,
            subtitle:
              "Results from automated scanners such as scancode, monk, nomos, ojo",
            value: this.accumulatedLicenses("license_scanner_findings")
          },
          audit_all: {
            title: "License types audited",
            tooltip: this.tooltips.stats.charts.audit_all,
            subtitle: "Results by human auditor analysis",
            value: this.accumulatedLicenses(
              "license_audit_findings.all_licenses"
            )
          },
          main_licenses: {
            title: "Main license types",
            tooltip: this.tooltips.stats.charts.main_licenses,
            subtitle: "Accumulated main licenses",
            value: this.accumulatedLicenses(
              "license_audit_findings.main_licenses",
              true
            )
          }
        }
      };

      return res;
    }
  },
  methods: {
    getVariantDiff(variants) {
      var new_packages = [];

      // for all variant candidates...
      for (var a = 0; a < variants.length; a++) {
        var skip = false;

        var all_sources = {};
        var all_source_files = [];
        var all_binaries = [];
        var common_sources = [];

        var merged_package = new AlienPackage({
          name: variants[a][0].name,
          version: variants[a][0].version,
          revision: variants[a][0].revision,
          variant: true
        });

        merged_package.id =
          variants[a][0].name +
          "-" +
          variants[a][0].version +
          "-" +
          variants[a][0].revision;

        // obsolete, remove if no dependency left
        merged_package.isVariant = true;

        merged_package.hasVariants = true;

        merged_package.variant_files = {};

        merged_package.debian_matching.ip_matching_files = 0;

        // ...check all variants
        for (var b = 0; b < variants[a].length; b++) {
          var cur = variants[a][b];

          // if linux-kernel, do nothing, push all variants back to result
          if (cur.name.indexOf("linux-kernel") != -1) {
            console.warn("ignoring package: name contains 'linux-kernel'");
            new_packages.push(cur);
            skip = true;
            continue;
          }

          merged_package.id += " " + cur.variant;

          // merge & unique tags
          merged_package.tags.project = [
            ...merged_package.tags.project,
            ...cur.tags.project
          ];
          merged_package.tags.distro = [
            ...merged_package.tags.distro,
            ...cur.tags.distro
          ];
          merged_package.tags.machine = [
            ...merged_package.tags.machine,
            ...cur.tags.machine
          ];
          merged_package.tags.image = [
            ...merged_package.tags.image,
            ...cur.tags.image
          ];
          merged_package.tags.release = [
            ...merged_package.tags.release,
            ...cur.tags.release
          ];

          merged_package.debian_matching = {
            name: cur.debian_matching.name,
            version: cur.debian_matching.version,
            ip_matching_files: Math.max(
              merged_package.debian_matching.ip_matching_files,
              cur.debian_matching.ip_matching_files
            )
          };

          if (cur.statistics.aggregate) {
            merged_package.statistics = {
              aggregate: true,
              files: {
                audit_done:
                  merged_package.statistics.files.audit_done +
                  cur.statistics.files.audit_done,
                audit_to_do:
                  merged_package.statistics.files.audit_to_do +
                  cur.statistics.files.audit_to_do,
                audit_total:
                  merged_package.statistics.files.audit_total +
                  cur.statistics.files.audit_total,
                known_provenance:
                  merged_package.statistics.files.known_provenance +
                  cur.statistics.files.known_provenance,
                total:
                  merged_package.statistics.files.total +
                  cur.statistics.files.total,
                unknown_provenance:
                  merged_package.statistics.files.unknown_provenance +
                  cur.statistics.files.unknown_provenance,
                upstream_source_total:
                  merged_package.statistics.files.upstream_source_total +
                  cur.statistics.files.upstream_source_total
              },
              licenses: {
                license_audit_findings: {
                  all_licenses: [
                    ...merged_package.statistics.licenses.license_audit_findings
                      .all_licenses,
                    ...cur.statistics.licenses.license_audit_findings
                      .all_licenses
                  ],
                  main_licenses: [
                    ...merged_package.statistics.licenses.license_audit_findings
                      .main_licenses,
                    ...cur.statistics.licenses.license_audit_findings
                      .main_licenses
                  ]
                },
                license_scanner_findings: [
                  ...merged_package.statistics.licenses
                    .license_scanner_findings,
                  ...cur.statistics.licenses.license_scanner_findings
                ]
              }
            };
          }

          merged_package.variant_files[cur.variant] = cur;

          merged_package.my_source_files = cur.source_files;

          merged_package.my_source_files = cur.source_files;

          // check sourcefiles
          for (var i = 0; i < cur.source_files.length; i++) {
            if (
              typeof all_sources[cur.source_files[i].sha1_cksum] == "undefined"
            )
              all_sources[cur.source_files[i].sha1_cksum] = 1;
            else all_sources[cur.source_files[i].sha1_cksum]++;

            // all variants have the file
            if (
              all_sources[cur.source_files[i].sha1_cksum] == variants[a].length
            ) {
              common_sources.push(cur.source_files[i]);
            }

            if (all_sources[cur.source_files[i].sha1_cksum] == 1) {
              cur.source_files[i].variant = "";
              all_source_files.push(cur.source_files[i]);
            }
            all_binaries = [...all_binaries, ...cur.binary_packages];
          }
        }

        merged_package.source_files = common_sources;

        merged_package.meta_source_files = all_source_files;
        merged_package.binary_packages = all_binaries;

        merged_package.tags.project = _.uniq(merged_package.tags.project);
        merged_package.tags.distro = _.uniq(merged_package.tags.distro);
        merged_package.tags.machine = _.uniq(merged_package.tags.machine);
        merged_package.tags.image = _.uniq(merged_package.tags.image);
        merged_package.tags.release = _.uniq(merged_package.tags.release);
        var common_file_index = merged_package.source_files.map(val => {
          return val.sha1_cksum;
        });

        // source file diffs
        for (const [key, value] of Object.entries(
          merged_package.variant_files
        )) {
          var vcur = merged_package.variant_files[key];
          vcur.source_files = vcur.source_files.filter(val => {
            return common_file_index.indexOf(val.sha1_cksum) == -1;
          });

        }

        merged_package.setVariantTags();

        if (!skip) new_packages.push(merged_package);
      }

      return new_packages;
    },
    resolve(path, obj = self, separator = ".") {
      var properties = Array.isArray(path) ? path : path.split(separator);
      return properties.reduce((prev, curr) => prev && prev[curr], obj);
    },
    triggerSearch(e) {
      let needle = e;

      // if column filter, register filter but do not trigger automagically

      if (needle.col) {
        let active = false;

        this.filterChange = true;

        if (!this.params.cols[needle.col]) this.params.cols[needle.col] = {};

        this.columnFilter[needle.col] = {
          state: needle.active,
          needle: "",
          key: needle.col,
          antiNeedle: ""
        };

        Object.keys(this.columnFilter).forEach((key, index) => {
          Object.keys(this.columnFilter[key].state).forEach(
            (innerKey, innerIndex) => {
              if (this.columnFilter[key].state[innerKey]) {
                this.columnFilter[key].needle += innerKey + "|||";
                this.params.cols[needle.col][innerKey] = 1;
                active = true;
              } else {
                this.columnFilter[key].antiNeedle += innerKey + "|||";
                if (this.params.cols[needle.col][innerKey])
                  delete this.params.cols[needle.col][innerKey];
              }
            }
          );
        });

        if (!active) delete this.columnFilter[needle.col];

        return false;
      }

      this.filter(e);
    },
    setParamUrl() {
      let url = new URL(window.location.href);
      url.searchParams.delete("params");
      url.searchParams.set("params", JSON.stringify(this.params));
      window.history.pushState(
        { path: JSON.stringify(this.params) },
        "",
        url.href
      );
    },
    clearFilter() {
      this.columnFilter = [];

      for (var i = 0; i < this.headers.length; i++) {
        if (this.headers[i].activeVals) {
          Object.keys(this.headers[i].activeVals).forEach((key, index) => {
            this.headers[i].activeVals[key] = false;
          });
        }

        if (this.headers[i].valueFilter) {
          this.headers[i].valueFilter.value = "";
          this.headers[i].valueFilter.operator = ">";
        }
      }

      this.params = {
        needle: "",
        cols: {},
        filters: {},
        excl: 0
      };

      this.filterMode = "inclusive";

      this.filter("");
    },
    filter(needle) {
      this.needle = needle;

      this.params.needle = needle;

      let res = [];

      let splitted = needle.split(" ");

      for (var a = 0; a < this.entries.length; a++) {
        let found = true;
        let cols_found = true;

        // table column filter
        // TODO: Remove toggle/triggerSearch and read directly from table headers
        Object.keys(this.columnFilter).forEach((key, index) => {
          let col = this.resolve(key, this.entries[a]);

          if (!!col) {
            let colString = JSON.stringify(col).toLowerCase() || "";
            let colNeedle = this.columnFilter[key].needle.split("|||");
            let colAntiNeedle = this.columnFilter[key].antiNeedle.split("|||");

            // check if we find the needles
            for (var i = 0; i < colNeedle.length - 1; i++) {
              let here =
                colString.indexOf('"' + colNeedle[i].toLowerCase() + '"') != -1;
              // if (this.filterMode == "exclusive") here = !here;
              cols_found = here && cols_found;
            }

            // if exclusive mode, other values should not be present
            if (this.filterMode == "exclusive") {
              this.params.excl = 1;
              for (var i = 0; i < colAntiNeedle.length - 1; i++) {
                let here =
                  colString.indexOf(
                    '"' + colAntiNeedle[i].toLowerCase() + '"'
                  ) != -1;
                cols_found = !here && cols_found;
              }
            }
          } else {
            cols_found = false;
          }
        });

        // global text search
        if (this.needle != "") {
          let str = JSON.stringify(this.entries[a]).toLowerCase() || "";

          for (var i = 0; i < splitted.length; i++) {
            found = str.indexOf(splitted[i].toLowerCase()) != -1 && found;
          }
        }

        if (found && cols_found) {
          res.push(this.entries[a]);
        }
      }

      // check table headers for valueFilters
      for (var i = 0; i < this.headers.length; i++) {
        if (
          this.headers[i].valueFilter &&
          !isNaN(this.headers[i].valueFilter.value)
        ) {
          const filter = this.headers[i].valueFilter;

          if (filter.value != "") {
            switch (filter.operator) {
              case "=":
                res = res.filter(
                  val => Math.ceil(val[this.headers[i].value]) == filter.value
                );
                break;
              case "!":
                res = res.filter(
                  val => val[this.headers[i].value] != filter.value
                );
                break;
              case "<":
                res = res.filter(
                  val => val[this.headers[i].value] < filter.value
                );
                break;
              case ">":
                res = res.filter(
                  val => val[this.headers[i].value] > filter.value
                );
                break;
            }

            this.params.filters[this.headers[i].value] = filter;
          } else {
            delete this.params.filters[this.headers[i].value];
          }
        }
      }

      this.current = res;

      this.filterChange = false;
      this.filtered = this.current.length != this.entries.length;
      this.setParamUrl();
    },
    accumulatedMainLicenses: function() {
      let res = {};
      for (let i = 0; i < this.current.length; i++) {
        let license_names = [];

        if (
          this.current[i].statistics &&
          this.current[i].statistics.licenses &&
          this.current[i].statistics.aggregate !== false
        ) {
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
        if (this.current[i].statistics.aggregate === false) continue;

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
          if (this.current[i].statistics.aggregate !== false)
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
    // TODO: Move to Chart-Component
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

      var raw_labels = labels;
      var raw_data = data;

      // grouping
      if (grouping) {
        const odata = data;

        labels = labels.slice(0, grouping);
        data = odata.slice(0, grouping);

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
        series: series,
        raw: {
          labels: raw_labels,
          data: raw_data
        }
      };

      return res;
    }
  }
};
</script>
