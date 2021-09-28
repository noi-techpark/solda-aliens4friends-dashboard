export default class AlienPackage {
	name = "";
	sha1_cksum = "";
	git_sha1 = null;
	src_uri = "";
	files_in_archive = 0;
	paths = [];

	constructor(data = {}) {
		if (data.name) this.name = data.name;
		if (data.sha1_cksum) this.sha1_cksum = data.sha1_cksum;
		if (data.git_sha1) this.git_sha1 = data.git_sha1;
		if (data.src_uri) this.src_uri = data.src_uri;
		if (data.files_in_archive) this.files_in_archive = data.files_in_archive;
		if (data.paths) this.paths = data.paths;
	}
}
