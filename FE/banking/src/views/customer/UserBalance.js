import React, { useEffect, useState } from "react";
import { Row, Form, Input, Card, Select, Spin } from "antd";
import { instance, parseJwt } from "../../utils.js";
import { LoadingOutlined } from "@ant-design/icons";

const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
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

const UserBalance = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  //const [setUser] = useContext(UserContext);

  const [selectedAccountNumberID, setSelectedAccountNumberID] = useState(0);

  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const appendData = async () => {
    setLoading(true);
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
    return setLoading(false);
  };

  useEffect(() => {
    appendData();
  }, []);

  const handleChange = (value) => {
    setSelectedAccountNumberID(value);
    //setUser(data[value].AccountNumber);
  };

  return (
    <div>
      <Spin indicator={loadingIcon} spinning={loading}>
        <Row type="flex" justify="center" align="middle">
          <Card style={{ width: 300 }}>
            <Form style={{ marginTop: 15 }}>
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
                          .replace(/\$\s?|(,*)/g, "")
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""
                  }
                />
              </Form.Item>
            </Form>
          </Card>
        </Row>
      </Spin>
    </div>
  );
};
export default UserBalance;
