import React from "react";
import UserBalance from "./UserBalance";
import { Row, Card, Col, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";
import {
  HistoryOutlined,
  BankOutlined,
  UserOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
function Customer(props) {
  const navigate = useNavigate();
  return (
    <>
      <Menu></Menu>
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ marginTop: 50 }}
      >
        <Col>
          <Badge.Ribbon
            text="Account payment"
            color="cyan"
            placement="start"
            style={{ fontSize: 18 }}
          >
            <div>
              <UserBalance />
            </div>
          </Badge.Ribbon>
          <div style={{ marginTop: 15 }}>
            <Badge.Ribbon
              text="Service"
              color="cyan"
              placement="start"
              style={{ fontSize: 18 }}
            >
              <Card style={{ width: 300 }}>
                <Row style={{ marginTop: 15 }}>
                  <Col span={8}>
                    <div
                      style={{
                        textAlign: "center",
                        width: 80,
                        padding: 5,
                      }}
                      onClick={() => navigate("/debtmanage")}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          height: 50,
                          background: "rgb(54,54,54, 0.1)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CreditCardOutlined style={{ fontSize: "200%" }} />
                      </div>
                      <div>Debt Manage</div>
                    </div>
                  </Col>
                  <Col span={8}></Col>
                  <Col span={8}>
                    <div
                      style={{ textAlign: "center", width: 80, padding: 5 }}
                      onClick={() => navigate("/recipientmanage")}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          height: 50,
                          background: "rgb(54,54,54, 0.1)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <UserOutlined style={{ fontSize: "200%" }} />
                      </div>
                      <div>Recipient Manage</div>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: 15 }}>
                  <Col span={8}>
                    <div
                      style={{ textAlign: "center", width: 80, padding: 5 }}
                      onClick={() => navigate("/InternalTransfer")}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          height: 50,
                          background: "rgb(54,54,54, 0.1)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <BankOutlined style={{ fontSize: "200%" }} />
                      </div>
                      <div>Internal Tranfer</div>
                    </div>
                  </Col>
                  <Col span={8}></Col>

                  <Col span={8}>
                    <div
                      style={{ textAlign: "center", width: 80, padding: 5 }}
                      onClick={() => navigate("/TransactionHistory")}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          height: 50,
                          background: "rgb(54,54,54, 0.1)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <HistoryOutlined style={{ fontSize: "200%" }} />
                      </div>
                      <div>Transaction history</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Badge.Ribbon>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Customer;
