import React, { useState } from "react";
import { List, Row, Input, Spin, Badge } from "antd";
import { instance } from "../../utils.js";
import moment from "moment/moment.js";
const { Search } = Input;

function TransactionHistory() {
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const loadMoreData = async (accountNumber) => {
    setLoading(true);

    const resTransactionHitory = await instance.get(
      `employee/ListTransaction/${accountNumber}`
    );

    if (resTransactionHitory.data.success === true) {
      setData(resTransactionHitory.data.data);
    } else {
      setData([]);
    }

    setLoading(false);
  };

  const onSearch = function (value) {
    console.log(value);
    if (value) {
      setQuery(value);
      loadMoreData(value);
    }
    setData([]);
  };

  return (
    <Row type="flex" justify="center" align="middle">
      <div
        style={{
          width: 500,
          background: "#001529",
          padding: 40,
          borderRadius: 10,
          minWidth: 200,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "white",
              fontSize: 32,
              paddingBottom: 20,
              margin: 0,
            }}
          >
            Transaction History
          </h1>
        </div>
        <div>
          <Search
            placeholder="Account number"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={{ marginBottom: 15 }}
          />
        </div>
        <div
          id="scrollableDiv"
          style={{
            height: 400,
            overflow: "auto",
            background: "#F8F8FF",
            border: "1px solid #e8e8e8",
            borderRadius: 4,
          }}
        >
          <Spin spinning={loading}>
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item key={item.ID} style={{ padding: 0 }}>
                  <List.Item.Meta
                    avatar={
                      item.TransactionName === "Chuyển nội bộ" ? (
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
                            "HH:mm:ss DD-MM-YYYY"
                          )}
                        </h5>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: -10 }}>
                        <strong>
                          {item.AccountPaymentSend === query
                            ? "To: " + item.AccountPaymentSend
                            : "From: " + item.AccountPaymentReceive}
                          <div style={{ marginTop: -5 }}>
                            <p>{item.Content}</p>
                          </div>
                        </strong>
                      </div>
                    }
                  />
                  <h3
                    style={(() => {
                      if (item.isDebtRemind === true) {
                        return {
                          minWidth: 100,
                          textAlign: "center",
                          color: "#304FFE",
                        };
                      } else {
                        if (item.AccountPaymentSend === query) {
                          return {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#FF1744",
                            paddingRight: 15,
                          };
                        } else {
                          return {
                            minWidth: 100,
                            textAlign: "center",
                            color: "#00C853",
                            paddingRight: 15,
                          };
                        }
                      }
                    })()}
                  >
                    {item.AccountPaymentSend === query
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
                  </h3>
                </List.Item>
              )}
            />
          </Spin>
        </div>
      </div>
    </Row>
  );
}
export default TransactionHistory;
