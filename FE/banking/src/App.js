import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./views/account/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
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
