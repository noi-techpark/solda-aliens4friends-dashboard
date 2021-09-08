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
		image: []
	};

	debian_matching = {
		name: "",
		version: "",
		ip_matching_files: 0
	};

	statistics = {
		files: {
			audit_total: 0,
			audit_done: 0,
			audit_to_do: 0,
			upstream_source_total: 0,
			unknown_provenance: 0,
			known_provenance: 0,
			total: 0
		},
		licenses: {
			license_scanner_findings: [],
			license_audit_findings: {
				main_licenses: [],
				all_licenses: []
			}
		},
		aggregate: false
	};

	source_files = [];

	source_file = {
		name: "",
		sha1_cksum: "",
		git_sha1: null,
		src_uri: "",
		files_in_archive: 0,
		paths: []
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
			image: []
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
			provides: []
		}
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
		// TODO: Yocto => Harvest.json => Dashboard
		if (Math.random() > 0.7) this.isCve = true;
	}

	setVariantTags() {
		if (!this.isVariant) return;

		let variant_machines = {}
		// 	"it is assumed that there is only 1 release and 1 image in paths. thus these two infos are overwritten."
		for (var a = 0; a < this.meta_source_files.length; a++) {
			if (this.meta_source_files[a].paths.length > 0) {
				this.meta_source_files[a].machines = [];
				for (var i = 0; i < this.meta_source_files[a].paths.length; i++) {
					const tags = this.meta_source_files[a].paths[i].split("/");
					if (tags.length >= 4) {
						this.meta_source_files[a].release = tags[2];
						this.meta_source_files[a].image = tags[3];
						// example: libgloss missing machines part
						if (tags.length > 4) {
							variant_machines[tags[4]] = tags[4];
							this.meta_source_files[a].machines.push(tags[4]);
						} else {
							this.meta_source_files[a].machines.push("all");
						}
					} else {
						console.error(
							"paths length breaking conventions, setVariantTags not possible"
						);
					}
				}
			} else {
				this.meta_source_files[a].machines = ["all"];
			}

			if (Object.values(variant_machines).length > 0) {
				this.variant_machines = Object.values(variant_machines);
			}
		}
	}
}
