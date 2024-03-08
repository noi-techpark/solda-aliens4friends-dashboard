<template>
<div>
            <v-tabs v-model="tab" class="rounded">
              <v-tab>CVE Status</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="rounded">
              <v-tab-item>
                <v-virtual-scroll
                  :items="item.cve_metadata.issue"
                  :item-height="30"
                  height="200"
                  style="font-size: 80%"
                >
                  <template v-slot:default="{ item }">
                    <v-list-item >
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip small>{{ item.scorev2 }} / {{ item.scorev3 }}</v-chip>
                          <v-chip small>{{ item.vector }}</v-chip>
                          <v-chip small :class="item.status">{{ item.status }}</v-chip>

                          <v-tooltip top left max-width="400px">
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on">mdi-information</v-icon>
                            </template>
                            <div>{{ item.summary }}</div>
                            <b class="mt-4" style="display: block">Used scan aliases:</b>
                            <ul>
                              <li v-for="alias in $props.item.cve_metadata.products">
                                {{ alias.product }}, CVE's in record: {{ alias.cvesInRecord }}
                              </li>
                            </ul>
                          </v-tooltip>
                        </v-list-item-title>

                      </v-list-item-content>
                      <v-list-item-action>
                            <v-btn small elevation="0" :href="item.link"
                            >{{ item.id }}
                            <v-icon small class="ml-2">mdi-open-in-new</v-icon></v-btn
                          >
                        </v-list-item-action>
                    </v-list-item>
                  </template>
                </v-virtual-scroll>
              </v-tab-item>
            </v-tabs-items>
        </div>
</template>
    
  <script>
  export default {
    name: "CveStatus",
    props: {
      item: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data: () => {
      return {
        tab: null
      }
    }
  }
  </script>

  <style scoped lang="scss">

.theme--light.v-chip:not(.v-chip--active) {
    &.Patched {
        background:#4caf50;
    }

    &.Unpatched {
        background:#f44336;
        order:-1;
    }

    &.Ignored {
        background:orange;
    }
}


</style>
    