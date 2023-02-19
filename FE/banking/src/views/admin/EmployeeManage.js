import { Button, Table, Modal, Input } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { instance } from "../../utils.js";

const ActionType = {
  Add: "Add",
  Edit: "Edit",
  Delete: "Delete",
};

function EmployeeManage() {
  const [action, setAction] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    loadDatas();
  }, []);

  const loadDatas = async function (e) {
    const res = await instance.get(`admin`);
    if (res.data.success === true) {
      const result = res.data.data.map((row) => ({
        key: row.ID,
        name: row.Name,
        cmnd: row.IDCard,
        email: row.Email,
        phone: row.Phone,
      }));

      setDataSource(result);
    } else {
      setDataSource([]);
    }
  };

  const columns = [
    {
      key: "1",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "2",
      title: "ID Card",
      dataIndex: "cmnd",
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "4",
      title: "Phone",
      dataIndex: "phone",
    },
    {
      key: "6",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditEmployee(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteEmployee(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const executeAction = async () => {
    // Add
    if (action === ActionType.Add && editingEmployee !== null) {
      const res = await instance.post(`admin`, {
        Name: editingEmployee.name,
        IDCard: editingEmployee.cmnd,
        Email: editingEmployee.email,
        Phone: editingEmployee.phone,
        Role: 3,
      });

      if (res.data.success === true) {
        success("Add employee", res.data.message);
        loadDatas();
      } else {
        error("Add employee", res.data.message);
      }
    }
    // Update
    else if (action === ActionType.Edit && editingEmployee !== null) {
      const res = await instance.patch(`admin/${editingEmployee.key}`, {
        Name: editingEmployee.name,
        IDCard: editingEmployee.cmnd,
        Email: editingEmployee.email,
        Phone: editingEmployee.phone,
      });

      if (res.data.success === true) {
        success("Update employee", res.data.message);
        loadDatas();
      } else {
        error("Update employee", res.data.message);
      }
    }

    // Delete
    else if (action === ActionType.Delete) {
      const res = await instance.delete(`admin/${editingEmployee.key}`);

      if (res.data.success === true) {
        success("Delete employee", res.data.message);
        loadDatas();
      } else {
        error("Delete employee", res.data.message);
      }
    }

    resetEditing();
  };
  const onAddEmployee = () => {
    setAction(ActionType.Add);
  };
  const onDeleteEmployee = (record) => {
    setAction(ActionType.Delete);
    setEditingEmployee({ ...record });
  };
  const onEditEmployee = (record) => {
    setAction(ActionType.Edit);
    setEditingEmployee({ ...record });
  };
  const resetEditing = () => {
    setAction(null);
    setEditingEmployee(null);
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

  return (
    <div>
      <header>
        <Button
          onClick={onAddEmployee}
          className="btnAdd-Employee"
          type="primary"
          style={{ marginBottom: 20 }}
        >
          Add a new Employee
        </Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          title={action === ActionType.Edit ? "Edit Employee" : "Add Employee"}
          open={action === ActionType.Edit || action === ActionType.Add}
          okText={action === ActionType.Edit ? "Save" : "Add"}
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            executeAction();
          }}
        >
          <label htmlFor="txtName">Name</label>
          <Input
            id="txtName"
            placeholder="Name"
            value={editingEmployee?.name}
            onChange={(e) => {
              setEditingEmployee((pre) => {
                return { ...pre, name: e.target.value };
              });
            }}
          />
          <br />
          <br />
          <label htmlFor="txtCmnd">ID Card</label>
          <Input
            id="txtCmnd"
            placeholder="ID Card"
            value={editingEmployee?.cmnd}
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            onChange={(e) => {
              setEditingEmployee((pre) => {
                return { ...pre, cmnd: e.target.value };
              });
            }}
          />{" "}
          <br />
          <br />
          <label htmlFor="txtEmail">Email</label>
          <Input
            id="txtEmail"
            placeholder="Email"
            value={editingEmployee?.email}
            onChange={(e) => {
              setEditingEmployee((pre) => {
                return { ...pre, email: e.target.value };
              });
            }}
          />{" "}
          <br />
          <br />
          <label htmlFor="txtPhone">Phone</label>
          <Input
            id="txtPhone"
            placeholder="Phone"
            value={editingEmployee?.phone}
            onChange={(e) => {
              setEditingEmployee((pre) => {
                return { ...pre, phone: e.target.value };
              });
            }}
          />
        </Modal>

        <Modal
          title="Are you sure, you want to delete this employee record?"
          open={action === ActionType.Delete}
          okText="Yes"
          okType="danger"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            executeAction();
          }}
        ></Modal>
      </header>
    </div>
  );
}

export default EmployeeManage;
