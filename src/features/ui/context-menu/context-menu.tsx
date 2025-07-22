import { Menu, type MenuProps } from "../menu"

export function ContextMenu(props: Omit<MenuProps, "openOn">) {
	return <Menu {...props} openOn="contextmenu" />
}
ContextMenu.Trigger = Menu.Trigger
ContextMenu.Content = Menu.Content
ContextMenu.Item = Menu.Item
ContextMenu.Link = Menu.Link
ContextMenu.Separator = Menu.Separator
