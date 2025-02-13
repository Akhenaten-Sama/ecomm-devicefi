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

    selectLender(body){
        console.log(body)
        const userId = body.user_id
        delete body.min_loan_amount 
        delete body.max_loan_amount
        delete body.user_id
        return this.client.post(`/cart/lender/admin/${userId}`, {
            ...body
        })
    }

    getCart(user_id) {
        return this.client.get(`/cart/admin/${user_id}`);
    }
}