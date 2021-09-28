import Tags from "./Tags";

export default class AlienPackage {
	name = "";
	version = "";
	revision = "";
	tags = new Tags();
	metadata = {
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
	};

	constructor(data = {}) {
		if (data.name) this.name = data.name;
		if (data.version) this.version = data.version;
		if (data.revision) this.revision = data.revision;
		if (data.tags) this.tags = data.tags;
		if (data.metadata) this.metadata = data.metadata;
	}
}
