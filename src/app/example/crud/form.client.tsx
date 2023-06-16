'use client'

import React, { useLayoutEffect } from "react"
import clsx from 'clsx'
import type { FormEvent } from "react"
import { useTransition, animated, config } from '@react-spring/web'

import { Button } from "src/components/button"
import { useOnClickOutside } from "src/lib/useClickOutside"

import { createItem, listItems, deleteItem, updateItem, queryListItems } from "./crud.actions"
import { Item, InsertItem } from "./crud.type"

export type ItemDataType = {
    title: string,
    content: string
}

export const ItemForm = ({ data, onSubmit, submitLabel }: {
    submitLabel: string
    data: Partial<Item>
    onSubmit: (data: Partial<Item>) => void
}) => {
    const [itemData, setItemData] = React.useState<Partial<Item>>(data)
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(itemData)
    }
    useLayoutEffect(() => {
        setItemData(data)
    }, [data])
    return (
        <form onSubmit={handleSubmit} className="min-w-[368px]">

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-100"
                >
                    <span className='text-red-600'>*</span> Title
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={itemData.title || ""}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Your title"
                        onChange={(e) => {
                            setItemData({
                                ...itemData,
                                title: e.target.value,
                            })
                        }}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium leading-6 text-gray-100"
                >
                    <span className='text-red-600'>*</span> Content
                </label>
                <div className="mt-2">
                    <textarea
                        name="content"
                        id="content"
                        value={itemData.content || ""}
                        rows={4}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Your content"
                        onChange={(e) => {
                            setItemData({
                                ...itemData,
                                content: e.target.value,
                            })
                        }}
                    />
                </div>
            </div>

            <div className="mt-2">
                <Button type="submit">{submitLabel}</Button>
            </div>

        </form>
    )
}


const Item = ({ data, onAction }: { data: Item, onAction: (action: "delete" | "edit") => void }) => {
    const itemDropdownRef = React.useRef<HTMLDivElement>(null)
    const [itemDropdownShow, setItemDropdownShow] = React.useState(false)
    useOnClickOutside(itemDropdownRef, () => {
        setItemDropdownShow(false)
    })
    {/* <!--
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    --> */}
    const transitions = useTransition(itemDropdownShow, {
        from: {
            opacity: 0,
            transform: `scale(${0.9})`,
            transformOrigin: 'top right',
        },
        enter: { opacity: 1, transform: `scale(${1})` },
        leave: { opacity: 0, transform: `scale(${0.9})` },
        config: config.wobbly,
    })
    return (
        <li className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                    <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">{data.title}</p>
                    <p className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20">Complete</p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500 dark:text-gray-300">
                    <p className="whitespace-nowrap">Due on <time dateTime="2023-03-17T00:00Z">March 17, 2023</time></p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx="1" cy="1" r="1" />
                    </svg>
                    <p className="truncate">Created by Leslie Alexander</p>
                </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                <a
                    href="#"
                    onClick={() => onAction("edit")}
                    className="hidden rounded-md bg-white dark:bg-black px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:hover:bg-gray-800 hover:bg-gray-50 sm:block"
                >
                    View project<span className="sr-only">, {data.title}</span>
                </a>
                <div className="relative flex-none" ref={itemDropdownRef}>
                    <button
                        type="button"
                        className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-500"
                        id="options-menu-0-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => {
                            setItemDropdownShow(
                                !itemDropdownShow
                            )
                        }}
                    >
                        <span className="sr-only">Open options</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                        </svg>
                    </button>

                    {transitions((style) => (
                        <animated.div
                            style={style}
                            className={clsx(
                                'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                                {
                                    hidden: !itemDropdownShow,
                                }
                            )}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu-button"
                            tabIndex={-1}
                        >
                            {/* <!-- Active: "bg-gray-50", Not Active: "" --> */}
                            <a
                                href="#"
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                                role="menuitem"
                                tabIndex={-1}
                                id="options-menu-0-item-0"
                                onClick={() => {
                                    onAction("edit")
                                }}
                            >
                                Edit<span className="sr-only">, {data.title}</span>
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                                role="menuitem"
                                tabIndex={-1}
                                id="options-menu-0-item-2"
                                onClick={() => {
                                    onAction("delete")
                                }}
                            >
                                Delete<span className="sr-only">, {data.title}</span>
                            </a>
                        </animated.div>
                    ))}
                </div>
            </div>
        </li>
    )
}

const ToggleButton = ({
    value, onChange
}: {
    value: boolean
    onChange: (value: boolean) => void
}) => {
    return (
        <button
            type="button"
            className={clsx(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
                {
                    "bg-gray-200": !value,
                    "bg-indigo-600": value,
                }
            )}
            role="switch"
            aria-checked="false"
            onClick={() => {
                onChange(!value)
            }}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={clsx("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", {
                    "translate-x-0": !value,
                    "translate-x-5": value,
                })}
            ></span>
        </button>
    )
}

const Items = ({ }: { }) => {
    const [editItem, setEditItem] = React.useState<Partial<Item>>({})

    const [useCosmosReadAll, setUseCosmosReadAll] = React.useState(false);

    const [renderItems, setItems] = React.useState<Array<Item>>([])
    const [nextContinuationToken, setNextContinuationToken] = React.useState<string>()
    const [nextPageOffset, setNextPageOffset] = React.useState<number>()
    React.useEffect(() => {
        setNextPageOffset(undefined)
        setNextContinuationToken(undefined)
        if (!useCosmosReadAll) {
            queryListItems({})
            .then(({ items, hasMoreResults, nextPageOffset }) => {
                setItems(items)
                setNextPageOffset(hasMoreResults ? nextPageOffset : undefined)
            })
        }
        if (useCosmosReadAll) {
            listItems({})
            .then(({ items, continuationToken }) => {
                console.log({ items })
                setItems(items)
                setNextContinuationToken(continuationToken)
            })
        }
    }, [useCosmosReadAll])
    const handleLoadMore = () => {
        if (!useCosmosReadAll) {
            if (!nextPageOffset) return
            queryListItems({ offset: nextPageOffset })
                .then(({ items, nextPageOffset, hasMoreResults }) => {
                    setItems([
                        ...renderItems,
                        ...items,
                    ])
                    setNextPageOffset(hasMoreResults ? nextPageOffset : undefined)
                })
        }
        if (useCosmosReadAll) {
            if (!nextContinuationToken) return
            listItems({ continuationToken: nextContinuationToken })
            .then(({ items, continuationToken }) => {
                setItems([
                    ...renderItems,
                    ...items,
                ])
                setNextContinuationToken(continuationToken)
            })
        }
    }
    return (
        <>
            <div className="flex-row">
                <ToggleButton value={useCosmosReadAll} onChange={setUseCosmosReadAll} />
                <span>
                    Use CosmosDB <code>.readAll</code>
                </span>
            </div>
            <hr />
            <ul role="list" className="divide-y divide-gray-100">
                {renderItems.map((data) => (
                    <Item data={data} key={data.id} onAction={(action) => {
                        if (action === "delete") {
                            const deleteId = data.id
                            deleteItem({ id: deleteId }).then(() => {
                                setItems(renderItems.filter((item) => item.id !== data.id))
                            })
                        }
                        if (action === "edit") {
                            setEditItem(data)
                        }
                    }}/>
                ))}
            </ul>
            {(nextContinuationToken || nextPageOffset) && (
                <Button type="button" onClick={handleLoadMore}>Load more…</Button>
            )}

            <pre>{JSON.stringify(editItem, null, 2)}</pre>
            {editItem.id && (
                <Button type="button" onClick={() => {
                    setEditItem({})
                }}>Create new item instead</Button>
            )}
            <ItemForm
                data={editItem}
                submitLabel={editItem.id ? "Update" : "Create"}
                onSubmit={(data) => {
                    if (data.id) {
                        updateItem(data as Item).then(({
                            data
                        }) => {
                            setItems(renderItems.map((item) => {
                                if (item.id === data.id) {
                                    return data
                                }
                                return item
                            }))
                        })
                        return
                    }
                    if (!data.id) {
                        createItem(data as InsertItem).then(({
                            statusCode,
                            itemId,
                            data,
                        }) => {
                            setItems([
                                data,
                                ...renderItems,
                            ])
                        })
                    }
                }}
            />
        </>
    )
}

export const HandleItems = () => {
    return (
        <>
            <div className="p-3">
                <Items />
            </div>
        </>
    )
}
