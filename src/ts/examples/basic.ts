import FlexList from "@everbit-software/flex-list/src/flex-list";
import { ListItem } from "@everbit-software/flex-list/src/list-item";
import { Product, getRows } from "../dummy-api";
import { BasicListRenderer } from "@everbit-software/flex-list/src/renderers/basic-list-renderer";
import { Search } from "@everbit-software/flex-list/src/search";

const basicContainer = document.querySelector('#basicContainer') as HTMLDivElement;
const search = document.querySelector('#basicSearch') as HTMLInputElement;

let list = new FlexList({
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
    itemCallbacks: {
        load: async (page, limit) => getRows(page, limit),
        search: async (query, page, limit) => getRows(page, limit, query),
    },
    idField: 'id',
    noItemsText: 'There are currently no items.'
});

// @ts-ignore
window.basicList = list;