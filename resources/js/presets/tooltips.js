exports.tips = {
  stats: {
    counts: {
      known_provenance: "current statistics.files.known_provenance sum",
      total: "current statistics.files.total sum",
      audit_total: "current statistics.files.audit_total sum",
      unknown_provenance: "current statistics.files.unknown_provenance sum",
      audit_done: "current statistics.files.audit_done sum",
      audit_to_do: "current statistics.files.audit_to_do sum",
      upstream_source_total: "current statistics.files.upstream_source_total sum",
      flavours: "filtered, unique tags.distro + sum",
      images: "filtered, unique tags.image + sum",
      main_licenses: "filtered, unique statistics.licenses.license_audit_findings.main_licenses + sum",
      machines: "filtered, unique tags.machine + sum",
      buildtags: "filtered, unique tags.release + sum",
    },
    charts: {
      scan: "accumulated license_scanner_findings",
      audit_all: "accumulated license_audit_findings.all_licenses",
      main_licenses: "accumulated license_audit_findings.main_licenses",
    },
    table: {
      headers: {
        id: "package id",
        progress: "audit_done / audit_total * 100",
        workload_total: "audit_total",
        "statistics.licenses.license_audit_findings.main_licenses": "license_audit_findings.main_licenses",
        "tags.distro": "tags.distro",
        "tags.image": "tags.image",
        "tags.machine": "tags.machine",
        "tags.release": "tags.release",
        "statistics.licenses.license_scanner_findings": "license_scanner_findings",
        "statistics.licenses.license_audit_findings.all_licenses": "all_licenses",
        match: "debian_matching.ip_matching_files / statistics.files.upstream_source_total",
      },
    },
    elements: {
      searchbar: "global match: all space-separated substrings must be present",
      apply_button: "apply new settings",
      exclusive_mode: "match if only selected items are present",
      show_variant_cve: "reflect cve warnings on main package level",
    },
  },
};
