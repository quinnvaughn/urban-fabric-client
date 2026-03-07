import { useQuery } from "@apollo/client/react"
import { MeDocument } from "#/graphql/generated"

export function useCurrentUser() {
	return useQuery(MeDocument)
}
