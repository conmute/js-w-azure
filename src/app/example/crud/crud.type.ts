export type InsertItem = {
    title: string
    content: string
}

export type Item = {
    id: string
} & InsertItem
