import User from "./user";

export default class Documents {
    constructor(client) {
        this.client = client;
    }
    submitSingleDocument(payload){
        const userId=payload.user_id
        const applicationId= payload.application_id
        delete payload.user_id
        delete payload.application_id
        return this.client.post(`/documents/${userId}/${applicationId}/single`, payload)
    }

    getRequiredDocuments(applicationId) {
        return this.client.get(`/documents/admin/requirements/${applicationId}`);
    }

    getApplicationDocuments(applicationId) {
        return this.client.get(`/documents/admin/${applicationId}`);
    }
    submitDocuments(applicationId, payload) {
        return this.client.post(`/documents/${applicationId}/submit`,payload)
    }

    uploadDocument(payload) {
        return this.client.post(`/utils/upload/files`, payload);
    }

    
}