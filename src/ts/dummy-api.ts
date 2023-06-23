export interface Product {
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand: string
    category: string
    thumbnail: string
    images: string[]
}

export async function getRows(page = 1, limit = 20, query?: string) {
    let response = await fetch(`https://dummyjson.com/products${query ? '/search' : ''}?limit=${limit}&skip=${(page - 1) * limit}${query ? '&q=' + query : ''}`);
    let { products, total } = await response.json();

    // list.pagination.max = total / limit;

    return products as Product[];
}