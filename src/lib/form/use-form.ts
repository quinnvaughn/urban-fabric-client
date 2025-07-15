import { useStore } from "@tanstack/react-store"
import { Store } from "@tanstack/store"
import type React from "react"
import { useMemo } from "react"
import { z } from "zod"

type FormState<Values> = {
	values: Values
	errors: { [K in keyof Values]: string | null }
	touched: { [K in keyof Values]: boolean }
	meta: {
		isSubmitting: boolean
		submitCount: number
		canSubmit: boolean
		isDirty: boolean
	}
}

export function useForm<Schema extends z.ZodObject<any>>(opts: {
	schema: Schema
	defaultValues?: Partial<z.infer<Schema>>
	onSubmit: (values: z.infer<Schema>) => Promise<void> | void
}) {
	type Values = z.infer<Schema>

	const formApi = useMemo(() => {
		const shape = opts.schema.shape

		// Initial values/errors/touched
		const initialValues = Object.fromEntries(
			Object.keys(shape).map((key) => [
				key,
				(opts.defaultValues?.[key as keyof Values] ??
					(() => {
						const field = shape[key as keyof typeof shape]
						if (field instanceof z.ZodString) return ""
						if (field instanceof z.ZodNumber) return 0
						if (field instanceof z.ZodBoolean) return false
						if (field instanceof z.ZodArray) return []
						if (field instanceof z.ZodObject) return {}
						return undefined
					})()) as any,
			]),
		) as Values

		const initialErrors = Object.fromEntries(
			Object.keys(shape).map((key) => [key, null]),
		) as { [K in keyof Values]: string | null }

		const initialTouched = Object.fromEntries(
			Object.keys(shape).map((key) => [key, false]),
		) as { [K in keyof Values]: boolean }

		// Create the store
		const store = new Store<FormState<Values>>({
			values: initialValues,
			errors: initialErrors,
			touched: initialTouched,
			meta: {
				isSubmitting: false,
				submitCount: 0,
				canSubmit: false,
				isDirty: false,
			},
		})

		// Field validation
		const validateField = async (name: keyof Values) => {
			const fieldSchema = opts.schema.shape[name as string]
			const state = store.state
			const result = fieldSchema.safeParse(state.values[name])
			const errorMsg = result.success
				? null
				: (result.error.issues[0]?.message ?? null)
			store.setState((prev) => ({
				...prev,
				errors: { ...prev.errors, [name]: errorMsg },
			}))
			return errorMsg
		}

		// Submission handler
		const handleSubmit = async () => {
			// touch & validate all
			for (const name of Object.keys(shape) as (keyof Values)[]) {
				store.setState((prev) => ({
					...prev,
					touched: { ...prev.touched, [name]: true },
				}))
				await validateField(name)
			}

			const state = store.state
			if (Object.values(state.errors).some((e) => e)) return

			store.setState((prev) => ({
				...prev,
				isSubmitting: true,
				submitCount: prev.meta.submitCount + 1,
			}))

			try {
				await opts.onSubmit(state.values)
			} finally {
				store.setState((prev) => ({ ...prev, isSubmitting: false }))
			}
		}

		const reset = (valuesOverride?: Partial<Values>) => {
			store.setState((prev) => ({
				...prev,
				values: {
					...prev.values,
					...valuesOverride,
				},
				errors: initialErrors,
				touched: initialTouched,
				meta: {
					isSubmitting: false,
					submitCount: 0,
					canSubmit: false,
					isDirty: false,
				},
			}))
		}

		// Subscribe component
		function Subscribe<TSelected>(props: {
			selector: (state: {
				values: Values
				errors: { [K in keyof Values]: string | null }
				touched: { [K in keyof Values]: boolean }
				meta: {
					isSubmitting: boolean
					submitCount: number
					canSubmit: boolean
					isDirty: boolean
				}
			}) => TSelected
			children: (sel: TSelected) => React.ReactNode
		}) {
			const selected = useStore(store, (state) => {
				const canSubmit =
					// no validation errors
					!Object.values(state.errors).some((e) => e != null) &&
					// every field has been touched
					Object.values(state.touched).every((t) => t)
				const isDirty = Object.keys(initialValues).some(
					(k) =>
						state.values[k as keyof Values] !==
						initialValues[k as keyof Values],
				)
				return props.selector({
					values: state.values,
					errors: state.errors,
					touched: state.touched,
					meta: {
						isSubmitting: state.meta.isSubmitting,
						submitCount: state.meta.submitCount,
						canSubmit,
						isDirty,
					},
				})
			})
			return props.children(selected)
		}

		// Field component
		function Field<K extends keyof Values>(props: {
			name: K
			children: (field: {
				name: K
				value: Values[K]
				onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
				onBlur: () => void
				meta: { error: string | null; touched: boolean }
			}) => React.ReactNode
		}) {
			const { name, children } = props
			const { value, error, touched } = useStore(store, (s) => ({
				value: s.values[name],
				error: s.errors[name],
				touched: s.touched[name],
			}))

			return children({
				name,
				value,
				onChange: (e) => {
					const v = e.target.value as any
					store.setState((prev) => ({
						...prev,
						values: { ...prev.values, [name]: v },
					}))
					if (touched) void validateField(name)
				},
				onBlur: () => {
					store.setState((prev) => ({
						...prev,
						touched: { ...prev.touched, [name]: true },
					}))
					void validateField(name)
				},
				meta: { error, touched },
			})
		}

		// Plain getters
		const values = () => store.state.values
		const errors = () => store.state.errors
		const meta = () => {
			const s = store.state
			return {
				isSubmitting: s.meta.isSubmitting,
				submitCount: s.meta.submitCount,
				canSubmit: !Object.values(s.errors).some((e) => e != null),
				isDirty: Object.keys(initialValues).some(
					(k) =>
						s.values[k as keyof Values] !== initialValues[k as keyof Values],
				),
			}
		}

		return {
			Field,
			Subscribe,
			validateField,
			values,
			errors,
			meta,
			handleSubmit,
			reset,
		}
	}, [opts.schema, opts.defaultValues, opts.onSubmit])

	return formApi
}
