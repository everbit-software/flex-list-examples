import DynamicList from "../../dynamic-list/dynamic-list";
import { TableRenderer } from "../../dynamic-list/renderers/table-renderer";
import { ListItem } from "../../dynamic-list/list-item";
import { ListGroupRenderer } from "../../dynamic-list/renderers/Bootstrap/list-group-renderer";
import { CardRenderer } from "../../dynamic-list/renderers/Bootstrap/card-renderer";
import { Search } from "../../dynamic-list/search";
import { Product, getRows } from "./dummy-api";
import { AbstractRenderer } from "../../dynamic-list/renderers/abstract-renderer";
// import { PageLoader } from "../../dynamic-list/loaders/page-loader";

const listContainer = document.querySelector('#listContainer') as HTMLDivElement;
const containerElement = listContainer.querySelector('[data-list=items]') as HTMLDivElement;
const paginationElements = {
    prevPageButton: listContainer.querySelector('[data-list=page-prev]') as HTMLButtonElement,
    nextPageButton: listContainer.querySelector('[data-list=page-next]') as HTMLButtonElement,
    pagesContainer: listContainer.querySelector('[data-list=pages]') as HTMLElement,
};

const url = new URL(window.location.href);
const rendererType = url.searchParams.get('view');

let renderer: AbstractRenderer;

if (rendererType === 'card') {
    renderer = new CardRenderer({
        containerElement: containerElement,
        paginationElements: paginationElements,
        columnClasses: ['col-md-6', 'my-3'],
        renderItemSpinner(item: ListItem): HTMLElement {
            return document.createElement('div');
        },
        renderRow(item: ListItem): HTMLElement|string {
            let product = item.data as Product;

            return `<div class="card card-body">
                <div class="row align-items-center">
                    <div class="col">
                        ${product.title}
                        <div class="text-muted">${product.price}</div>
                    </div>
                    
                    <div class="col d-none d-md-block">${product.description}</div>
                </div>
            </div>`;
        }
    })
} else if (rendererType === 'list-group') {
    renderer = new ListGroupRenderer({
        containerElement: containerElement,
        paginationElements: paginationElements,
        renderItemSpinner(item: ListItem): HTMLElement {
            return document.createElement('div');
        },
        renderRow(item: ListItem): HTMLElement|string {
            let product = item.data as Product;

            return `<div class="list-group-item">
                <div class="row align-items-center">
                    <div class="col">
                        ${product.title}
                        <div class="text-muted">${product.price}</div>
                    </div>
                    
                    <div class="col d-none d-md-block">${product.description}</div>
                </div>
            </div>`;
        }
    });
} else {
    renderer = new TableRenderer({
        containerElement: containerElement,
        paginationElements: paginationElements,
        columns: [
            {
                label: 'Title',
                key: 'title'
            },
            {
                label: 'Price',
                key: 'price'
            }
        ]
    });
}

let list = new DynamicList({
    renderer: renderer,
    /* loader: new PageLoader({
        loadPage: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
        // getLastPageNumber: async () => 10
    }), */
    search: new Search({
        inputElement: document.querySelector('#searchElement') as HTMLInputElement,
        fields: ['name']
    }),
    fetchCallbacks: {
        load: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
        getLastPageNumber: async () => 10
    },
    idField: 'id',
    perPage: 10,
    noItemsText: 'There are currently no customers.'
});

// @ts-ignore
window.list = list;