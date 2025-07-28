import { useStore } from "@tanstack/react-store"
import { Store } from "@tanstack/store"
import type React from "react"
import { useEffect, useMemo, useRef } from "react"
import { z } from "zod"

export interface UseFormHelpers<Values> {
	/** Reset the form back to its initial values (or override) */
	reset(valuesOverride?: Partial<Values>): void
	/** Imperatively set one field’s value */
	setValue<K extends keyof Values>(name: K, value: Values[K]): void
	/** Imperatively set one field’s error */
	setError<K extends keyof Values>(name: K, message: string | null): void
	/** Batch‐set multiple field errors at once */
	setErrors(errorsMap: Partial<Record<keyof Values, string | null>>): void
	/** Clear all errors */
	clearErrors(): void
	/** Set a form-level error message */
	setFormError(message: string | null, timeoutInMs?: number): void
	/** Clear the form-level error */
	clearFormError(): void
}

export type FormHelpersFromSchema<S extends z.ZodObject<any>> = UseFormHelpers<
	z.infer<S>
>

type FormState<Values> = {
	values: Values
	errors: { [K in keyof Values]: string | null }
	touched: { [K in keyof Values]: boolean }
	meta: {
		isSubmitting: boolean
		submitCount: number
		canSubmit: boolean
		isDirty: boolean
		formError: string | null
	}
}

export function useForm<Schema extends z.ZodObject<any>>(opts: {
	schema: Schema
	defaultValues?: Partial<z.infer<Schema>>
	onSubmit: (
		values: z.infer<Schema>,
		helpers: FormHelpersFromSchema<Schema>,
	) => Promise<void> | void
}) {
	type Values = z.infer<Schema>

	const defaultValuesRef = useRef<Partial<Values> | undefined>(
		opts.defaultValues,
	)

	// keep a ref to the latest onSubmit, so store isn't recreated on every render
	const onSubmitRef = useRef(opts.onSubmit)
	useEffect(() => {
		onSubmitRef.current = opts.onSubmit
	}, [opts.onSubmit])

	const formApi = useMemo(() => {
		const shape = opts.schema.shape
		const defaults = defaultValuesRef.current ?? {}

		// Initial values/errors/touched
		const initialValues = Object.fromEntries(
			Object.keys(shape).map((key) => [
				key,
				(defaults[key as keyof typeof defaults] ??
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
			(Object.entries(shape) as [keyof Values, z.ZodTypeAny][]).map(
				([key, fieldSchema]) => {
					const defaultVal = defaults[key as keyof typeof defaults]
					const result = fieldSchema.safeParse(defaultVal)
					return [
						key,
						result.success
							? null
							: (result.error.issues[0]?.message ?? "Invalid"),
					] as const
				},
			),
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
				formError: null,
			},
		})

		const computeCanSubmit = (state: FormState<Values>) =>
			!Object.values(state.errors).some((e) => e != null)

		const computeIsDirty = (state: FormState<Values>) =>
			Object.keys(initialValues).some(
				(k) =>
					state.values[k as keyof Values] !== initialValues[k as keyof Values],
			)

		// Field validation
		const validateField = async (name: keyof Values) => {
			const fieldSchema = shape[name as string]
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
				meta: {
					...prev.meta,
					isSubmitting: true,
					submitCount: prev.meta.submitCount + 1,
				},
			}))

			try {
				await onSubmitRef.current(state.values, {
					reset,
					setValue,
					setError,
					setErrors,
					clearErrors,
					setFormError,
					clearFormError,
				})
			} finally {
				store.setState((prev) => ({
					...prev,
					meta: { ...prev.meta, isSubmitting: false },
				}))
			}
		}

		// Programmatic helpers
		const reset = (valuesOverride?: Partial<Values>) => {
			store.setState((prev) => ({
				...prev,
				values: { ...initialValues, ...valuesOverride },
				errors: initialErrors,
				touched: initialTouched,
				meta: {
					isSubmitting: false,
					submitCount: 0,
					canSubmit: false,
					isDirty: false,
					formError: null,
				},
			}))
		}

		const setValue = (name: keyof Values, value: Values[keyof Values]) => {
			store.setState((prev) => ({
				...prev,
				values: { ...prev.values, [name]: value },
				meta: { ...prev.meta, isDirty: computeIsDirty(prev) },
			}))
		}

		const setError = (name: keyof Values, errorMsg: string | null) => {
			store.setState((prev) => {
				const newErrors = { ...prev.errors, [name]: errorMsg }
				return {
					...prev,
					errors: newErrors,
					meta: {
						...prev.meta,
						canSubmit: computeCanSubmit({ ...prev, errors: newErrors }),
					},
				}
			})
		}

		const setErrors = (
			errorsMap: Partial<{ [K in keyof Values]: string | null }>,
		) => {
			store.setState((prev) => {
				const newErrors = { ...prev.errors, ...errorsMap }
				return {
					...prev,
					errors: newErrors,
					meta: {
						...prev.meta,
						canSubmit: computeCanSubmit({ ...prev, errors: newErrors }),
					},
				}
			})
		}

		const clearErrors = () => {
			store.setState((prev) => ({
				...prev,
				errors: initialErrors,
				meta: {
					...prev.meta,
					canSubmit: computeCanSubmit({ ...prev, errors: initialErrors }),
				},
			}))
		}

		const setFormError = (message: string | null, timeoutInMs?: number) => {
			store.setState((prev) => ({
				...prev,
				meta: { ...prev.meta, formError: message },
			}))

			if (timeoutInMs) {
				setTimeout(() => {
					clearFormError()
				}, timeoutInMs)
			}
		}

		const clearFormError = () => setFormError(null)

		function Subscribe<T>(props: {
			selector: (s: FormState<Values>) => T
			children: (sel: T) => React.ReactNode
		}) {
			const selected = useStore(store, (s) => {
				return props.selector({
					values: s.values,
					errors: s.errors,
					touched: s.touched,
					meta: {
						isSubmitting: s.meta.isSubmitting,
						submitCount: s.meta.submitCount,
						canSubmit: computeCanSubmit(s),
						isDirty: computeIsDirty(s),
						formError: s.meta.formError,
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
				onChange: (
					e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
				) => void
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
					void validateField(name)
				},
				onBlur: () => {
					store.setState((prev) => ({
						...prev,
						touched: { ...prev.touched, [name]: true },
					}))
				},
				meta: { error: touched ? error : null, touched },
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
				canSubmit: computeCanSubmit(s),
				isDirty: computeIsDirty(s),
				formError: s.meta.formError,
			}
		}

		return {
			Field,
			Subscribe,
			reset,
			setValue,
			setError,
			setErrors,
			clearErrors,
			validateField,
			values,
			errors,
			meta,
			handleSubmit,
			setFormError,
			clearFormError,
		}
	}, [opts.schema])

	return formApi
}
