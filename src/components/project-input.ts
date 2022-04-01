import Component from './base-component';
import autobind from '../decorators/autobind';
import ProjectState from '../state/project';
import validate from '../utils/validate';

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputEl: HTMLInputElement;
	descriptionInputEl: HTMLTextAreaElement;
	peopleInputEl: HTMLInputElement;

	constructor() {
		super('project-input', 'app');

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
		this.element.addEventListener('submit', this.submitHandler);
	}

	renderContent() {}

	@autobind
	private submitHandler(event: Event) {
		event.preventDefault();

		const userInput = this.harvestUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			ProjectState.getInstance().addProject(title, desc, people);
			this.clearInput();
		}
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

	private clearInput() {
		this.titleInputEl.value = '';
		this.descriptionInputEl.value = '';
		this.peopleInputEl.value = '';
	}
}

export default ProjectInput;
