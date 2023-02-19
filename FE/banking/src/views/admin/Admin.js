import React from "react";
import { useState } from "react";
import { BarChartOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import DashBoard from "./DashBoard";
import EmployeeManage from "./EmployeeManage";

// Layout
const { Header, Content, Sider } = Layout;
const headerTitle = ["ADMIN"].map((key) => ({
  key,
  label: `${key}`,
}));
const menuItems = [
  { key: "1", icon: BarChartOutlined, name: "Dashboard" },
  { key: "2", icon: UserOutlined, name: "Employee" },
].map((item, index) => {
  const key = String(index + 1);
  return {
    key: `${key}`,
    icon: React.createElement(item.icon),
    label: `${item.name}`,
  };
});

// UI
function Admin() {
  const [current, setCurrent] = useState("1");
  const onClick = (e) => {
    //console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["ADMIN"]}
          items={headerTitle}
        />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            onClick={onClick}
            selectedKeys={[current]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={menuItems}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {current === "1" && <Breadcrumb.Item>Dashboard</Breadcrumb.Item>}
            {current === "2" && (
              <Breadcrumb.Item>Employee management</Breadcrumb.Item>
            )}
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {current === "1" && <DashBoard />}
            {current === "2" && <EmployeeManage />}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Admin;
