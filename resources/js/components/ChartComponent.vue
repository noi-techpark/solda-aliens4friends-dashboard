<v-card flat tile v-bind="attrs" v-on="on">
  <v-card-title>FOSSology audit progress</v-card-title>
  <v-card-subtitle>Total audit files </v-card-subtitle>
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
