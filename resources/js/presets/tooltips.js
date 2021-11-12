exports.tips = {
  stats: {
    counts: {
      known_provenance: "upstream csource files with a known provenance",
      total: "total source files",
      audit_total: "total files to be audited",
      unknown_provenance: "upstream source files with no kwnown provenance (bad)",
      audit_done: "total audited files",
      audit_to_do: "total files still to be audited",
      upstream_source_total: "total upstream source files",
      flavours: "filtered, distro tags",
      images: "filtered, image tags",
      main_licenses: "filtered, package main licenses",
      machines: "filtered, target machine tags",
      buildtags: "filtered, release tags",
    },
    charts: {
      scan: "accumulated license scanner findings (may not coincide with the number of source files because of multiple findings on the same file)",
      audit_all: "accumulated license audit findings (may not coincide with the number of source files because of multiple findings on the same file)",
      main_licenses: "accumulated package main licenses (audit findings/decisions)",
    },
    table: {
      headers: {
        id: "package id",
        progress: "audit_done / audit_total * 100",
        workload_total: "audit total",
        "statistics.licenses.license_audit_findings.main_licenses": "license audit findings (may not coincide with the number of source files because of multiple findings on the same file)",
        "tags.distro": "distro tags",
        "tags.image": "image tags",
        "tags.machine": "machine tags",
        "tags.release": "release tags",
        "statistics.licenses.license_scanner_findings": "license scanner findings (may not coincide with the number of source files because of multiple findings on the same file)",
        "statistics.licenses.license_audit_findings.all_licenses": "all licenses (may not coincide with the number of source files because of multiple findings on the same file)",
        match: "upstream source files that match with files in the matching debian package (may not coincide with the number of source files because not all source files come from upstream, some may be local files)",
      },
    },
    elements: {
      searchbar: "global match: all space-separated substrings must be present",
      apply_button: "apply new filter settings",
      exclusive_mode: "match if only selected items are present",
      show_variant_cve: "reflect cve warnings on main package level",
    },
  },
};
