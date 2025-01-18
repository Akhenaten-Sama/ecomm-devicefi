import React, { useState, useEffect } from "react";
import { Form, Input, Button, Tabs, Row, Col, Select, Avatar, Card, Modal } from "antd";
import { CameraOutlined, CopyOutlined } from "@ant-design/icons";
import api from "../../api"; // Import the API
import Header from "../Header/Header"; // Import Header
import Footer from "../Footer/Footer"; // Import Footer
import "./Profile.css";
import background from "../../assets/profilebackground.jpeg";

const { TabPane } = Tabs;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.user.fetchProfile();
      setProfile(response.data.data.user);
      form.setFieldsValue(response.data.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue(profile);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateProfile = async (values) => {
    delete values.email; // Remove email from the payload
    try {
      await api.user.updateProfile(values);
      fetchProfile();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", padding: "20px" }}>
        {/* Cover Section */}
        <div
          style={{
            backgroundImage: `url(${background})`,
            height: "300px",
            position: "relative",
            marginBottom: "30px",
          }}
        >
        </div>

        <Row  style={{ textAlign: "center",background:"white", boxShadow: "none", border: "1px solid #ddd" }} gutter={32}>
          {/* Left Section */}
          <Col span={8}>
            <Card
              style={{ textAlign: "center", boxShadow: "none", border: "1px solid #ddd" }}
              bodyStyle={{ padding: "20px" }}
            >
              {/* Profile Picture */}
              <Avatar
                size={100}
                src="https://via.placeholder.com/100"
                style={{ marginBottom: "10px" }}
              />
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                style={{
                  position: "absolute",
                  top: "140px",
                  left: "90px",
                  backgroundColor: "#fff",
                  border: "none",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              />
              <h3 style={{ marginBottom: "5px" }}>{profile?.first_name} {profile?.last_name}</h3>
              <p style={{ color: "#888" }}>{profile?.employment_details?.position || "N/A"}</p>

              {/* Statistics */}
              <div style={{ textAlign: "left", marginTop: "20px" }}>
                <p>
                 Email: <span style={{ color: "#fa541c" }}>{profile.email}</span>
                </p>
                
              </div>

              {/* Profile Link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <span>https://domain.com/user</span>
                <CopyOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
              </div>
            </Card>
          </Col>

          {/* Right Section */}
          <Col span={16}>
            <Tabs defaultActiveKey="1">
              {/* Account Settings Tab */}
              <TabPane tab="Account Settings" key="1">
                <Form
                  form={form}
                  layout="vertical"
                  style={{ marginTop: "20px" }}
                  onFinish={handleUpdateProfile}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="first_name" label="First Name">
                        <Input placeholder="First Name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="last_name" label="Last Name">
                        <Input placeholder="Last Name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="phone_number" label="Phone Number">
                        <Input placeholder="Phone Number" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label="Email Address">
                        <Input placeholder="Email Address" readOnly />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="city" label="City">
                        <Input placeholder="City" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="country" label="Country">
                        <Input placeholder="Country" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="state" label="State">
                        <Input placeholder="State" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="address" label="Address">
                        <Input placeholder="Address" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="employment_status" label="Employment Status">
                    <Select>
                      <Select.Option value="employed">Employed</Select.Option>
                      <Select.Option value="unemployed">Unemployed</Select.Option>
                    </Select>
                  </Form.Item>
                  {form.getFieldValue("employment_status") === "employed" && (
                    <>
                      <Form.Item name={["employment_details", "employer_name"]} label="Employer Name">
                        <Input placeholder="Employer Name" />
                      </Form.Item>
                      <Form.Item name={["employment_details", "employment_duration"]} label="Employment Duration (months)">
                        <Input placeholder="Employment Duration" />
                      </Form.Item>
                      <Form.Item name={["employment_details", "position"]} label="Position">
                        <Input placeholder="Position" />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item name={["income_details", "monthly_income"]} label="Monthly Income">
                    <Input placeholder="Monthly Income" />
                  </Form.Item>
                  <Form.Item name={["income_details", "additional_income"]} label="Additional Income">
                    <Input placeholder="Additional Income" />
                  </Form.Item>
                  <Form.Item name={["income_details", "income_source"]} label="Income Source">
                    <Input placeholder="Income Source" />
                  </Form.Item>
                  <Button type="primary" block htmlType="submit">
                    Update
                  </Button>
                </Form>
              </TabPane>

              {/* Additional Tabs (Placeholders) */}
              
            </Tabs>
          </Col>
        </Row>

        <Modal
          title="Update Profile"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item name="first_name" label="First Name">
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name">
              <Input />
            </Form.Item>
            <Form.Item name="phone_number" label="Phone Number">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
            <Form.Item name="employment_status" label="Employment Status">
              <Select>
                <Select.Option value="employed">Employed</Select.Option>
                <Select.Option value="unemployed">Unemployed</Select.Option>
              </Select>
            </Form.Item>
            {form.getFieldValue("employment_status") === "employed" && (
              <>
                <Form.Item name={["employment_details", "employer_name"]} label="Employer Name">
                  <Input />
                </Form.Item>
                <Form.Item name={["employment_details", "employment_duration"]} label="Employment Duration (months)">
                  <Input />
                </Form.Item>
                <Form.Item name={["employment_details", "position"]} label="Position">
                  <Input />
                </Form.Item>
              </>
            )}
            <Form.Item name={["income_details", "monthly_income"]} label="Monthly Income">
              <Input />
            </Form.Item>
            <Form.Item name={["income_details", "additional_income"]} label="Additional Income">
              <Input />
            </Form.Item>
            <Form.Item name={["income_details", "income_source"]} label="Income Source">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Profile;