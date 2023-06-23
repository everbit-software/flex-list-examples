import DynamicList from "../../../dynamic-list/dynamic-list";
import { ListItem } from "../../../dynamic-list/list-item";
import { Product, getRows } from "../dummy-api";
import { BasicListRenderer } from "../../../dynamic-list/renderers/basic-list-renderer";
import { Search } from "../../../dynamic-list/search";

const basicContainer = document.querySelector('#basicContainer') as HTMLDivElement;
const search = document.querySelector('#basicSearch') as HTMLInputElement;

let list = new DynamicList({
    renderer: new BasicListRenderer({
        containerElement: basicContainer,
        renderItem: (item: ListItem) => {
            let product = item.data as Product;

            return product.title;
        }
    }),
    search: new Search({
        inputElement: search,
        fields: ['title']
    }),
    fetchCallbacks: {
        load: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
    },
    idField: 'id',
    noItemsText: 'There are currently no items.'
});

// @ts-ignore
window.basicList = list;