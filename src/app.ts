class ProjectInput {
	templateEl: HTMLTemplateElement;
	appEl: HTMLDivElement;

	constructor() {
		this.templateEl = document.getElementById(
			'project-input'
		)! as HTMLTemplateElement;

		this.appEl = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl.content, true);
		this.appEl.appendChild(importedNode);
	}
}

new ProjectInput();
