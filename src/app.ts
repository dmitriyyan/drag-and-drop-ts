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
			console.log(title, description, people);
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

new ProjectInput();
