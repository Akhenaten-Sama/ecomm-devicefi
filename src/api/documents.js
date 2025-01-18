export default class Documents {
    constructor(client) {
        this.client = client;
    }

    getRequiredDocuments(applicationId) {
        return this.client.get(`/documents/requirements/${applicationId}`);
    }

    getApplicationDocuments(applicationId) {
        return this.client.get(`/documents/${applicationId}`);
    }
    submitDocuments(applicationId, payload) {
        return this.client.post(`/documents/${applicationId}/submit`,payload)
    }

    uploadDocument(payload) {
        return this.client.post(`/utils/upload/files`, payload);
    }

    
}