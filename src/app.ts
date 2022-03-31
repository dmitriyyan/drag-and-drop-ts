class Project {
	constructor(
		id: string,
		title: string,
		description: string,
		people: number,
		status: 'active' | 'finished'
	) {}
}

type Listener = (items: Project[]) => void;

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}

		return new ProjectState();
	}

	addListener(fn: Listener) {
		this.listeners.push(fn);
	}

	addProject(title: string, description: string, people: number) {
		this.projects.push(
			new Project(
				Date.now().toString(),
				title,
				description,
				people,
				'active'
			)
		);

		for (const fn of this.listeners) {
			fn([...this.projects]);
		}
	}
}

const projectState = ProjectState.getInstance();

// validator
interface Validatable {
	value: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(inputObj: Validatable) {
	if (inputObj.required && inputObj.value.trim() === '') {
		return false;
	}

	if (
		inputObj.minLength !== undefined &&
		inputObj.value.length < inputObj.minLength
	) {
		return false;
	}

	if (
		inputObj.maxLength !== undefined &&
		inputObj.value.length > inputObj.maxLength
	) {
		return false;
	}

	if (inputObj.min !== undefined && inputObj.min < parseInt(inputObj.value)) {
		return false;
	}

	if (inputObj.max !== undefined && inputObj.max > parseInt(inputObj.value)) {
		return false;
	}

	return true;
}

// autobind decorator
function autobind(
	_target: ProjectInput,
	_methodName: string,
	descriptor: PropertyDescriptor
) {
	const originalMethod: Function = descriptor.value;
	const newDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			return originalMethod.bind(this);
		},
	};

	return newDescriptor;
}

class ProjectList {
	templateEl: HTMLTemplateElement;
	appEl: HTMLDivElement;
	section: HTMLElement;
	assignedProjects: Project[] = [];

	constructor(private type: 'active' | 'finished') {
		this.templateEl = document.getElementById(
			'project-list'
		)! as HTMLTemplateElement;

		this.appEl = document.getElementById('app')! as HTMLDivElement;

		const importedNode = document.importNode(this.templateEl.content, true);
		this.section = importedNode.firstElementChild as HTMLElement;
		this.section.classList.add(`${this.type}-projects`);

		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects;
			this.renderProjects();
		});

		this.renderList();
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;

		for (const project of this.assignedProjects) {
			// listEl.appendChild();
		}
	}

	private addContent() {
		const listId = `${this.type}-projects-list`;
		this.section.querySelector('ul')!.id = listId;
		this.section.querySelector(
			'h2'
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	private renderList() {
		this.addContent();
		this.appEl.appendChild(this.section);
	}
}

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

	private validateInput() {
		return (
			!validate({ value: this.titleInputEl.value, required: true }) ||
			!validate({
				value: this.descriptionInputEl.value,
				required: true,
				minLength: 5,
			}) ||
			!validate({
				value: this.peopleInputEl.value,
				required: true,
				min: 1,
				max: 5,
			})
		);
	}

	private clearInput() {
		this.titleInputEl.value = '';
		this.descriptionInputEl.value = '';
		this.peopleInputEl.value = '';
	}

	private harvestUserInput(): [string, string, number] | void {
		if (!this.validateInput()) {
			alert('Invalid input, please try again!');
			return;
		}

		return [
			this.titleInputEl.value,
			this.descriptionInputEl.value,
			parseInt(this.peopleInputEl.value),
		];
	}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();

		const userInput = this.harvestUserInput();
		if (Array.isArray(userInput)) {
			const [title, description, people] = userInput;
			projectState.addProject(title, description, people);
			this.clearInput();
		}
	}

	private configureForm() {
		this.formEl.addEventListener('submit', this.submitHandler.bind(this));
	}

	private renderForm() {
		this.appEl.appendChild(this.formEl);
	}
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
