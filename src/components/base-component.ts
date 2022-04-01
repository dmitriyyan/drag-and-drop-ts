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
		this.element = document.importNode(this.templateElement, true)
			.firstElementChild as U;

		this.attach();
	}

	private attach() {
		this.appElement.appendChild(this.element);
	}

    abstract configure(): void;
	abstract renderContent(): void;
}

export default Component;
