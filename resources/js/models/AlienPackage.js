// TODO
import SourceFile from "./SourceFile";
import BinaryPackage from "./BinaryPackage";
import _ from "lodash";

export default class AlienPackage {
	id = null;
	name = null;
	version = null;
	revision = null;
	variant = null;

	session_state = {
		selected: false,
		selected_reason: "missing reason",
		uploaded: null,
		uploaded_reason: "missing reason"
	}

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
	binary_packages = [];

	metadata = false;
	cve_metadata = false;

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
		if (data.session_state) this.session_state = data.session_state
		if (data.cve_metadata && data.cve_metadata.result) {
			this.cve_metadata = data.cve_metadata
			this.collectCves();
		}

		var filestats = this.statistics.files;

		this.progress =
			filestats.audit_total == 0
				? 100
				: parseInt(
						(filestats.audit_done / filestats.audit_total) * 100
				  );
		this.workload = filestats.audit_done;
		this.workload_total = filestats.audit_total;
		this.match = this.debian_matching
			? (this.debian_matching.ip_matching_files /
					filestats.upstream_source_total) *
			  100
			: 0;

	}

	collectCves() {
		this.isCve = true

		this.cveStatus = {
			open : 0,
			patched : 0,
			whitelisted : 0,
			audit_necessary: this.cve_metadata.result.review.length,
			data : []
		}

		for (var a = 0; a < this.cve_metadata.result.identified.length; a++) {
			var val = this.cve_metadata.result.identified[a]
			var res = {
				id : val.id,
				references : val.data.cve.references.reference_data,
				impact : val.data.impact.baseMetricV3.cvssV3
			}

			for (var i = 0; i < this.source_files.length; i++) {
				// TODO: Regex / respect filename variations
				if(this.source_files[i].name.toUpperCase().indexOf(res.id.toUpperCase()) != -1) {
					res.patched = true
					console.warn("patched! ", this.source_files[a].name)
					this.cveStatus.patched++;
				}
			}

			for (var i = 0; i < this.cve_metadata.cve_check_whitelist.length; i++) {
				let whitelisted = this.cve_metadata.cve_check_whitelist[i]
				if(whitelisted.toUpperCase().indexOf(res.id.toUpperCase()) != -1) {
					res.whitelist = true
					console.warn("whitelist! ", whitelisted)
					this.cveStatus.whitelisted++;
				}
			}

			if(!res.whitelist && !res.patched) this.cveStatus.open++;

			this.cveStatus.data.push(res);
		}
	}

	// all cves without whitelisted and patched
	getOpenCves() {
		return this.isCve ? data.cve_metadata.result.identified : []
	}

	setVariantTags() {
		if (!this.isVariant) return;

		let variant_machines = {};
		// 	"it is assumed that there is only 1 release and 1 image in paths. thus these two infos are overwritten."
		for (var a = 0; a < this.meta_source_files.length; a++) {
			if (this.meta_source_files[a].paths.length > 0) {
				this.meta_source_files[a].machines = [];
				for (
					var i = 0;
					i < this.meta_source_files[a].paths.length;
					i++
				) {
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
