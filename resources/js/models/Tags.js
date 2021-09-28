export default class Tags {
	project = [];
	release = [];
	distro = [];
	machine = [];
	image = [];

	constructor(data = {}) {
		if (data.project) this.project = data.project;
		if (data.release) this.release = data.release;
		if (data.distro) this.distro = data.distro;
		if (data.machine) this.machine = data.machine;
		if (data.image) this.project = data.image;
	}
}
