import React, { useState } from "react";
import { Button, Form, Input, Alert, Card, Row } from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import "../../Assets/CSS/Register.css";
import { instance, parseJwt } from "../../utils";
import { useEffect } from "react";

function ChangePassword(props) {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [failed, setFailed] = useState(false);

  const loadData = async function (values) {
    try {
      const token = parseJwt(localStorage.App_AccessToken);
      setLoading(true);

      const res = await instance.patch(`Account/ChangePassword`, {
        userId: token.id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });

      if (res.data.status === 200) {
        setFailed(false);
      } else {
        setFailed(true);
      }
      setMessage(res.data.message);
      return setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="center-screen">
      <Row type="flex" justify="center" align="middle">
        <Card
          title="Change password"
          headStyle={{ background: "#20B2AA", textAlign: "center" }}
        >
          <Form
            name="register"
            className="register-form"
            style={{ width: 300 }}
            onFinish={(e) => loadData(e)}
          >
            <Form.Item
              name="currentPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                type="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Current Password"
                size="middle"
                autoComplete="off"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              ></Input.Password>
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your confirm new password!",
                },
              ]}
            >
              <Input.Password
                type="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Current Password"
                size="middle"
                autoComplete="off"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              ></Input.Password>
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password
                type="password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="New Password"
                size="middle"
                autoComplete="off"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              ></Input.Password>
            </Form.Item>

            {message && (
              <Form.Item>
                {failed ? (
                  <Alert message={message} type="error" />
                ) : (
                  <Alert message={message} type="success" />
                )}
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                size="large"
                block
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </div>
  );
}
export default ChangePassword;
