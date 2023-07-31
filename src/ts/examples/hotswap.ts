import FlexList from "@everbit-software/flex-list/src/flex-list";
import { TableRenderer } from "@everbit-software/flex-list/src/renderers/table-renderer";
import { ListItem } from "@everbit-software/flex-list/src/list-item";
import { ListGroupRenderer } from "@everbit-software/flex-list/src/renderers/bootstrap/list-group-renderer";
import { CardRenderer } from "@everbit-software/flex-list/src/renderers/bootstrap/card-renderer";
import { Search } from "@everbit-software/flex-list/src/search";
import { Product, getRows } from "../dummy-api";
import { AbstractRenderer } from "@everbit-software/flex-list/src/renderers/abstract-renderer";
// import { PageLoader } from "../../flex-list/loaders/page-loader";

const listContainer = document.querySelector('#listContainer') as HTMLDivElement;
const containerElement = listContainer.querySelector('[data-list=items]') as HTMLDivElement;
const paginationElements = {
    prevButton: listContainer.querySelector('[data-list=page-prev]') as HTMLButtonElement,
    nextButton: listContainer.querySelector('[data-list=page-next]') as HTMLButtonElement,
    pagesContainer: listContainer.querySelector('[data-list=pages]') as HTMLElement,
};

const url = new URL(window.location.href);
const changeViewButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('[data-change-view]');

/**
 * Get the renderer, update the URL parameter and toggle button classes
 * @param view 
 * @returns 
 */
const getRenderer = (view: string) => {
    let renderer: AbstractRenderer;

    if (view === 'card') {
        renderer = new CardRenderer({
            containerElement: containerElement,
            paginationElements: paginationElements,
            loaderHtml: `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`,
            columnClasses: ['col-md-6', 'my-3'],
            renderItemSpinner(item: ListItem): HTMLElement {
                return document.createElement('div');
            },
            renderRow(item: ListItem): HTMLElement | string {
                let product = item.data as Product;

                return `<div class="card card-body h-100 d-flex justify-content-center">
                    <h2 class="mb-3">${product.title}</h2>
                    <div class="text-muted">$ ${product.price}</div>
                        
                    <div class="d-none d-md-block">${product.description}</div>
                </div>`;
            }
        })
    } else if (view === 'list-group') {
        renderer = new ListGroupRenderer({
            containerElement: containerElement,
            paginationElements: paginationElements,
            loaderHtml: `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`,
            renderItemSpinner(item: ListItem): HTMLElement {
                return document.createElement('div');
            },
            renderRow(item: ListItem): HTMLElement | string {
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
        view = 'table';

        renderer = new TableRenderer({
            containerElement: containerElement,
            paginationElements: paginationElements,
            loaderHtml: `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`,
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

    // Update URL parameter
    url.searchParams.set('view', view);

    // Update buttons
    for (let button of changeViewButtons) {
        button.classList.toggle('active', button.dataset.changeView === view);
    }

    return renderer;
}

let list = new FlexList({
    renderer: getRenderer(url.searchParams.get('view')),
    /* loader: new PageLoader({
        loadPage: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
        // getLastPageNumber: async () => 10
    }), */
    search: new Search({
        inputElement: document.querySelector('#searchElement') as HTMLInputElement,
        fields: ['name']
    }),
    itemCallbacks: {
        load: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
        getLastPageNumber: async () => 10
    },
    idField: 'id',
    perPage: 10,
    noItemsText: 'There are currently no customers.'
});

for (let button of changeViewButtons) {
    button.onclick = () => {
        const view = button.dataset.changeView;
        list.changeRenderer(getRenderer(view));
    }
}

// @ts-ignore
window.hotswapList = list;