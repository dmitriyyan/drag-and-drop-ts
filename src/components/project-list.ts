import Component from './base-component';
import { DragTarget } from '../models/drag-drop';
import Project from '../models/project';
import ProjectState from '../state/project';
import ProjectItem from './project-item';
import autobind from '../decorators/autobind';

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
		ProjectState.getInstance().addListener((projects) => {
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
		ProjectState.getInstance().moveProject(projectId, this.type);
	}

	@autobind
  dragLeaveHandler(event: DragEvent) {
    const currTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!currTarget.contains(relatedTarget)) {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }
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

export default ProjectList;
