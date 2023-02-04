import React, { useContext, useEffect, useState } from "react";
import { Row, Form, Input, Card, Select } from "antd";
import { instance, parseJwt } from "../../utils.js";
import { UserContext } from "../../contexts/userContext.js";

const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

const UserBalance = () => {
  const [data, setData] = useState([]);

  //const [setUser] = useContext(UserContext);

  const [selectedAccountNumberID, setSelectedAccountNumberID] = useState(0);

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

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
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  const handleChange = (value) => {
    setSelectedAccountNumberID(value);
    //setUser(data[value].AccountNumber);
  };

  return (
    <Row type="flex" justify="center" align="middle">
      <Card>
        <Form>
          <Form.Item
            {...formItemLayout}
            label="Account number"
            labelAlign="left"
          >
            <Select
              value={data[selectedAccountNumberID]}
              defaultValue={data[selectedAccountNumberID]}
              onChange={handleChange}
              style={{
                minwidth: 170,
              }}
              options={data}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label="Balance" labelAlign="left">
            <Input.Password
              value={
                data[selectedAccountNumberID]
                  ? data[selectedAccountNumberID].accountBalance
                  : ""
              }
            />
          </Form.Item>
        </Form>
      </Card>
    </Row>
  );
};
export default UserBalance;
