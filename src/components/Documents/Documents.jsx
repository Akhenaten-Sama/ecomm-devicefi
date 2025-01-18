import React, { useState, useEffect } from 'react';
import { Button, Upload, message, List, Typography } from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../../api'; // Import the API
import './Documents.css';

const { Title } = Typography;

const Documents = ({ applicationId }) => {
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequiredDocuments();
    fetchSubmittedDocuments();
  }, []);

  const fetchRequiredDocuments = async () => {
    try {
      const response = await api.document.getRequiredDocuments(applicationId);
      setRequiredDocuments(response.data.data);
    } catch (error) {
      console.error('Error fetching required documents:', error);
    }
  };

  const fetchSubmittedDocuments = async () => {
    try {
      const response = await api.document.getApplicationDocuments(applicationId);
      setSubmittedDocuments(response.data.data);
    } catch (error) {
      console.error('Error fetching submitted documents:', error);
    }
  };

  const handleUpload = async (file, doc) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await api.document.uploadDocument(formData);
      setUploadedFiles((prev) => ([
        ...prev,
        {
          type: doc.document_type,
          metadata: {
            document_type: "",
            issue_date: ""
          },
          document_url: response.data.data.urls[0]
        }
      ]));
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading document:', error);
      message.error(`${file.name} upload failed`);
    }
  };

  const handleSubmitDocuments = async () => {
    setLoading(true);
    try {
      await api.document.submitDocuments(applicationId, { documents: uploadedFiles });
      message.success('Documents submitted successfully');
      fetchSubmittedDocuments();
    } catch (error) {
      console.error('Error submitting documents:', error);
      message.error('Error submitting documents');
    } finally {
      setLoading(false);
    }
  };

  console.log(submittedDocuments)
  const isDocumentSubmitted = (docType) => {
    return submittedDocuments.documents?.some(doc => doc.document_type === docType);
  };

  return (
    <div className="documents-container">
      <Title level={3}>Documents Verification</Title>
      <span>Please Upload your the listed documents here.</span>
      <div className="required-documents">
        <Title level={4}>Required Documents</Title>
        <List
          dataSource={requiredDocuments}
          renderItem={(doc) => (
            <List.Item style={{ paddingLeft: 10, paddingRight: 10 }} className="document-item">
              <span>{doc.name}</span>
              <div className="upload-section">
                <Upload
                  beforeUpload={(file) => {
                    handleUpload(file, doc);
                    return false;
                  }}
                  showUploadList={false}
                  disabled={isDocumentSubmitted(doc.document_type)}
                >
                  <Button icon={<UploadOutlined />} disabled={isDocumentSubmitted(doc.document_type)}>
                    Upload
                  </Button>
                </Upload>
                {isDocumentSubmitted(doc.document_type) && <CheckCircleOutlined className="checkmark-icon" />}
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className="submitted-documents">
        <Title level={4}>Submitted Documents</Title>
        <List
          dataSource={submittedDocuments.documents}
          renderItem={(doc) => (
            <List.Item style={{ paddingLeft: 10, paddingRight: 10 }} className="document-item">
              <span>{doc.requirement.name}</span>
              <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </List.Item>
          )}
        />
      </div>

      <Button
        type="primary"
        onClick={handleSubmitDocuments}
        loading={loading}
        disabled={Object.keys(uploadedFiles).length === 0}
      >
        Submit Documents
      </Button>
    </div>
  );
};

export default Documents;