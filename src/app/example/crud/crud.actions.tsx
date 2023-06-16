'use server';
import { z } from "zod";
import { zact } from "zact/server";

import { containers } from "src/server/db"
import type { Item } from "./crud.type"

const queryListItemsValidator = z.object({
    offset: z.number().optional()
})

const PAGE_LIMIT = 3;

export const queryListItems = zact(queryListItemsValidator)(async ({
    offset = 0
}) => {
    const { resources: [count] } = await containers.test.items
        .query({
            query: `
                SELECT VALUE COUNT(1) FROM c
            `
        })
        .fetchAll()
    if (count === undefined) {
        throw Error('Getting items count: Connection or container issue')
    }
    const things = await containers.test.items
        .query({
            query: `
                SELECT * FROM c 
                ORDER BY c._ts DESC
                OFFSET @itemsOffset LIMIT @itemsLimit
            `,
            parameters: [
                {
                  name: "@itemsOffset",
                  value: offset,
                },
                {
                  name: "@itemsLimit",
                  value: PAGE_LIMIT,
                },
            ],
        })
        .fetchAll();
    const hasMoreResults = things.resources.length + offset < count
    return {
        items: things.resources,
        hasMoreResults,
        nextPageOffset: offset + PAGE_LIMIT
    }
})

const listItemsValidator = z.object({
    continuationToken: z.string().optional()
})

export const listItems = zact(listItemsValidator)(async ({
    continuationToken
}) => {
    const things = await containers.test.items
        .readAll<Item>({
            maxItemCount: PAGE_LIMIT,
            continuationToken,
        })
        .fetchNext();
    return {
        items: things.resources,
        continuationToken: things.continuationToken,
    }
})

const createItemValidator = z.object({
    title: z.string().min(3),
    content:  z.string().min(3),
})

export const createItem = zact(createItemValidator)(async ({
    title,
    content,
}) => {
    const result = await containers.test.items.create({
        title,
        content,
    })
    const item: Item = {
        id: result.item.id,
        title,
        content,
    }
    return {
        statusCode: result.statusCode,
        itemId: result.item.id,
        data: item,
    }
})

const deleteItemValidator = z.object({
    id: z.string(),
})

export const deleteItem = zact(deleteItemValidator)(async ({ id }) => {
    const result = await containers.test.item(id, id).delete()
    return {
        statusCode: result.statusCode,
    }
})

const updateItemValidator = z.object({
    id: z.string(),
    title: z.string().min(3),
    content:  z.string().min(3),
})

export const updateItem = zact(updateItemValidator)(async (input) => {
    const result = await containers.test.item(input.id, input.id).replace(input)
    const data: Item = {
        ...input,
        id: result.item.id,
    }
    return {
        statusCode: result.statusCode,
        itemId: result.item.id,
        data,
    }
})
