type DragEventHandlerType = (event: DragEvent) => void;

// Drag&Drop interfaces
export interface Draggable {
	dragStartHandler: DragEventHandlerType;
	dragEndHandler: DragEventHandlerType;
}

export interface DragTarget {
	dragOverHandler: DragEventHandlerType;
	dropHandler: DragEventHandlerType;
	dragLeaveHandler: DragEventHandlerType;
}
