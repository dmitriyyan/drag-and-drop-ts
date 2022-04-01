import Project from '../models/project';

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

export default ProjectState;
