export default class Orders {
    constructor(client) {
        this.client = client;
    }

    createOrder(payload) {
        const userId = payload.user_id
        delete payload.user_id
        return this.client.post(`/order/admin/${userId}`, payload);
    }

    getOrderById(id) {
        return this.client.get(`/order/admin/single${id}`);
    }

    getAllOrders() {
        return this.client.get('/order/admin/all');
    }

    updateOrderStatus(id, details) {
        return this.client.put(`/order/${id}/status`, details);
    }
    getOrder(user_id){
        return this.client.get(`/order/admin/all/${user_id}`);
    }

    updatePickupDetails(id, details) {
        return this.client.put(`/order/${id}/pickup`, details);
    }
}