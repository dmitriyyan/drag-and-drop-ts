import ProjectInput from '../components/project-input';
import ProjectList from '../components/project-list';
import ProjectItem from '../components/project-item';

type TargetType = ProjectInput | ProjectList | ProjectItem;

export default function (
	_target: TargetType,
	_methondName: string,
	descriptor: PropertyDescriptor
) {
	const originalMethod = descriptor.value;

	return {
		configurable: true,
		get() {
			return originalMethod.bind(this);
		},
	};
}
