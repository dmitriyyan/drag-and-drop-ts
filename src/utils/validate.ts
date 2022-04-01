// validator
interface Validatable {
	value: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

export default function (inputObj: Validatable) {
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
