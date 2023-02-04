import React, { useEffect, useState } from "react";
import { List, Row, Spin, Card } from "antd";
import { instance, parseJwt } from "../../utils.js";
import moment from "moment/moment.js";

function Transaction() {
  const [userId] = useState(parseJwt(localStorage.App_AccessToken).id);

  const [loading, setLoading] = useState(false);

  const [accountNumber, setAccountNumber] = useState();

  const [data, setData] = useState([]);

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const resGetListAccountPayment = await instance.get(
        `Customer/GetListAccountPayment/${userId}`
      );
      if (resGetListAccountPayment.data.success === true) {
        setData(
          resGetListAccountPayment.data.data.map((record, index) => ({
            value: index,
            label: record.AccountNumber,
            ID: record.ID,
            accountBalance: record.Balance,
          }))
        );

        const resTransactionHitory = await instance.get(
          `customer/GetListTransaction/${resGetListAccountPayment.data.data[0].AccountNumber}`
        );

        setAccountNumber(resGetListAccountPayment.data.data[0].AccountNumber);

        setData(resTransactionHitory.data.data);
      }
    } catch {
      setLoading(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <Row type="flex" justify="center" align="middle">
      <Card title="Transaction History">
        <div
          id="scrollableDiv"
          style={{
            width: 350,
            height: 550,
            overflow: "auto",
            background: "#F8F8FF",
          }}
        >
          <Spin spinning={loading}>
            <List
              dataSource={data}
              bordered
              renderItem={(item) => (
                <List.Item
                  key={item.ID}
                  title={item.TransactionName}
                  style={{ padding: 0 }}
                >
                  <List.Item.Meta
                    avatar={
                      item.TransactionName === "Chuyển nội bộ" ? (
                        <div
                          style={{
                            padding: 2,
                            width: 150,
                            height: 20,
                            background: "cyan",
                            position: "absolute",
                            textAlign: "Left",
                          }}
                        >
                          {item.TransactionName}
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: 2,
                            width: 150,
                            height: 20,
                            background: "orange",
                            position: "absolute",
                            textAlign: "Left",
                          }}
                        >
                          {item.TransactionName}
                        </div>
                      )
                    }
                    title={
                      <div style={{ paddingTop: 2 }}>
                        <h5>
                          {moment(item.TransactionTime).format(
                            "HH:mm:ss DD-MM-YYYY"
                          )}
                        </h5>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: -10 }}>
                        <h5>
                          {item.AccountPaymentSend === accountNumber
                            ? "To: " + item.AccountPaymentReceive
                            : "From: " + item.AccountPaymentSend}
                          <p>{item.Content}</p>
                        </h5>
                      </div>
                    }
                  />
                  <h4
                    style={(() => {
                      if (item.isDebtRemind === true) {
                        return {
                          minWidth: 100,
                          textAlign: "center",
                          color: "#304FFE",
                        };
                      } else {
                        if (item.AccountPaymentSend === accountNumber) {
                          return {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#FF1744",
                          };
                        } else {
                          return {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#00C853",
                          };
                        }
                      }
                    })()}
                  >
                    {item.AccountPaymentSend === accountNumber
                      ? "-" + item.Amount
                      : "+" + item.Amount}
                  </h4>
                </List.Item>
              )}
            />
          </Spin>
        </div>
      </Card>
    </Row>
  );
}
export default Transaction;
