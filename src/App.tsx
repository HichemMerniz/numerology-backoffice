import './styles/globals.css';
import { Button } from './components/ui/button';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <AuthContext.Consumer>{(auth) => auth?.isAuthenticated ? <Dashboard /> : <Navigate to="/" />}</AuthContext.Consumer>
          } />
        </Routes>
      </Router>

    </AuthProvider>
  );
};

export default App;