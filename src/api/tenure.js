export default class Lender {
    constructor(client) {
        this.client = client;
    }

    getAvailableLender(price) {
        return this.client.get(`/lender/available/${price}`);
    }

    getTenureById(id) {
        return this.client.get(`/tenure/${id}`);
    }
}