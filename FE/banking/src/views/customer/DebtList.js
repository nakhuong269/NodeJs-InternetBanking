import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Row,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  InputNumber,
} from "antd";
import {
  DeleteTwoTone,
  PlusSquareTwoTone,
  SendOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment/moment.js";
import { instance, parseJwt } from "../../utils.js";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const loadingIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const DebtList = ({ isSelf, parentCallback, cantEdit }) => {
  const [listDebt, setListDebt] = useState([]);

  const [listAccountNumber, setListAccountNumber] = useState([]);

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const [modelCancelRecipient, setModelCancelRecipient] = useState(false);

  const [modelAddRecipient, setModelAddRecipient] = useState(false);

  const [modelPaymentDebt, setModelPaymentDebt] = useState(false);

  const [recpientEdit, setRecipientEdit] = useState();

  const [itemSelected, setItemSelected] = useState();

  const [transactionID, setTrasactionID] = useState(0);

  const [formDelete] = Form.useForm();

  const [formAdd] = Form.useForm();

  const [formPaymentDebt] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const appendData = async () => {
    //Append data list debt
    setLoading(true);
    if (isSelf === true) {
      const resDebtListBySelf = await instance.get(
        `Customer/DebtRemind/GetListDebtRemindBySelf/${userId}`
      );
      if (resDebtListBySelf.data.success === true) {
        setListDebt(resDebtListBySelf.data.data);
      } else {
        setListDebt([]);
      }
    } else {
      const resDebtList = await instance.get(
        `Customer/DebtRemind/GetListDebtRemindByAnother/${userId}`
      );
      if (resDebtList.data.success === true) {
        setListDebt(resDebtList.data.data);
      } else {
        setListDebt([]);
      }
    }

    //Append data list AccountNumber
    const resAccountNumber = await instance.get(
      `Customer/GetListAccountPayment/${userId}`
    );
    if (resAccountNumber.data.success === true) {
      setListAccountNumber(
        resAccountNumber.data.data.map((record) => ({
          value: record.AccountNumber,
          label: record.AccountNumber,
          ID: record.ID,
        }))
      );
    } else {
      setListAccountNumber([]);
    }

    return setLoading(false);
  };

  useEffect(() => {
    appendData();
  }, []);

  useEffect(() => {
    if (!modelAddRecipient) {
      formAdd.resetFields();
    }
    if (!modelCancelRecipient) {
      formDelete.resetFields();
    }
  });

  const onCheckOTP = async (otp) => {
    const res = await instance.post(
      `generic/CheckOTP/${transactionID}?isDebtRemind=true&&idDebt=${itemSelected}`,
      {
        OTP: otp,
      }
    );
    if (res.data.success === true) {
      success("Payment debt successfully", res.data.message);
      appendData();
      setModelPaymentDebt(false);
    } else {
      error("Payment debt failed", res.data.message);
    }
  };

  const confirmDelete = async (id) => {
    setModelCancelRecipient(false);
    const res = await instance.delete(
      `customer/DebtRemind/${userId}/${recpientEdit}`
    );
    if (res.data.success === true) {
      success("Cancel debt", res.data.message);
      appendData();
    } else {
      error("Cancel debt", res.data.message);
    }
  };

  const CreateDebt = async (paramsAdd) => {
    const res = await instance.post(`customer/DebtRemind`, {
      AccountPaymentSend: paramsAdd.AccountNumberSend.value,
      AccountPaymentReceive: paramsAdd.stkAdd,
      Amount: paramsAdd.AmountAdd,
      Content: paramsAdd.contentAdd,
    });
    if (res.data.success === true) {
      setModelAddRecipient(false);
      success("Create a debt", res.data.message);
      appendData();
    } else {
      error("Create a debt", res.data.message);
    }
  };

  const onFillFormCancel = (item) => {
    formDelete.setFieldsValue({
      stkCancel: item.AccountPaymentReceive,
      amountCancel: item.Amount,
      contentCancel: item.Content,
    });
  };

  const onFillFormPaymentDebt = (item) => {
    formPaymentDebt.setFieldsValue({
      stkCancel: item.AccountPaymentReceive,
      amountCancel: item.Amount,
      contentCancel: item.Content,
    });
  };

  const onFillFormAdd = () => {
    formAdd.setFieldsValue({
      AccountNumberSend: listAccountNumber[0],
    });
  };

  const onPaymentDebt = async (id) => {
    setLoading(true);
    const res = await instance.post(`customer/DebtRemind/Payment/${id}`);
    if (res.data.success === true) {
      setModelPaymentDebt(true);
      setTrasactionID(res.data.data[0]);
    } else {
      error("Payment debt failed", res.data.message);
    }
    setLoading(false);
  };

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

  const sendData = (item) => {
    parentCallback(item);
  };

  return (
    <div>
      <Spin indicator={loadingIcon} spinning={loading}>
        <Row type="flex" justify="center" align="middle">
          <Modal
            title={
              <div style={{ textAlign: "center" }}>
                <h2>Add Debt</h2>
              </div>
            }
            width={350}
            open={modelAddRecipient}
            forceRender
            onCancel={() => setModelAddRecipient(false)}
            footer={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  style={{ minWidth: 70, width: "auto" }}
                  onClick={() => formAdd.submit()}
                >
                  Send debt
                </Button>
                <Button
                  onClick={() => {
                    setModelAddRecipient(false);
                  }}
                  style={{ minWidth: 70, width: 80 }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <Form
              form={formAdd}
              onFinish={(value) => {
                CreateDebt(value);
                formAdd.resetFields();
              }}
            >
              <Form.Item
                {...formItemLayout}
                name="AccountNumberSend"
                label="From"
              >
                <Select
                  style={{
                    minWidth: 160,
                  }}
                  options={listAccountNumber}
                ></Select>
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="stkAdd"
                label="To"
                rules={[
                  {
                    required: true,
                    message: "Please input account number",
                  },
                ]}
              >
                <Input
                  placeholder="Please input account number debt"
                  name="nameAdd"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="AmountAdd" label="Amount">
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Please inputs amount"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="contentAdd" label="Content">
                <Input
                  placeholder="Please inputs content"
                  name="nameAdd"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title={
              <div style={{ textAlign: "center" }}>
                <h2>Confirm Payment Debt</h2>
              </div>
            }
            width={350}
            open={modelPaymentDebt}
            forceRender
            onCancel={() => setModelPaymentDebt(false)}
            footer={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  style={{ minWidth: 70, width: 150 }}
                  onClick={() => {
                    formPaymentDebt.submit();
                  }}
                >
                  Payment Debt
                </Button>
                <Button
                  onClick={() => {
                    setModelPaymentDebt(false);
                  }}
                  style={{ minWidth: 70, width: 150 }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <Form
              form={formPaymentDebt}
              onFinish={(value) => {
                onCheckOTP(value.OtpCode);
                formPaymentDebt.resetFields();
              }}
            >
              <Form.Item {...formItemLayout} name="stkCancel" label="To">
                <Input
                  disabled
                  placeholder="Please input your name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="amountCancel" label="Amount">
                <Input
                  disabled
                  placeholder="Please inputs nick name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="contentCancel"
                label="Content"
              >
                <Input
                  disabled
                  placeholder="Please inputs nick name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="OtpCode"
                label="OTP"
                rules={[
                  {
                    required: true,
                    message: "Please input otp to complete debt payment",
                  },
                ]}
              >
                <Input
                  placeholder="Please inputs otp"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title={
              <div style={{ textAlign: "center" }}>
                <h2>Confirm Cancel Debt</h2>
              </div>
            }
            width={350}
            open={modelCancelRecipient}
            forceRender
            onCancel={() => setModelCancelRecipient(false)}
            footer={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  danger
                  style={{ minWidth: 70, width: 80 }}
                  onClick={() => {
                    formDelete.submit();
                    confirmDelete(recpientEdit);
                  }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setModelCancelRecipient(false);
                  }}
                  style={{ minWidth: 70, width: 80 }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <Form form={formDelete}>
              <Form.Item
                {...formItemLayout}
                name="stkCancel"
                label="To"
                rules={[
                  {
                    required: true,
                    message: "Please input account number",
                  },
                ]}
              >
                <Input
                  disabled
                  placeholder="Please input your name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="amountCancel" label="Amount">
                <Input
                  disabled
                  placeholder="Please inputs nick name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="contentCancel"
                label="Content"
              >
                <Input
                  disabled
                  placeholder="Please inputs nick name"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
            </Form>
          </Modal>
          <div>
            {cantEdit && (
              <div style={{ textAlign: "right", margin: 20 }}>
                <Button
                  icon={
                    <PlusSquareTwoTone size="large" twoToneColor="#52c41a" />
                  }
                  type="primary"
                  ghost
                  size="large"
                  onClick={() => {
                    setModelAddRecipient(true);
                    onFillFormAdd();
                  }}
                >
                  Add Debt
                </Button>
              </div>
            )}
            <div
              id="scrollableDiv"
              style={{
                minWidth: 350,
                minHeight: 400,
                height: 450,
                overflow: "auto",
                background: "#F8F8FF",
                border: "1px solid #e8e8e8",
                borderRadius: 4,
              }}
            >
              <List
                dataSource={listDebt}
                renderItem={(item) => (
                  <List.Item
                    key={item.ID}
                    onClick={() => {
                      setItemSelected(item.ID);
                      if (parentCallback) {
                        sendData(item);
                      }
                    }}
                    style={(() =>
                      item.ID === itemSelected
                        ? {
                            background: "#32CD32",
                          }
                        : {
                            background: "#F8F8FF",
                          })()}
                  >
                    <div>
                      {isSelf ? (
                        <div>
                          <strong>To: </strong>
                          {item.AccountPaymentReceive}
                        </div>
                      ) : (
                        <div>
                          <strong>From: </strong>
                          {item.AccountPaymentSend}
                        </div>
                      )}
                      <div>
                        <strong>Content: </strong>
                        {item.Content}
                      </div>
                      <div>
                        <strong>Amount: </strong>
                        {item.Amount.toLocaleString().replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                      </div>
                      <div>
                        <strong>Date: </strong>
                        {moment(item.CreatedDate).format("HH:mm:ss DD/MM/YYYY")}
                      </div>
                    </div>
                    <div style={{ marginRight: -15 }}>
                      {cantEdit && (
                        <Button
                          icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                          type="ghost"
                          size="large"
                          onClick={() => {
                            setModelCancelRecipient(true);
                            onFillFormCancel(item);
                            setRecipientEdit(item.ID);
                          }}
                        ></Button>
                      )}
                      {!cantEdit && (
                        <>
                          <Button
                            icon={<SendOutlined twoToneColor="#eb2f96" />}
                            type="ghost"
                            size="large"
                            onClick={() => {
                              onPaymentDebt(item.ID);
                              onFillFormPaymentDebt(item);
                            }}
                          ></Button>

                          <Button
                            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                            type="ghost"
                            size="large"
                            onClick={() => {
                              setModelCancelRecipient(true);
                              onFillFormCancel(item);
                              setRecipientEdit(item.ID);
                            }}
                          ></Button>
                        </>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Row>
      </Spin>
    </div>
  );
};
export default DebtList;
