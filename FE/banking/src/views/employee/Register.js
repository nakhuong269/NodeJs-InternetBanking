import React, { useState } from "react";
import { Button, Form, Input, notification, Spin, Row } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "../../Assets/CSS/Register.css";
import { instance } from "../../utils";

function Register(props) {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const openNotification = (info) => {
    notification.open({
      duration: 0,
      message: "Register account",
      description: (
        <div>
          <p>Register successfully!</p>
          <strong>Account number: {info.Phone}</strong>
        </div>
      ),
    });
  };

  const loadData = async function (values) {
    setLoading(true);
    const res = await instance.post(`account/register`, {
      Name: values.fullname,
      IDCard: values.cmnd,
      Email: values.email,
      Phone: values.phone,
    });

    if (res.data.success === true) {
      openNotification(res.data.data);
    }
    setLoading(false);
  };

  return (
    <Row type="flex" justify="center" align="middle">
      <Form
        name="register"
        className="register-form"
        style={{
          width: 400,
          background: "#001529",
          padding: 30,
          borderRadius: 10,
          minWidth: 200,
        }}
        onFinish={loadData}
        form={form}
      >
        <div>
          <Form.Item noStyle>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "white", fontSize: 32 }}>Register</h1>
            </div>
          </Form.Item>
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Please input your FullName!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="FullName"
              size="large"
              autoComplete="off"
            ></Input>
          </Form.Item>
          <Form.Item
            name="cmnd"
            rules={[{ required: true, message: "Please input your ID Card!" }]}
          >
            <Input
              prefix={<IdcardOutlined className="site-form-item-icon" />}
              placeholder="Your Identity"
              size="large"
              autoComplete="off"
            ></Input>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
              autoComplete="off"
            ></Input>
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone"
              size="large"
              autoComplete="off"
            ></Input>
          </Form.Item>
          <Form.Item>
            <Spin spinning={loading}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                size="large"
                block
                onClick={() => form.submit()}
              >
                Register
              </Button>
            </Spin>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              danger
              htmlType="button"
              className="login-form-button"
              size="large"
              block
              onClick={() => form.resetFields()}
            >
              Clear
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Row>
  );
}
export default Register;
