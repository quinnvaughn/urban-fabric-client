import { Menu, type MenuProps } from "../menu"

export function DropdownMenu(props: Omit<MenuProps, "openOn">) {
	return <Menu {...props} openOn="click" />
}
DropdownMenu.Trigger = Menu.Trigger
DropdownMenu.Content = Menu.Content
DropdownMenu.Item = Menu.Item
DropdownMenu.Link = Menu.Link
DropdownMenu.Separator = Menu.Separator
