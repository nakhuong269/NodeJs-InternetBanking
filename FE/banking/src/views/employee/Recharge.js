import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  notification,
  Spin,
  InputNumber,
} from "antd";
import { instance, parseJwt } from "../../utils.js";

function Recharge() {
  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const [data, setData] = useState([]);

  // Loading...
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const appendData = async () => {
    const res = await instance.get(`Customer/GetListAccountPayment/${userId}`);
    if (res.data.success === true) {
      setData(
        res.data.data.map((record, index) => ({
          value: index,
          label: record.AccountNumber,
          ID: record.ID,
          accountBalance: record.Balance,
        }))
      );
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };

  //Submit Form
  const onFinish = async (values) => {
    setLoading(true);
    console.log(data);
    const res = await instance.post(`employee/recharge`, {
      BankID: 1,
      AccountPaymentSend: data[0].label,
      AccountPaymentReceive: values.AccountNumber,
      Amount: values.Amount,
      Content: "Employee recharge",
      PaymentFeeTypeID: 1,
      TransactionTypeID: 1,
    });
    if (res.data.success === true) {
      openNotificationWithIcon("success", res.data.message);
    } else {
      openNotificationWithIcon("error", res.data.message);
    }
    setLoading(false);
    onReset();
  };

  //Reset Form
  const onReset = () => {
    form.resetFields();
  };

  return (
    <Row type="flex" justify="center" align="middle">
      {contextHolder}
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        size="large"
        style={{
          width: 400,
          background: "#001529",
          padding: 40,
          borderRadius: 10,
          minWidth: 200,
          margin: 50,
        }}
      >
        <Form.Item noStyle>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "white", fontSize: 32, paddingBottom: 10 }}>
              Recharge
            </h1>
          </div>
        </Form.Item>
        <Form.Item
          name="AccountNumber"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Username or Account number" />
        </Form.Item>
        <Form.Item
          name="Amount"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            placeholder="Amount"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ minWidth: 100, width: 320 }}
          />
        </Form.Item>

        <Form.Item>
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit" block>
              Confirm Recharge
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Row>
  );
}
export default Recharge;
