import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./views/account/Login";
import { useState } from "react";
import { UserContext } from "./contexts/userContext";
import Customer from "./views/customer/Customer";
import RecipientManage from "./views/customer/RecipientManage";
import Transaction from "./views/customer/Transaction";
import InternalTranfer from "./views/customer/InternalTranfer";

function App() {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Customer />} />
          <Route path="/RecipientManage" element={<RecipientManage />} />
          <Route path="/TransactionHistory" element={<Transaction />} />
          <Route path="/InternalTransfer" element={<InternalTranfer />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}
function RequireAuth({ children }) {
  if (!localStorage.App_AccessToken) {
    return <Navigate to="/login" />;
  }

  return children;
}

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

export default App;
