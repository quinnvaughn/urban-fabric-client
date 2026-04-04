import { createStore, useStore } from "@tanstack/react-store"

type ReplyTarget = {
	commentId: string
	displayName: string
	replyToUser?: {
		__typename: "User"
		id: string
		name: string
	} | null
}

type PendingLocation = {
	lat: number
	lng: number
	name: string
}

type PendingScrollTarget = {
	commentId: string
	parentId?: string
}

type CommentComposerState = {
	replyTarget: ReplyTarget | null
	draftBody: string
	isPickingLocation: boolean
	pendingLocation: PendingLocation | null
	pendingScrollTarget: PendingScrollTarget | null
}

const initialState: CommentComposerState = {
	replyTarget: null,
	draftBody: "",
	isPickingLocation: false,
	pendingLocation: null,
	pendingScrollTarget: null,
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

const setPendingScrollTarget = (
	pendingScrollTarget: PendingScrollTarget | null,
) =>
	commentComposerStore.setState((state) => ({
		...state,
		pendingScrollTarget,
	}))

const clearPendingScrollTarget = () =>
	commentComposerStore.setState((state) => ({
		...state,
		pendingScrollTarget: null,
	}))

const clearCommentComposer = () =>
	commentComposerStore.setState((state) => ({
		...state,
		replyTarget: null,
		draftBody: "",
		isPickingLocation: false,
		pendingLocation: null,
	}))

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
		setPendingScrollTarget,
		clearPendingScrollTarget,
		clearCommentComposer,
	}
}

export type { PendingLocation, PendingScrollTarget, ReplyTarget }
