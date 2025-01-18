export default class Catalog {
    constructor(client) {
        this.client = client;
    }

    getAllDevices() {
        return this.client.get('/device-catalog');
    }

    getDevicesByCategory(category_id) {
        return this.client.get(`/device-catalog?category_id=${category_id}`);
    }

    getCatalogById(id) {
        return this.client.get(`/device-catalog/${id}`);
    }
}