class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: 'active' | 'finished'
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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	appElement: T;
	element: U;

	constructor(templateId: string, appElementId: string) {
		this.templateElement = document.getElementById(
			templateId
		)! as HTMLTemplateElement;

		this.appElement = document.getElementById(appElementId)! as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);
		this.element = importedNode.firstElementChild as U;

		this.attach();
	}

	private attach() {
		this.appElement.appendChild(this.element);
	}

	abstract configure(): void;
	abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLDivElement, HTMLLIElement> {
	private project: Project;

	constructor(project: Project) {
		super('single-project', 'app');

		this.project = project;
		this.renderContent();
	}

	configure() {}

	renderContent() {
		this.element.querySelector('h3')!.textContent = this.project.title;
		this.element.querySelector('h4')!.textContent =
			this.project.people.toString();
		this.element.querySelector('p')!.textContent = this.project.description;
	}
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
	assignedProjects: Project[] = [];

	constructor(private type: 'active' | 'finished') {
		super('project-list', 'app');
		this.element.classList.add(`${this.type}-projects`);

		this.configure();
		this.renderContent();
	}

	configure() {
		projectState.addListener((projects: Project[]) => {
			this.assignedProjects = projects.filter((project) =>
				this.type === 'active'
					? project.status === 'active'
					: project.status === 'finished'
			);
			this.renderProjects();
		});
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector(
			'h2'
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	private renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		listEl.innerHTML = '';

		for (const project of this.assignedProjects) {
			listEl.appendChild(new ProjectItem(project).element);
		}
	}
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement;
	descriptionInputEl: HTMLTextAreaElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		super('project-input', 'app');

		this.titleInputEl = this.element.querySelector(
			'#title'
		)! as HTMLInputElement;
		this.descriptionInputEl = this.element.querySelector(
			'#description'
		)! as HTMLTextAreaElement;
		this.peopleInputEl = this.element.querySelector(
			'#people'
		)! as HTMLInputElement;

		this.configure();
	}

	configure() {
		this.element.addEventListener('submit', this.submitHandler.bind(this));
	}

	renderContent() {}

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
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
