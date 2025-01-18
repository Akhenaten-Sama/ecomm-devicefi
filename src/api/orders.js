export default class Orders {
    constructor(client) {
        this.client = client;
    }

    createOrder(payload) {
        return this.client.post('/order', payload);
    }

    getOrderById(id) {
        return this.client.get(`/order/${id}`);
    }

    getAllOrders() {
        return this.client.get('/order/admin/all');
    }

    updateOrderStatus(id, details) {
        return this.client.put(`/order/${id}/status`, details);
    }
    getOrder(){
        return this.client.get('/order');
    }

    updatePickupDetails(id, details) {
        return this.client.put(`/order/${id}/pickup`, details);
    }
}