import { useQuery } from "@apollo/client/react"
import { MeDocument } from "#/graphql/generated"

export function useCurrentUser() {
	const { data, refetch, loading } = useQuery(MeDocument)
	return { user: data?.me ?? null, refetch, loading }
}
