exports.headers = [
    {
        text: "ID",
        align: "start",
        value: "id",
        type: "string",
        fixed: true,
        width: "220px",
        tooltip: "Package name"
    },

    {
        text: "Audit Progress",
        align: "start",
        type: "progress",
        value: "progress",
        fixed: true,
        tooltip: "audit_done / audit_total"
    },
    {
        text: "Audit Workload",
        align: "center",
        type: "workload",
        value: "workload_total",
        fixed: true,
        tooltip: "audit_total"
    },
    {
        text: "Main licenses",
        value: "statistics.licenses.license_audit_findings.main_licenses",
        type: "implode_tag",
        fixed: true,
        tooltip: "Main licenses"
    },
    {
        text: "Distro",
        value: "tags.distro",
        type: "implode",
        fixed: true,
        tooltip: "Distro"
    },

    {
        text: "Image",
        value: "tags.image",
        type: "implode",
        fixed: true,
        tooltip: "Image"
    },

    {
        text: "Machine",
        value: "tags.machine",
        type: "implode",
        fixed: true,
        tooltip: "Machine"
    },
    {
        text: "Release",
        value: "tags.release",
        type: "implode",
        fixed: true,
        tooltip: "Release"
    },
    {
        text: "Scan",
        value: "statistics.licenses.license_scanner_findings",
        align: "start",
        type: "chart",
        width: "200px",
        fixed: true,
        tooltip: "license_scanner_findings"
    },
    {
        text: "Audit All",
        value: "statistics.licenses.license_audit_findings.all_licenses",
        align: "start",
        type: "chart",
        width: "200px",
        fixed: true,
        tooltip: "all_licenses"
    },

    {
        text: "Debian Match",
        value: "debian_matching",
        align: "end",
        type: "match",
        width: "100px",
        fixed: true,
        tooltip: "ip_matching_files / upstream_source_total"
    }
];
