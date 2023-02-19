import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  WalletOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import Recharge from "./Recharge";
import Register from "./Register";
import TransactionHistory from "./TransactionHistory";

import { Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;

function Employee() {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState("1");

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={[current]}
          selectedKeys={[current]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Sign up",
            },
            {
              key: "2",
              icon: <WalletOutlined />,
              label: "Recharge",
            },
            {
              key: "3",
              icon: <HistoryOutlined />,
              label: "Transaction history",
            },
            {
              key: "4",
              icon: (
                <div>
                  <Link to="/logout">
                    <LogoutOutlined />
                  </Link>
                </div>
              ),
              label: "Logout",
            },
          ]}
          onClick={(e) => setCurrent(e.key)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {(current === "1" && <Register></Register>) ||
            (current === "2" && <Recharge></Recharge>) ||
            (current === "3" && <TransactionHistory></TransactionHistory>)}
        </Content>
      </Layout>
    </Layout>
  );
}
export default Employee;
