import React, { useEffect, useState } from "react";
import {
  List,
  Button,
  Row,
  Modal,
  Form,
  Input,
  Popconfirm,
  Select,
  Avatar,
  Spin,
} from "antd";
import {
  UserOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusSquareTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { instance, parseJwt } from "../../utils.js";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
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

const ListRecipient = (props) => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [bankReference, setBankReference] = useState();

  const [modelEditRecipient, setModelEditRecipient] = useState(false);

  const [modelAddRecipient, setModelAddRecipient] = useState(false);

  const [recpientEdit, setRecipientEdit] = useState();

  const [itemSelected, setItemSelected] = useState();

  const [formEdit] = Form.useForm();

  const [formAdd] = Form.useForm();

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const appendData = async () => {
    // get list recipient
    setLoading(true);
    const res = await instance.get(`Customer/GetListRecipient/${userId}`, {});
    if (res.data.success === true) {
      setData(res.data.data);
    } else {
      setData([]);
    }

    // get list bank
    const resBankReference = await instance.get(`generic/ListBank`);
    if (resBankReference.data.success === true) {
      setBankReference(
        resBankReference.data.data.map((item) => ({
          value: item.ID,
          label: item.Name,
        }))
      );
    } else {
      setBankReference([]);
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
    if (!modelEditRecipient) {
      formEdit.resetFields();
    }
  });

  const confirmDelete = async (id) => {
    const res = await instance.delete(`Customer/Recipient/${id}`, {});
    if (res.data.success === true) {
      success("Delete recipient", res.data.message);
      appendData();
    } else {
      error("Delete recipient", res.data.message);
    }
  };

  const confirmUpdate = async (id, paramsUpdate) => {
    const res = await instance.patch(`customer/recipient/${id}`, {
      AccountNumber: paramsUpdate.stkEdit,
      Name: paramsUpdate.nameEdit,
      BankID: paramsUpdate.bankEdit,
    });
    if (res.data.success === true) {
      setModelEditRecipient(false);
      success("Update recipient", res.data.message);
      appendData();
    } else {
      error("Update recipient", res.data.message);
    }
  };

  const confirmAdd = async (userId, paramsAdd) => {
    const res = await instance.post(`Customer/Recipient`, {
      AccountNumber: paramsAdd.stkAdd,
      Name: paramsAdd.nameAdd,
      AccountID: userId,
      BankID: paramsAdd.bankAdd,
    });
    if (res.data.success === true) {
      setModelAddRecipient(false);
      success("Add recipient", res.data.message);
      appendData();
    } else {
      error("Add recipient", res.data.message);
    }
  };

  const onFillFormEdit = (item) => {
    formEdit.setFieldsValue({
      stkEdit: `${item.AccountNumber}`,
      nameEdit: `${item.Name}`,
      bankEdit: item.BankID,
    });
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
    if (props.parentCallback) {
      props.parentCallback(item);
    }
  };

  return (
    <div>
      <Spin indicator={loadingIcon} spinning={loading}>
        <Row type="flex" justify="center" align="middle">
          <Modal
            title={
              <div style={{ textAlign: "center" }}>
                <h2>Add Recipient</h2>
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
                  style={{ minWidth: 70, width: 80 }}
                  onClick={() => formAdd.submit()}
                >
                  Add
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
                confirmAdd(userId, value);
                formAdd.resetFields();
              }}
            >
              <Form.Item
                {...formItemLayout}
                name="stkAdd"
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
                  name="nameAdd"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="nameAdd" label="Nickname">
                <Input
                  placeholder="Please inputs nick name"
                  name="nameAdd"
                  style={{ minWidth: 160 }}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} name="bankAdd" label="Bank">
                <Select style={{ minWidth: 160 }} options={bankReference} />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={
              <div style={{ textAlign: "center" }}>
                <h2>Edit Recipient</h2>
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
                  Update
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
                confirmUpdate(recpientEdit, value);
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
              <Form.Item {...formItemLayout} name="bankEdit" label="Bank">
                <Select style={{ minWidth: 160 }} options={bankReference} />
              </Form.Item>
            </Form>
          </Modal>
          <div>
            {props.isSelect === false && (
              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <Button
                  icon={
                    <PlusSquareTwoTone size="large" twoToneColor="#52c41a" />
                  }
                  type="primary"
                  ghost
                  size="large"
                  onClick={() => {
                    setModelAddRecipient(true);
                  }}
                >
                  Add Recipient
                </Button>
              </div>
            )}
            <div
              id="scrollableDiv"
              style={(() =>
                props.isSelect === true
                  ? {
                      minWidth: 300,
                      minHeight: 400,
                      height: 450,
                      overflow: "auto",
                      background: "#F8F8FF",
                      border: "1px solid #e8e8e8",
                      borderRadius: 4,
                      zIndex: 1,
                    }
                  : {
                      minWidth: 350,
                      minHeight: 400,
                      height: 450,
                      overflow: "auto",
                      background: "#F8F8FF",
                      border: "1px solid #e8e8e8",
                      borderRadius: 4,
                    })()}
            >
              <List
                dataSource={data}
                itemLayout="horizontal"
                renderItem={(item) => (
                  <List.Item
                    key={item.ID}
                    onClick={() => {
                      setItemSelected(item.ID);
                      sendData(item);
                    }}
                    style={(() =>
                      item.ID === itemSelected
                        ? { background: "rgba(50, 205, 50, 0.99)" }
                        : { background: "#F8F8FF" })()}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar size={"large"} style={{ marginTop: 5 }}>
                          <UserOutlined />
                        </Avatar>
                      }
                      title={
                        <div style={{ marginTop: -22, display: "flow" }}>
                          <div>{item.Name}</div>
                          <div>{item.AccountNumber}</div>
                        </div>
                      }
                      description={item.BankName}
                    />
                    {props.isSelect === false && (
                      <div>
                        <Button
                          icon={<EditTwoTone />}
                          type="ghost"
                          size="large"
                          onClick={() => {
                            setModelEditRecipient(true);
                            onFillFormEdit(item);
                            setRecipientEdit(item.ID);
                          }}
                        ></Button>
                        <Popconfirm
                          title={`Are you sure you want to remove  ${item.Name} ?`}
                          onConfirm={() => confirmDelete(item.ID)}
                        >
                          <Button
                            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                            type="ghost"
                            size="large"
                          ></Button>
                        </Popconfirm>
                      </div>
                    )}
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
export default ListRecipient;
