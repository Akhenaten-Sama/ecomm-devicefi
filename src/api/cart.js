export default class Cart {
    constructor(client) {
        this.client = client;
    }

    createCart(payload) {
        return this.client.post('/Cart/items', payload);
    }

    updateCartItem(payload) {
        const id = payload.device_id;
        delete payload.device_id;


        return this.client.put(`/cart/items${id}`, payload);
    }

    removeCartItem(id) {
        return this.client.put(`/cart/items/remove/${id}`,);
    }
    emptyCart() {
        return this.client.delete(`/cart`);
    }

    selectLender(){
        return this.client.post(`/cart/lender`, {
            lender_id: "146893ad-e48a-40df-b6d8-ac464c57992f",
            lending_period: 12,
        })
    }

    getCart() {
        return this.client.get(`/cart`);
    }
}