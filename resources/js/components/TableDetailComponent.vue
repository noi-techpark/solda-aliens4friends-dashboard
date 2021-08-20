<template>
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
</template>

<script>

export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {
    getBinaries(item) {
      // input file array inconsistencies
      if (item.length > 0 && typeof item[0].name == "undefined") {
        return item[0];
      } else return item;
    }
  }
};
</script>
