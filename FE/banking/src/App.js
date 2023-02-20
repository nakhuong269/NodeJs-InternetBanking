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

  const [notifyCreateDebt, setNotifyCreateDebt] = useState(0);

  const [notifyTransaction, setNotifyTransaction] = useState(0);

  socket.on("server_cancel_debt", (id, isSend) => {
    setIDDebt(id);
    setIsSend(isSend);
  });

  socket.on("server_payment_debt", (idDebtPayment) => {
    setNotifyDebtPayment(idDebtPayment);
  });

  socket.on("server_create_debt", (idDebt) => {
    setNotifyCreateDebt(idDebt);
  });

  socket.on("server_transaction", (idTrans) => {
    setNotifyTransaction(idTrans);
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
              {/* {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")} */}
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

  const loadCreateDebtNotify = async (id) => {
    const res = await instance.get(`customer/DebtRemind/${notifyCreateDebt}`);
    console.log(res);
    if (res.data.success === true) {
      const message = {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Debt Remind</div>
            {/* {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")} */}
          </div>
        ),
        description: (
          <div>
            Account number {res.data.data[0].AccountPaymentSend} has just
            reminded you of debt: <br />
            Amount: {res.data.data[0].Amount}
            <br />
            Content: {res.data.data[0].Content}
          </div>
        ),
      };
      openNotification(message);
    }
  };

  const loadDebtPaymentNotify = async (id) => {
    const res = await instance.get(`customer/DebtRemind/${notifyDebtPayment}`);
    if (res.data.success === true) {
      const message = {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Pament Debt Remind</div>
            {/* {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")} */}
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

  const loadTransactionNotify = async (id) => {
    const res = await instance.get(`generic/Transaction/${notifyTransaction}`);
    if (res.data.success === true) {
      const message = {
        title: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Transaction</div>
            {/* {moment(res.data.data[0].UpdatedDate).format("HH:mm:ss")} */}
          </div>
        ),
        description: (
          <div>
            From account number: {res.data.data[0].AccountPaymentSend}
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

  useEffect(() => {
    if (skipCount) {
      setSkipCount(false);
    }
    if (!skipCount) {
      loadCreateDebtNotify(notifyDebtPayment);
    }
  }, [notifyCreateDebt]);

  useEffect(() => {
    if (skipCount) {
      setSkipCount(false);
    }
    if (!skipCount) {
      loadTransactionNotify(notifyTransaction);
    }
  }, [notifyTransaction]);

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
                  <RequireAuthCustomer>
                    <Customer />
                  </RequireAuthCustomer>
                </RequireAuth>
              }
            />
            <Route
              path="/RecipientManage"
              element={
                <RequireAuth>
                  <RequireAuthCustomer>
                    <RecipientManage />
                  </RequireAuthCustomer>
                </RequireAuth>
              }
            />
            <Route
              path="/TransactionHistory"
              element={
                <RequireAuth>
                  <RequireAuthCustomer>
                    <Transaction />
                  </RequireAuthCustomer>
                </RequireAuth>
              }
            />
            <Route
              path="/InternalTransfer"
              element={
                <RequireAuth>
                  <RequireAuthCustomer>
                    <InternalTranfer />
                  </RequireAuthCustomer>
                </RequireAuth>
              }
            />
            <Route
              path="/DebtManage"
              element={
                <RequireAuth>
                  <RequireAuthCustomer>
                    <DebtManage />
                  </RequireAuthCustomer>
                </RequireAuth>
              }
            />
            <Route
              path="/Employee"
              element={
                <RequireAuth>
                  <RequireAuthEmployee>
                    <Employee />
                  </RequireAuthEmployee>
                </RequireAuth>
              }
            />
            <Route
              path="/Admin"
              element={
                <RequireAuth>
                  <RequireAuthAdmin>
                    <Admin />
                  </RequireAuthAdmin>
                </RequireAuth>
              }
            />
            <Route
              path="/logout"
              element={
                <RequireAuth>
                  <Logout />
                </RequireAuth>
              }
            />
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

function RequireAuthAdmin({ children, setID }) {
  const role = parseJwt(localStorage.App_AccessToken).role;
  if (role !== 2) {
    return <Navigate to="/login" />;
  }

  return children;
}

function RequireAuthEmployee({ children, setID }) {
  const role = parseJwt(localStorage.App_AccessToken).role;
  if (role !== 3) {
    return <Navigate to="/login" />;
  }

  return children;
}

function RequireAuthCustomer({ children, setID }) {
  const role = parseJwt(localStorage.App_AccessToken).role;
  if (role !== 1) {
    return <Navigate to="/login" />;
  }

  return children;
}

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

export default App;
