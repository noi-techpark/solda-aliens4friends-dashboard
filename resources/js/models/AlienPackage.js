export default class AlienPackage {
  id = null;
  name = null;
  version = null;
  revision = null;
  variant = null;

  tags = {
    project: [],
    release: [],
    distro: [],
    machine: [],
    image: [],
  };

  debian_matching = {
    name: "",
    version: "",
    ip_matching_files: 0,
  };

  statistics = {
    files: {
      audit_total: 0,
      audit_done: 0,
      audit_to_do: 0,
      upstream_source_total: 0,
      unknown_provenance: 0,
      known_provenance: 0,
      total: 0,
    },
    licenses: {
      license_scanner_findings: [],
      license_audit_findings: {
        main_licenses: [],
        all_licenses: [],
      },
    },
    aggregate: false,
  };

  source_files = [];

  source_file = {
    name: "",
    sha1_cksum: "",
    git_sha1: null,
    src_uri: "",
    files_in_archive: 0,
    paths: [],
  };

  binary_packages = [];

  binary_package = {
    name: "",
    version: "",
    revision: "",
    tags: {
      project: [],
      release: [],
      distro: [],
      machine: [],
      image: [],
    },
    metadata: {
      name: "",
      base_name: "",
      version: "",
      revision: "",
      package_arch: "",
      recipe_name: "",
      recipe_version: "",
      recipe_revision: "",
      license: "",
      summary: "",
      description: "",
      depends: [],
      provides: [],
    },
  };

  constructor(data = {}) {
    if (data.id) this.id = data.id;
    if (data.tags) this.tags = data.tags;
    if (data.name) this.name = data.name;
    if (data.version) this.version = data.version;
    if (data.revision) this.revision = data.revision;
    if (data.variant) this.variant = data.variant;
    if (data.debian_matching) this.debian_matching = data.debian_matching;
    if (data.statistics) this.statistics = data.statistics;
    if (data.source_files) this.source_files = data.source_files;
    if (data.binary_packages) this.binary_packages = data.binary_packages;

    if (Math.random() > 0.8) this.isCve = true;
  }

}
