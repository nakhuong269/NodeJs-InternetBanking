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
} from "antd";
import {
  UserOutlined,
  DeleteTwoTone,
  EditTwoTone,
  PlusSquareTwoTone,
} from "@ant-design/icons";
import { instance, parseJwt } from "../../utils.js";

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

const ListRecipient = (props) => {
  const [data, setData] = useState([]);

  const [bankReference, setBankReference] = useState();

  const [modelEditRecipient, setModelEditRecipient] = useState(false);

  const [modelAddRecipient, setModelAddRecipient] = useState(false);

  const [recpientEdit, setRecipientEdit] = useState();

  const [itemSelected, setItemSelected] = useState();

  const [formEdit] = Form.useForm();

  const [formAdd] = Form.useForm();

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  useEffect(
    () => async () => {
      const resBankReference = await instance.get(`generic/ListBank`);
      if (resBankReference.data.success === true) {
        setBankReference(
          resBankReference.data.data.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))
        );
      }
    },
    []
  );

  const appendData = async () => {
    const res = await instance.get(`Customer/GetListRecipient/${userId}`, {});
    if (res.data.success === true) {
      setData(res.data.data);
    }
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
    } else {
      error("Delete recipient", res.data.message);
    }

    appendData();
  };

  const confirmUpdate = async (id, paramsUpdate) => {
    const res = await instance.patch(`customer/recipient/${id}`, {
      AccountNumber: paramsUpdate.stkEdit,
      Name: paramsUpdate.nameEdit,
      BankID: paramsUpdate.bankEdit,
    });
    if (res.data.success === true) {
      success("Update recipient", res.data.message);
    } else {
      error("Update recipient", res.data.message);
    }

    appendData();
  };

  const confirmAdd = async (userId, paramsAdd) => {
    const res = await instance.post(`Customer/Recipient`, {
      AccountNumber: paramsAdd.stkAdd,
      Name: paramsAdd.nameAdd,
      AccountID: userId,
      BankID: paramsAdd.bankAdd,
    });
    if (res.data.success === true) {
      success("Add recipient", res.data.message);
    } else {
      error("Add recipient", res.data.message);
    }

    appendData();
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
    <Row type="flex" justify="center" align="middle">
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <h2>Add Recipient</h2>
          </div>
        }
        centered
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
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="nameAdd" label="Nickname">
            <Input
              placeholder="Please inputs nick name"
              name="nameAdd"
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="bankAdd" label="Bank">
            <Select style={{ minWidth: 200 }} options={bankReference} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <h2>Edit Recipient</h2>
          </div>
        }
        centered
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
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="nameEdit" label="Nickname">
            <Input
              placeholder="Please inputs nick name"
              name="nameEdit"
              style={{ minWidth: 200 }}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} name="bankEdit" label="Bank">
            <Select style={{ minWidth: 200 }} options={bankReference} />
          </Form.Item>
        </Form>
      </Modal>
      <div>
        {props.isSelect === false && (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Button
              icon={<PlusSquareTwoTone size="large" twoToneColor="#52c41a" />}
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
          style={{
            minWidth: 350,
            minHeight: 400,
            height: 450,
            overflow: "auto",
            background: "#F8F8FF",
          }}
        >
          <List
            dataSource={data}
            bordered
            itemLayout="horizontal"
            renderItem={(item) => (
              <List.Item
                key={item.ID}
                onClick={() => {
                  setItemSelected(item.ID);
                  sendData(item);
                  //console.log(item.id);
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
  );
};
export default ListRecipient;