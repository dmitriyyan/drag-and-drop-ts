import ProjectInput from '../components/project-input';

type TargetType = ProjectInput;

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
