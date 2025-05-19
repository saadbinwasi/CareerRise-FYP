import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import { UserProvider } from './components/Context/UserContext';
import { AuthProvider } from './components/Context/AuthContext';
import PrivateRoute from './components/Context/PrivateRoute';
import AdminPanel from './components/AdminPanel';
import AdminRoute from './components/Context/AdminRoute';

function App() {
  const AppContainer = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    top: 0;
    background-color: #f4f4f9;
  `;

  const Header = styled.h1`
    font-size: 2.5rem;
    color: #333;
    margin: 2rem 0;
    text-align: center;
  `;

  return (
    <UserProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Signin />} />
        </Routes>
      </Router>
    </AuthProvider>
  </UserProvider>
  );
}

export default App;