import { createStore, useStore } from "@tanstack/react-store"

type EditingTarget = {
	id: string
	kind: "comment" | "reply"
	parentId?: string
}

type CommentEditState = {
	editingTarget: EditingTarget | null
	draftBody: string
}

const initialState: CommentEditState = {
	editingTarget: null,
	draftBody: "",
}

const commentEditStore = createStore(initialState)

const startEditing = (target: EditingTarget, initialBody: string) =>
	commentEditStore.setState(() => ({
		editingTarget: target,
		draftBody: initialBody,
	}))

const setDraftBody = (draftBody: string) =>
	commentEditStore.setState((state) => ({
		...state,
		draftBody,
	}))

const cancelEditing = () =>
	commentEditStore.setState(() => initialState)

export function useCommentEditStore() {
	const state = useStore(commentEditStore, (state) => state)

	return {
		...state,
		startEditing,
		setDraftBody,
		cancelEditing,
		clearEditing: cancelEditing,
	}
}

export type { EditingTarget }
