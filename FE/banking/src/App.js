import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./views/account/Login";
import { useEffect, useState } from "react";
import { UserContext } from "./contexts/userContext";
import Customer from "./views/customer/Customer";
import RecipientManage from "./views/customer/RecipientManage";
import Transaction from "./views/customer/Transaction";
import InternalTranfer from "./views/customer/InternalTranfer";
import DebtManage from "./views/customer/DebtManage";
import Employee from "./views/employee/Employee";
import Admin from "./views/admin/Admin";
import socket from "./socket";
import { notification } from "antd";
import { instance, parseJwt } from "./utils";
import moment from "moment";

function App() {
  const [user, setUser] = useState({});

  const [idDebt, setIDDebt] = useState(0);

  const [isSend, setIsSend] = useState(false);

  const [notifyDebtPayment, setNotifyDebtPayment] = useState(0);

  socket.on("server_cancel_debt", (id, isSend) => {
    setIDDebt(id);
    setIsSend(isSend);
  });

  socket.on("server_payment_debt", (idDebtPayment) => {
    setNotifyDebtPayment(idDebtPayment);
  });

  const [skipCount, setSkipCount] = useState(true);

  const loadDebtNotify = async (id) => {
    const res = await instance.get(`customer/DebtRemind/${idDebt}`);
    if (res.data.success === true) {
      if (isSend) {
        const message = {
          title: (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cancel Debt Remind</div>
              <div>
                {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")}
              </div>
            </div>
          ),
          description: (
            <div>
              Your debit reminder has just been canceled by the sender:{" "}
              {res.data.data[0].AccountPaymentSend}
              <br />
              Amount: {res.data.data[0].Amount}
              <br />
              Content: {res.data.data[0].Content}
            </div>
          ),
        };
        openNotification(message);
      } else {
        const message = {
          title: (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Cancel Debt Remind</div>
              {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")}
            </div>
          ),
          description: (
            <div>
              Your debit reminder has just been canceled by the recipient:{" "}
              {res.data.data[0].AccountPaymentReceive}
              <br />
              Amount: {res.data.data[0].Amount}
              <br />
              Content: {res.data.data[0].Content}
            </div>
          ),
        };
        openNotification(message);
      }
    }
  };

  const loadDebtPaymentNotify = async (id) => {
    const res = await instance.get(`customer/DebtRemind/${notifyDebtPayment}`);
    if (res.data.success === true) {
      const message = {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Pament Debt Remind</div>
            {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")}
          </div>
        ),
        description: (
          <div>
            Remind your debt has just been paid from the account number:{" "}
            {res.data.data[0].AccountPaymentReceive}
            <br />
            Amount: {res.data.data[0].Amount}
            <br />
            Content: {res.data.data[0].Content}
          </div>
        ),
      };
      openNotification(message);
    }
  };

  useEffect(() => {
    if (skipCount) {
      setSkipCount(false);
    }
    if (!skipCount) {
      loadDebtNotify(idDebt);
    }
  }, [idDebt]);

  useEffect(() => {
    if (skipCount) {
      setSkipCount(false);
    }
    if (!skipCount) {
      loadDebtPaymentNotify(notifyDebtPayment);
    }
  }, [notifyDebtPayment]);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message) => {
    api.open({
      message: message.title,
      description: message.description,
      duration: 0,
    });
  };

  return (
    <>
      {contextHolder}
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Customer />
                </RequireAuth>
              }
            />
            <Route
              path="/RecipientManage"
              element={
                <RequireAuth>
                  <RecipientManage />
                </RequireAuth>
              }
            />
            <Route
              path="/TransactionHistory"
              element={
                <RequireAuth>
                  <Transaction />
                </RequireAuth>
              }
            />
            <Route
              path="/InternalTransfer"
              element={
                <RequireAuth>
                  <InternalTranfer />
                </RequireAuth>
              }
            />
            <Route
              path="/DebtManage"
              element={
                <RequireAuth>
                  <DebtManage />
                </RequireAuth>
              }
            />
            <Route
              path="/Employee"
              element={
                <RequireAuth>
                  <Employee />
                </RequireAuth>
              }
            />
            <Route
              path="/Admin"
              element={
                <RequireAuth>
                  <Admin />
                </RequireAuth>
              }
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}
function RequireAuth({ children, setID }) {
  if (!localStorage.App_AccessToken) {
    return <Navigate to="/login" />;
  } else {
    socket.emit("connected", parseJwt(localStorage.App_AccessToken).id);
  }

  return children;
}

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

export default App;
