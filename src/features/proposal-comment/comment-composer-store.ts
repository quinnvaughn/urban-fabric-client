import { createStore, useStore } from "@tanstack/react-store"

type ReplyTarget = {
	commentId: string
	displayName: string
}

type PendingLocation = {
	lat: number
	lng: number
	label?: string
}

type CommentComposerState = {
	replyTarget: ReplyTarget | null
	draftBody: string
	isPickingLocation: boolean
	pendingLocation: PendingLocation | null
}

const initialState: CommentComposerState = {
	replyTarget: null,
	draftBody: "",
	isPickingLocation: false,
	pendingLocation: null,
}

const commentComposerStore = createStore(initialState)

const setReplyTarget = (replyTarget: ReplyTarget | null) =>
	commentComposerStore.setState((state) => ({ ...state, replyTarget }))

const setDraftBody = (draftBody: string) =>
	commentComposerStore.setState((state) => ({ ...state, draftBody }))

const startPickingLocation = () =>
	commentComposerStore.setState((state) => ({
		...state,
		isPickingLocation: true,
	}))

const setPendingLocation = (pendingLocation: PendingLocation | null) =>
	commentComposerStore.setState((state) => ({
		...state,
		pendingLocation,
		isPickingLocation: false,
	}))

const clearPendingLocation = () =>
	commentComposerStore.setState((state) => ({
		...state,
		pendingLocation: null,
	}))

const cancelPickingLocation = () =>
	commentComposerStore.setState((state) => ({
		...state,
		isPickingLocation: false,
	}))

const clearCommentComposer = () =>
	commentComposerStore.setState(() => initialState)

export function useCommentComposerStore() {
	const state = useStore(commentComposerStore, (state) => state)

	return {
		...state,
		setReplyTarget,
		setDraftBody,
		startPickingLocation,
		setPendingLocation,
		clearPendingLocation,
		cancelPickingLocation,
		clearCommentComposer,
	}
}

export type { PendingLocation, ReplyTarget }
