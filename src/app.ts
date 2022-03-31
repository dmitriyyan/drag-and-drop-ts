class ProjectInput {
	templateEl: HTMLTemplateElement;
	appEl: HTMLDivElement;
	formEl: HTMLFormElement;
	titleInputEl: HTMLInputElement;
	descriptionInputEl: HTMLTextAreaElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		this.templateEl = document.getElementById(
			'project-input'
		)! as HTMLTemplateElement;

		this.appEl = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl.content, true);
		this.formEl = importedNode.firstElementChild as HTMLFormElement;

		this.titleInputEl = this.formEl.querySelector(
			'#title'
		)! as HTMLInputElement;
		this.descriptionInputEl = this.formEl.querySelector(
			'#description'
		)! as HTMLTextAreaElement;
		this.peopleInputEl = this.formEl.querySelector(
			'#people'
		)! as HTMLInputElement;

        this.configureForm();
		this.renderForm();
	}

    private submitHandler(event: Event) {
        event.preventDefault();
    }

	private configureForm() {
		this.formEl.addEventListener('submit', this.submitHandler.bind(this));
	}

	private renderForm() {
		this.appEl.appendChild(this.formEl);
	}
}

new ProjectInput();
