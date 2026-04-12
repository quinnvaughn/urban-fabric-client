import { useMutation } from "@apollo/client/react"
import { useRef, useState } from "react"
import { match } from "ts-pattern"
import z from "zod"
import {
	Button,
	HStack,
	Input,
	Modal,
	Textarea,
	Typography,
	useToast,
	VStack,
} from "#/features/ui"
import { Avatar } from "#/features/ui/avatar/avatar"
import {
	CreateUserBannerUploadUrlDocument,
	CreateUserProfilePictureUploadUrlDocument,
	EditProfileDocument,
	type UserProfileFragment,
} from "#/graphql/generated"
import { useForm } from "#/lib/form"
import { useModalStore } from "#/stores"
import { css } from "#/styles/styled-system/css"

type Props = {
	open: boolean
	onClose: () => void
	user: UserProfileFragment
}

async function uploadToPresignedUrl(uploadUrl: string, file: File) {
	const response = await fetch(uploadUrl, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	})
	if (!response.ok) {
		throw new Error(`Upload failed with status ${response.status}`)
	}
}

export function EditProfileModal({ open, onClose, user }: Props) {
	const [editProfile] = useMutation(EditProfileDocument)
	const [createBannerUploadUrl] = useMutation(CreateUserBannerUploadUrlDocument)
	const [createProfilePictureUploadUrl] = useMutation(
		CreateUserProfilePictureUploadUrlDocument,
	)
	const { toast } = useToast()
	const { close } = useModalStore()

	const bannerInputRef = useRef<HTMLInputElement>(null)
	const profilePictureInputRef = useRef<HTMLInputElement>(null)

	const [isUploadingBanner, setIsUploadingBanner] = useState(false)
	const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
		useState(false)
	const [bannerPreview, setBannerPreview] = useState(
		user.bannerImageUrl ?? null,
	)
	const [profilePicturePreview, setProfilePicturePreview] = useState(
		user.profilePictureUrl ?? null,
	)

	const schema = z.object({
		name: z.string().min(1, "Name is required"),
		bio: z.string(),
		location: z.string(),
		bannerImageUrl: z.string(),
		profilePictureUrl: z.string(),
	})

	const form = useForm({
		schema,
		defaultValues: {
			name: user.name,
			bio: user.bio ?? "",
			location: user.location ?? "",
			bannerImageUrl: user.bannerImageUrl ?? "",
			profilePictureUrl: user.profilePictureUrl ?? "",
		},
		onSubmit: async (values, helpers) => {
			const response = await editProfile({
				variables: {
					input: {
						name: values.name.trim(),
						bio: values.bio.trim(),
						location: values.location.trim(),
						profilePictureUrl: values.profilePictureUrl,
						bannerImageUrl: values.bannerImageUrl,
					},
				},
			})

			const result = response.data?.editProfile
			match(result)
				.with({ __typename: "User" }, () => {
					toast({ title: "Profile updated", intent: "success" })
					onClose()
				})
				.with({ __typename: "UnauthorizedError" }, ({ message }) => {
					helpers.setFormError(message)
				})
				.with({ __typename: "NotFoundError" }, ({ message }) => {
					helpers.setFormError(message)
				})
				.otherwise(() => {
					helpers.setFormError("An unexpected error occurred")
				})
		},
	})

	async function handleBannerUpload(file: File) {
		setIsUploadingBanner(true)
		try {
			const response = await createBannerUploadUrl({
				variables: { input: { contentType: file.type } },
			})
			const result = response.data?.createUserBannerUploadUrl
			if (result?.__typename !== "PresignedUploadResult") {
				toast({ title: "Failed to get upload URL", intent: "error" })
				return
			}
			await uploadToPresignedUrl(result.uploadUrl, file)
			form.setValue("bannerImageUrl", result.publicUrl)
			setBannerPreview(result.publicUrl)
		} catch {
			toast({ title: "Banner upload failed", intent: "error" })
		} finally {
			setIsUploadingBanner(false)
		}
	}

	async function handleProfilePictureUpload(file: File) {
		setIsUploadingProfilePicture(true)
		try {
			const response = await createProfilePictureUploadUrl({
				variables: { input: { contentType: file.type } },
			})
			const result = response.data?.createUserProfilePictureUploadUrl
			if (result?.__typename !== "PresignedUploadResult") {
				toast({ title: "Failed to get upload URL", intent: "error" })
				return
			}
			await uploadToPresignedUrl(result.uploadUrl, file)
			form.setValue("profilePictureUrl", result.publicUrl)
			setProfilePicturePreview(result.publicUrl)
		} catch {
			toast({ title: "Profile picture upload failed", intent: "error" })
		} finally {
			setIsUploadingProfilePicture(false)
		}
	}

	return (
		<Modal open={open} onClose={onClose} size="sm">
			<Modal.Header>
				<Modal.Title>Edit profile</Modal.Title>
				<Modal.CloseBtn />
			</Modal.Header>
			<form onSubmit={form.handleSubmit}>
				<Modal.Body>
					<VStack gap="4">
						<VStack gap="3">
							{/* Banner */}
							<HStack gap="3" align="center">
								<input
									ref={bannerInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp"
									className={css({ display: "none" })}
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) void handleBannerUpload(file)
										e.target.value = ""
									}}
								/>
								<div
									className={css({
										width: "80px",
										height: "52px",
										borderRadius: "md",
										flexShrink: 0,
										overflow: "hidden",
										border: "1px solid",
										borderColor: "border.subtle",
									})}
								>
									{bannerPreview ? (
										<img
											src={bannerPreview}
											alt="Banner preview"
											className={css({
												width: "full",
												height: "full",
												objectFit: "cover",
											})}
										/>
									) : (
										<div
											className={css({
												width: "full",
												height: "full",
												background:
													"linear-gradient(135deg, token(colors.teal.600), token(colors.stone.400))",
											})}
										/>
									)}
								</div>
								<VStack gap="0.5" className={css({ flex: 1 })}>
									<Typography.Text size="sm" weight="medium" color="stone.900">
										Banner
									</Typography.Text>
									<Typography.Text size="xs" color="stone.500">
										Recommended 1500×300px. JPG, PNG, or WebP.
									</Typography.Text>
								</VStack>
								<Button
									type="button"
									size="sm"
									intent="neutral"
									appearance="outline"
									disabled={isUploadingBanner}
									onClick={() => bannerInputRef.current?.click()}
								>
									{isUploadingBanner ? "Uploading…" : "Upload"}
								</Button>
							</HStack>

							{/* Profile picture */}
							<HStack gap="3" align="center">
								<input
									ref={profilePictureInputRef}
									type="file"
									accept="image/jpeg,image/png,image/webp"
									className={css({ display: "none" })}
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) void handleProfilePictureUpload(file)
										e.target.value = ""
									}}
								/>
								<Avatar
									name={user.name}
									size="lg"
									profilePictureUrl={profilePicturePreview}
								/>
								<VStack gap="0.5" className={css({ flex: 1 })}>
									<Typography.Text size="sm" weight="medium" color="stone.900">
										Profile picture
									</Typography.Text>
									<Typography.Text size="xs" color="stone.500">
										At least 400×400px. JPG, PNG, or WebP.
									</Typography.Text>
								</VStack>
								<Button
									type="button"
									size="sm"
									intent="neutral"
									appearance="outline"
									disabled={isUploadingProfilePicture}
									onClick={() => profilePictureInputRef.current?.click()}
								>
									{isUploadingProfilePicture ? "Uploading…" : "Upload"}
								</Button>
							</HStack>
						</VStack>

						<form.Field name="name">
							{(field) => (
								<Input required invalid={!!field.meta.error}>
									<Input.Label>Name</Input.Label>
									<Input.Field type="text" autoComplete="name" {...field} />
									<Input.Error>{field.meta.error}</Input.Error>
								</Input>
							)}
						</form.Field>
						<form.Field name="bio">
							{(field) => (
								<Textarea invalid={!!field.meta.error}>
									<Textarea.Label>Bio</Textarea.Label>
									<Textarea.Field rows={3} {...field} />
									<Textarea.Error>{field.meta.error}</Textarea.Error>
								</Textarea>
							)}
						</form.Field>
						<form.Field name="location">
							{(field) => (
								<Input invalid={!!field.meta.error}>
									<Input.Label>Location</Input.Label>
									<Input.Field
										type="text"
										autoComplete="address-level2"
										{...field}
									/>
									<Input.Error>{field.meta.error}</Input.Error>
								</Input>
							)}
						</form.Field>
						<form.Subscribe selector={(state) => state.meta.formError}>
							{(error) => (error ? <Input.Error>{error}</Input.Error> : null)}
						</form.Subscribe>
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<form.Subscribe
						selector={(state) => ({
							canSubmit: state.meta.canSubmit,
							isSubmitting: state.meta.isSubmitting,
							isDirty: state.meta.isDirty,
						})}
					>
						{({ canSubmit, isSubmitting, isDirty }) => (
							<HStack>
								<Button
									type="button"
									intent="neutral"
									size="sm"
									appearance="outline"
									onClick={close}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									intent="brand"
									size="sm"
									disabled={!canSubmit || isSubmitting || !isDirty}
								>
									{isSubmitting ? "Saving…" : "Save changes"}
								</Button>
							</HStack>
						)}
					</form.Subscribe>
				</Modal.Footer>
			</form>
		</Modal>
	)
}
