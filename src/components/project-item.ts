import Component from './base-component';
import { Draggable } from '../models/drag-drop';
import Project from '../models/project';
import autobind from '../decorators/autobind';

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

export default ProjectItem;