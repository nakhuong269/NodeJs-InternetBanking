import React, { useEffect, useState } from "react";
import { List, Row, Spin, Card, Badge } from "antd";
import { instance, parseJwt } from "../../utils.js";
import moment from "moment/moment.js";
import { LoadingOutlined } from "@ant-design/icons";
const loadingIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

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
        setAccountNumber(resGetListAccountPayment.data.data[0].AccountNumber);

        const resTransactionHitory = await instance.get(
          `customer/GetListTransaction/${resGetListAccountPayment.data.data[0].AccountNumber}`
        );
        if (resTransactionHitory.data.success === true) {
          setData(resTransactionHitory.data.data);
        } else {
          setData([]);
        }
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
      <Card
        title="Transaction History"
        headStyle={{ background: "#20B2AA", textAlign: "center" }}
      >
        <div
          id="scrollableDiv"
          style={{
            width: 350,
            height: 550,
            overflow: "auto",
            background: "#F8F8FF",
            border: "1px solid #e8e8e8",
            borderRadius: 4,
          }}
        >
          <Spin spinning={loading} indicator={loadingIcon}>
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item key={item.ID} style={{ padding: 0 }}>
                  <List.Item.Meta
                    avatar={
                      item.TransactionName === "Chuy???n n???i b???" ? (
                        // <div
                        //   style={{
                        //     padding: 2,
                        //     width: 150,
                        //     height: 20,
                        //     background: "cyan",
                        //     position: "absolute",
                        //     textAlign: "Left",
                        //   }}
                        // >
                        //   {item.TransactionName}
                        // </div>

                        <div style={{ display: "flex" }}>
                          <Badge.Ribbon
                            text={" Internal transfer"}
                            placement="start"
                            style={{ paddingLeft: 15 }}
                          ></Badge.Ribbon>
                          {item.IsDebtRemind ? (
                            <div
                              style={{
                                position: "absolute",
                                marginTop: 8,
                                minHeight: 20,
                                background: "#a0d911",
                                borderRadius: 3,
                                width: 110,
                                marginLeft: 120,
                                textAlign: "center",
                                fontSize: 14,
                                color: "white",
                              }}
                            >
                              Payment debt
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      ) : (
                        <Badge.Ribbon
                          text="External transfer"
                          placement="start"
                          color="volcano"
                          style={{ paddingLeft: 15 }}
                        ></Badge.Ribbon>
                      )
                    }
                    title={
                      <div style={{ paddingTop: 2 }}>
                        <h5>
                          {moment(item.TransactionTime).format(
                            "HH:mm:ss DD/MM/YYYY"
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
                    style={
                      item.AccountPaymentSend === accountNumber
                        ? {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#FF1744",
                            paddingRight: 15,
                          }
                        : {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#00C853",
                            paddingRight: 15,
                          }
                    }
                  >
                    {item.AccountPaymentSend === accountNumber
                      ? "-" +
                        item.Amount.toLocaleString().replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )
                      : "+" +
                        item.Amount.toLocaleString().replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
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
