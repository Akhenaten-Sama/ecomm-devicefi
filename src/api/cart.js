export default class Cart {
    constructor(client) {
        this.client = client;
    }

    createCart(payload) {
       const  userId = payload.user_id
       delete payload.user_id
        return this.client.post(`/cart/items/admin/${userId}`, payload);
    }

    updateCartItem(payload) {
        const id = payload.device_id;
        const userId = payload.user_id;
        delete payload.device_id;
        delete payload.user_id;


        return this.client.put(`/cart/items/${id}admin/${userId}}`, payload);
    }

    removeCartItem(id, userId) {
        return this.client.put(`/cart/items/remove/${id}/admin/${userId}`,);
    }
    emptyCart(user_id) {
        return this.client.delete(`/cart/admin/${user_id}`);
    }

    selectLender(user_id){
        return this.client.post(`/cart/lender/admin/${user_id}`, {
            lender_id: "146893ad-e48a-40df-b6d8-ac464c57992f",
            lending_period: 12,
        })
    }

    getCart(user_id) {
        return this.client.get(`/cart/admin/${user_id}`);
    }
}