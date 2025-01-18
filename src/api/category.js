
export default class Categories {
    constructor(client) {
        this.client = client;
    }

    getAllCategories() {
        return this.client.get('/device-category');
    }

    getCategoryById(id) {
        return this.client.get(`/device-category/${id}`);
    }
}