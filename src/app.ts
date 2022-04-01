import { Draggable, DragTarget } from './models/drag-drop';
import Component from './components/base-component';
import autobind from './decorators/autobind';

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
		this.updateListeners();
	}

	moveProject(id: string, status: 'active' | 'finished') {
		const project = this.projects.find((prj) => prj.id === id);

		if (project && project.status !== status) {
			project.status = status;
			this.updateListeners();
		}
	}

	private updateListeners() {
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

class ProjectItem
	extends Component<HTMLDivElement, HTMLLIElement>
	implements Draggable
{
	private project: Project;

	get persons() {
		return this.project.people > 1
			? `${this.project.people} persons`
			: `${this.project.people} person`;
	}

	constructor(project: Project) {
		super('single-project', 'app');

		this.project = project;
		this.configure();
		this.renderContent();
	}

	configure() {
		this.element.addEventListener('dragstart', this.dragStartHandler);
		this.element.addEventListener('dragend', this.dragEndHandler);
	}

	renderContent() {
		this.element.querySelector('h3')!.textContent = this.project.title;
		this.element.querySelector(
			'h4'
		)!.textContent = `${this.persons} assigned`;
		this.element.querySelector('p')!.textContent = this.project.description;
	}

	@autobind
	dragStartHandler(event: DragEvent) {
		event.dataTransfer!.setData('text/plain', this.project.id);
		event.dataTransfer!.effectAllowed = 'move';
	}

	@autobind
	dragEndHandler(_: DragEvent) {}
}

class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
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

		this.element.addEventListener('dragover', this.dragOverHandler);
		this.element.addEventListener('dragleave', this.dragLeaveHandler);
		this.element.addEventListener('drop', this.dropHandler);
	}

	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector(
			'h2'
		)!.textContent = `${this.type.toUpperCase()} PROJECTS`;
	}

	@autobind
	dragOverHandler(event: DragEvent) {
		if (
			event.dataTransfer &&
			event.dataTransfer.types[0] === 'text/plain'
		) {
			event.preventDefault();
			const listEl = this.element.querySelector('ul')!;
			listEl.classList.add('droppable');
		}
	}

	@autobind
	dropHandler(event: DragEvent) {
		const projectId = event.dataTransfer!.getData('text/plain');
		projectState.moveProject(projectId, this.type);
	}

	@autobind
	dragLeaveHandler(_: DragEvent) {
		const listEl = this.element.querySelector('ul')!;
		listEl.classList.remove('droppable');
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

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
