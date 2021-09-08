<template>
  <div>
    <v-card flat tile v-if="item.isVariant" color="transparent">
      <v-expansion-panels accordion multiple flat color="transparent">
        <v-expansion-panel
          v-for="(variant, vkey) in item.variant_files"
          :key="vkey"
          color="transparent"
        >
          <v-expansion-panel-header>
            <div class="ml-2">
              <v-icon v-if="item.isCve" color="red">mdi-security</v-icon>
              <b>Variant: {{ vkey }}</b> | {{ variant.name }} |
              {{ variant.version }} | {{ variant.revision }} |
              <v-chip
                small
                color="primary"
                :key="tag"
                v-for="tag in item.variant_files[vkey].tags.release"
                >{{ tag }}</v-chip
              ><v-chip
                :key="tag"
                small
                color="secondary"
                class="ml-1"
                v-for="tag in item.variant_files[vkey].tags.image"
                >{{ tag }}</v-chip
              >
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <!-- TODO: source_files = common_files for variants -->
              <v-col cols="3" v-if="item.source_files">
                <v-tabs v-model="item.sourcetab" class="rounded">
                  <v-tab>
                    Common Sources
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="item.sourcetab" class="rounded">
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
                              {{ item.name }}
                              <v-chip small v-if="item.files_in_archive"
                                >{{ item.files_in_archive }} Files</v-chip
                              >
                              <v-chip
                                small
                                color="primary"
                                v-if="getSourceFileRelease(item) != ''"
                                >{{ getSourceFileRelease(item) }}</v-chip
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
                              <v-chip color="green" small v-if="item.audited"
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
              <v-col cols="3" v-if="item.meta_source_files && item.isVariant">
                <v-tabs v-model="item.sourcetab" class="rounded">
                  <v-tab>
                    Variant specific
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="item.sourcetab" class="rounded">
                  <v-tab-item>
                    <v-virtual-scroll
                      :items="item.variant_files[vkey].source_files"
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
                                color="primary"
                                v-if="getSourceFileRelease(item) != ''"
                                >{{ getSourceFileRelease(item) }}</v-chip
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
                              <v-chip color="green" small v-if="item.audited"
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
              <v-col
                cols="3"
                v-if="
                  fileSpecificMachines.length > 0 &&
                    fileSpecificMachines[0] != 'all' &&
                    item.isVariant
                "
              >
                <v-tabs v-model="item.varianttab" class="rounded">
                  <v-tabs-slider color="green"></v-tabs-slider>
                  <v-tab
                    v-for="(machine, name) in fileSpecificMachines"
                    v-if="
                      !machineTabNotEmpty(machine, vkey) && machine != 'all'
                    "
                    :key="name"
                  >
                    {{ machine }} specific
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="item.varianttab" class="rounded">
                  <v-tab-item
                    v-for="(variant, name) in fileSpecificMachines"
                    :key="name"
                  >
                    <v-virtual-scroll
                      :items="item.variant_files[vkey].source_files"
                      :item-height="30"
                      height="200"
                    >
                      <template v-slot:default="{ item }">
                        <v-list-item
                          v-if="fileIsMachineSpecific(item.machines)"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.name }}
                              <v-chip
                                small
                                v-for="machine in item.machines"
                                :key="machine"
                                >{{ machine }}
                              </v-chip>
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
                <v-tabs v-model="item.binarytab" class="rounded">
                  <v-tab>
                    Variant Specific Binaries
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="item.binarytab" class="rounded">
                  <v-tab-item>
                    <v-virtual-scroll
                      :items="getBinaries(variant.binary_packages)"
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <!-- TODO: Same view for Variants & Non-Variants, source file chips should be a component  -->
    <v-card flat tile v-if="!item.isVariant" color="transparent">
      <v-card-title>{{ item.name || "Missing name" }}</v-card-title>
      <v-card-subtitle
        >{{ item.version || "0.0.0" }} |
        {{ item.revision || "-" }}</v-card-subtitle
      >
      <v-card-text>
        <v-row>
          <v-col v-if="item.source_files" class="rounded">
            <v-tabs v-model="item.sourcetab" class="rounded">
              <v-tab>
                Common Source Files
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="item.sourcetab" class="rounded">
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
                          {{ item.name }}
                          <v-chip small v-if="item.files_in_archive"
                            >{{ item.files_in_archive }} Files</v-chip
                          >
                          <v-chip
                            small
                            color="primary"
                            v-if="getSourceFileRelease(item) != ''"
                            >{{ getSourceFileRelease(item) }}</v-chip
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
                            v-if="
                              item.audited ||
                                item.src_uri.indexOf('file://') != -1
                            "
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
          <v-col v-if="item.binary_packages">
            <v-tabs v-model="item.binarytab" class="rounded">
              <v-tab>
                Binary Packages
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="item.binarytab" class="rounded">
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
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    fileSpecificMachines() {
      let machines = [];

      for (let variant in this.item.variant_files) {
        for (
          var a = 0;
          a < this.item.variant_files[variant].source_files.length;
          a++
        ) {
          if (this.item.variant_files[variant].source_files[a].machines)
            machines = [
              ...machines,
              ...this.item.variant_files[variant].source_files[a].machines
            ];
        }
      }

      return machines.length > 0 ? _.uniq(machines) : false;
    }
  },
  data() {
    return {};
  },
  methods: {
    machineTabNotEmpty(machine, vkey) {
      var res = true;

      for (let source in this.item.variant_files[vkey].source_files) {
        var cur = this.item.variant_files[vkey].source_files[source];
        if (cur.machines.indexOf(machine) != -1) res = false;
      }

      return res;
    },
    getBinaries(item) {
      // input file array inconsistencies
      if (item.length > 0 && typeof item[0].name == "undefined") {
        return item[0];
      } else return item;
    },
    getSourceFileRelease(source_file) {
      var release = "";
      for (var a = 0; a < source_file.paths.length; a++) {
        const tags = source_file.paths[a].split("/");
        if (tags.length >= 2) {
          release = tags[2];
        }
      }
      return release;
    },
    fileIsMachineSpecific(machines) {
      // if no machines, it is valid for all machines
      if (!machines) return true;

      let res = false;

      for (var a = 0; a < this.item.variant_machines.length; a++) {
        if (
          machines.indexOf(this.item.variant_machines[a]) != -1 ||
          machines.indexOf("all") != -1
        ) {
          res = true;
        } else {
        }
      }

      return res;
    }
  }
};
</script>
