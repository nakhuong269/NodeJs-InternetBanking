import React, { useState } from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "setting",
    label: "Setting",
    icon: (
      <div>
        <SettingOutlined />
      </div>
    ),
    children: [
      {
        label: "Change password",
        key: "changepassword",
        icon: (
          <div>
            <Link to="/changepassword">
              <LockOutlined />
            </Link>
          </div>
        ),
      },
      {
        key: "logout",
        label: "Logout",
        icon: (
          <div>
            <Link to="/logout">
              <LogoutOutlined />
            </Link>
          </div>
        ),
      },
    ],
  },
];
const App = () => {
  const [current, setCurrent] = useState("home");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <Menu
      selectedKeys={current}
      onClick={onClick}
      mode="horizontal"
      style={{ justifyContent: "flex-end", background: "#20B2AA" }}
      items={menuItems}
    />
  );
};
export default App;
