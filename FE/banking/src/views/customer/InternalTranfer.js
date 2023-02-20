import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Row,
  Form,
  Input,
  Card,
  Popover,
  Select,
  Spin,
  Result,
  Modal,
  InputNumber,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { instance, parseJwt } from "../../utils.js";
import ListRecipient from "./ListRecipient.js";
import { StoreContext } from "../../contexts/AppContext.js";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment.js";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const Tranfer = ({ nextCurrent }) => {
  const { transaction } = useContext(StoreContext);

  const callbackFunction = (childData) => {
    setInforRecipient(childData.AccountNumber);
  };
  const [inforBalance, setInforBalance] = useState([]);

  const [inforRecipient, setInforRecipient] = useState("");

  const [inforPaymentFeeType, setInforPaymentFeeType] = useState([]);

  const [inforPaymentFeeTypeID, setInforPaymentFeeTypeID] = useState();

  const [form] = Form.useForm();

  const [accountNumberSelected, setAccountNumberSelected] = useState(0);

  const [loadingTranfer, setLoadingTranfer] = useState(false);

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const onTranfer = async (values) => {
    setLoadingTranfer(true);
    try {
      const res = await instance.post(`generic/InternalTransfer`, {
        AccountPaymentSend: values.send_STK.label,
        Amount: values.send_Money,
        AccountPaymentReceive: values.receive_STK,
        Content: values.content,
        PaymentFeeTypeID: values.paymentFeeTypeID,
        TransactionTypeID: 1,
        BankID: 1,
      });

      console.log(res);

      if (res.data.success === true) {
        transaction[1](res.data.data[0]);
        nextCurrent();
      }
      return setLoadingTranfer(false);
    } catch {
      setLoadingTranfer(false);
    }
  };

  const appendData = async () => {
    const res = await instance.get(`Customer/GetListAccountPayment/${userId}`);
    if (res.data.success === true) {
      setInforBalance(
        res.data.data.map((item, index) => ({
          value: index,
          label: item.AccountNumber,
          ID: item.ID,
          accountBalance: item.Balance,
        }))
      );
    }
    const resPaymentFeeType = await instance.get(`generic/ListPaymentType`);
    if (resPaymentFeeType.data.success === true) {
      setInforPaymentFeeType(
        resPaymentFeeType.data.data.map((item) => ({
          value: item.ID,
          label: item.Name,
        }))
      );
      setInforPaymentFeeTypeID(resPaymentFeeType.data.data[0].ID);
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  useEffect(() => {
    if (inforBalance.length !== 0) {
      form.setFieldsValue({
        send_STK: inforBalance[accountNumberSelected],
        paymentFeeTypeID: inforPaymentFeeTypeID,
        receive_STK: inforRecipient,
        send_Money: 0,
        balance: inforBalance[accountNumberSelected].accountBalance
          .replace(/\$\s?|(,*)/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      });
    }
  }, [
    inforBalance,
    inforPaymentFeeTypeID,
    inforRecipient,
    accountNumberSelected,
  ]);

  return (
    <Row type="flex" justify="center" align="middle">
      <Form
        form={form}
        onFinish={(values) => {
          onTranfer(values);
        }}
      >
        <Card
          type="inner"
          title="Sender Information"
          style={{ marginBottom: 10 }}
          headStyle={{ background: "#20B2AA" }}
        >
          <Form.Item noStyle>
            <h4>Payment Account</h4>
          </Form.Item>
          <Form.Item name="send_STK">
            <Select
              style={{
                width: 300,
              }}
              options={inforBalance}
              onChange={(index) => {
                setAccountNumberSelected(index);
              }}
            ></Select>
          </Form.Item>
          <Form.Item noStyle>
            <p>Available Balances</p>
          </Form.Item>
          <Form.Item name="balance">
            <Input
              style={{
                width: 300,
              }}
            />
          </Form.Item>
        </Card>
        <Card
          type="inner"
          title="Recipient Information"
          style={{ marginBottom: 10 }}
          headStyle={{ background: "#20B2AA" }}
        >
          <Form.Item name="receive_STK">
            <Input
              placeholder="Enter/ Select the recipient"
              allowClear
              style={{
                width: 300,
              }}
              suffix={
                <Popover
                  content={
                    <ListRecipient
                      parentCallback={callbackFunction}
                      isSelect={true}
                    />
                  }
                  title="Choose a recipient"
                  trigger="click"
                  zIndex={10}
                  placement="rightTop"
                >
                  <UserOutlined />
                </Popover>
              }
            />
          </Form.Item>
        </Card>
        <Card
          type="inner"
          title="Transaction Information"
          headStyle={{ background: "#20B2AA" }}
        >
          <Form.Item name="send_Money">
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ minWidth: 300, width: 250 }}
            />
          </Form.Item>
          <Form.Item name="paymentFeeTypeID">
            <Select
              style={{
                width: 300,
              }}
              options={inforPaymentFeeType}
            ></Select>
          </Form.Item>
          <Form.Item name="content">
            <Input
              placeholder="Content"
              style={{
                width: 300,
              }}
            />
          </Form.Item>
        </Card>
        <Form.Item style={{ textAlign: "center", marginTop: 15 }}>
          <Spin spinning={loadingTranfer}>
            <Button
              type="primary"
              block
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Row>
  );
};

const VerifyOTP = ({ nextCurrent }) => {
  const { transaction } = useContext(StoreContext);

  const [form] = Form.useForm();

  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);

  const onCheckOTP = async (otp) => {
    setLoadingVerifyOTP(true);
    const res = await instance.post(`generic/CheckOTP/${transaction[0]}`, {
      OTP: otp.otp,
    });
    if (res.data.success === true) {
      setLoadingVerifyOTP(false);
      nextCurrent();
    }
    return setLoadingVerifyOTP(false);
  };

  return (
    <Row type="flex" justify="center" align="middle">
      <Form form={form} onFinish={(otp) => onCheckOTP(otp)}>
        <Card
          type="inner"
          title="Verify OTP Code"
          style={{ marginBottom: 10 }}
          headStyle={{ background: "#20B2AA" }}
        >
          <Form.Item noStyle>
            <h4>Please input OTP code to verify transaction</h4>
          </Form.Item>

          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please input OTP code to verify transaction!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginTop: 15 }}>
            <Spin spinning={loadingVerifyOTP}>
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
              >
                Submit
              </Button>
            </Spin>
          </Form.Item>
        </Card>
      </Form>
    </Row>
  );
};

const ResultTransaction = () => {
  const navigate = useNavigate();

  const { transaction } = useContext(StoreContext);

  const [result, setResult] = useState();

  const [formEdit] = Form.useForm();

  const [modelEditRecipient, setModelEditRecipient] = useState(false);

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const [reccipientInfo, setRecipientInfor] = useState();

  const success = (title, content) => {
    Modal.success({
      title: title,
      content: content,
    });
  };

  const error = (title, content) => {
    Modal.error({
      title: title,
      content: content,
    });
  };

  const confirmAdd = async (userId, paramsAdd) => {
    const res = await instance.post(`Customer/Recipient`, {
      AccountNumber: paramsAdd.stkEdit,
      Name: paramsAdd.nameEdit,
      AccountID: userId,
      BankID: 1,
    });
    if (res.data.success === true) {
      success("Add recipient", res.data.message);
    } else {
      error("Add recipient", res.data.message);
    }
  };

  const getData = async () => {
    const res = await instance.get(`generic/Transaction/${transaction[0]}`);
    if (res.data.success === true) {
      setResult(res.data.data[0]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFillModalAdd = async () => {
    const res = await instance.get(
      `generic/GetInfoUser/${result.AccountPaymentReceive}`
    );
    if (res.data.success === true) {
      setRecipientInfor(res.data.data[0]);

      formEdit.setFieldsValue({
        stkEdit: res.data.data[0].AccountNumber,
        nameEdit: res.data.data[0].Name,
      });
    }
  };

  return (
    <>
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <h2>Add Recipient</h2>
          </div>
        }
        width={350}
        open={modelEditRecipient}
        forceRender
        onCancel={() => setModelEditRecipient(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              style={{ minWidth: 70, width: 80 }}
              onClick={() => {
                formEdit.submit();
              }}
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setModelEditRecipient(false);
              }}
              style={{ minWidth: 70, width: 80 }}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <Form
          form={formEdit}
          onFinish={(value) => {
            confirmAdd(userId, value);
          }}
        >
          <Form.Item
            {...formItemLayout}
            name="stkEdit"
            label="Account number"
            rules={[
              {
                required: true,
                message: "Please input account number",
              },
            ]}
          >
            <Input
              placeholder="Please input your name"
              name="stkEdit"
              style={{ minWidth: 160 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="nameEdit" label="Nickname">
            <Input
              placeholder="Please inputs nick name"
              name="nameEdit"
              style={{ minWidth: 160 }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Result
        status="success"
        title="Transaction Successfully"
        style={{ minHeight: 750 }}
        subTitle={
          result && (
            <div>
              <h1 style={{ padding: 0, margin: 0 }}>
                {result.Amount.toLocaleString().replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}
              </h1>
              <p></p>
              <div style={{ padding: 0, margin: 0 }}>
                <h3>
                  {moment(result.CreatedDate).format("HH:mm:ss DD/MM/YYYY")}
                </h3>
              </div>

              {/* <Row>
                <h4 style={{ padding: 0, margin: 0 }}>
                  Name: {result.TransactionType}
                </h4>
              </Row> */}
              <div>
                <Row>
                  <h4 style={{ padding: 0, margin: 0 }}>
                    From: {result.AccountPaymentSend}
                  </h4>
                </Row>
                <Row>
                  <h4 style={{ padding: 0, margin: 0 }}>
                    To: {result.AccountPaymentReceive}
                  </h4>
                </Row>
                <Row>
                  <h4 style={{ padding: 0, margin: 0 }}>
                    Transaction ID: {transaction[0]}
                  </h4>
                </Row>
                <Row>
                  <h4 style={{ padding: 0, margin: 0 }}>
                    Content: {result.Content}
                  </h4>
                </Row>
              </div>
            </div>
          )
        }
        extra={[
          <div style={{ width: 350 }}>
            <Button type="primary" key="home" onClick={() => navigate("/")}>
              Home
            </Button>
            ,
            <Button
              key="transactionhistory"
              onClick={() => navigate("/transactionhistory")}
            >
              Transaction History
            </Button>
            ,
            <Button
              key="saverecipient"
              onClick={() => {
                setModelEditRecipient(true);
                onFillModalAdd();
              }}
            >
              Save Recipient
            </Button>
          </div>,
        ]}
      />
    </>
  );
};

const InternalTranfer = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };
  const steps = [
    {
      title: "Transfers",
      content: <Tranfer nextCurrent={next} />,
    },
    {
      title: "Verify OTP",
      content: <VerifyOTP nextCurrent={next} />,
    },
    {
      title: "Last",
      content: <ResultTransaction />,
    },
  ];

  // const items = steps.map((item) => ({
  //   key: item.title,
  //   title: item.title,
  // }));
  return (
    <>
      <div
        id="scrollableDiv"
        style={{
          zIndex: 1,
          overflow: "auto",
        }}
      >
        <Row type="flex" justify="center" align="middle">
          <Card
            title="Internal Tranfer"
            headStyle={{
              background: "#20B2AA",
              textAlign: "center",
            }}
          >
            <div className="steps-content">{steps[current].content}</div>
          </Card>
        </Row>
      </div>
    </>
  );
};
export default InternalTranfer;
