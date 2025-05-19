import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';

// Styled Components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f7f9fc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #003087 0%, #0052cc 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  max-width: 1200px;
  border-radius: 8px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: #003087;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid #ffffff;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const UserName = styled.span`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #f5c518;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: #333;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #f0f4f8;
    color: #003087;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.5px;
`;

const UserTable = styled.table`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-collapse: collapse;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 1.25rem;
  background: #003087;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:first-child {
    border-top-left-radius: 12px;
  }
  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const TableRow = styled.tr`
  background: ${(props) => (props.index % 2 === 0 ? '#ffffff' : '#f9fafb')};
  transition: background 0.3s ease;

  &:hover {
    background: #f0f4f8;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem;
  font-size: 0.95rem;
  color: #2d3748;
  border-bottom: 1px solid #edf2f7;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) => (props.danger ? '#e53e3e' : props.success ? '#38a169' : '#003087')};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => (props.danger ? '#c53030' : props.success ? '#2f855a' : '#002669')};
    transform: translateY(-2px);
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  opacity: 0;
  background: #2d3748;
  color: #fff;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: opacity 0.3s ease;
  z-index: 10;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 1rem;
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #003087;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function AdminPanel() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const handleBlockUser = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/block/${email}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to block user');
      }
      const data = await response.json();
      setUsers(users.map(u => u.email === email ? { ...u, is_blocked: true } : u));
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error blocking user:', err);
    }
  };

  const handleUnblockUser = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/unblock/${email}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to unblock user');
      }
      const data = await response.json();
      setUsers(users.map(u => u.email === email ? { ...u, is_blocked: false } : u));
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error unblocking user:', err);
    }
  };

  const handleRemoveUser = async (email) => {
    if (!window.confirm(`Are you sure you want to remove ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/admin/remove/${email}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to remove user');
      }
      const data = await response.json();
      setUsers(users.filter(u => u.email !== email));
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error removing user:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <Container>
      <Header>
        <Logo>Career Rise.com</Logo>
        <UserProfile>
          <UserAvatar>{getInitial()}</UserAvatar>
          <UserName onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.name || 'Admin'}
          </UserName>
          <Dropdown isOpen={dropdownOpen}>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        </UserProfile>
      </Header>
      <Title>Admin Panel - User Management</Title>
      {loading ? (
        <LoadingSpinner />
      ) : users.length > 0 ? (
        <UserTable>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Last Login</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <TableRow key={u.email} index={index}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.is_blocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleString()}</TableCell>
                <TableCell>{u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}</TableCell>
                <TableCell>
                  {u.is_blocked ? (
                    <ActionButton success onClick={() => handleUnblockUser(u.email)}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293a1 1 0 00-1.414-1.414L9 9.586 6.707 7.293a1 1 0 00-1.414 1.414L7.586 11l-2.293 2.293a1 1 0 001.414 1.414L9 12.414l2.293 2.293a1 1 0 001.414-1.414L10.414 11l2.293-2.293z" />
                      </svg>
                      Unblock
                      <Tooltip>Unblock this user</Tooltip>
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => handleBlockUser(u.email)}>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                      </svg>
                      Block
                      <Tooltip>Block this user</Tooltip>
                    </ActionButton>
                  )}
                  <ActionButton danger onClick={() => handleRemoveUser(u.email)}>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1a1 1 0 001 1h14a1 1 0 001-1V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm-1 3h10v1H5V5zm-1 4v9a2 2 0 002 2h8a2 2 0 002-2V9H4z" />
                    </svg>
                    Remove
                    <Tooltip>Remove this user</Tooltip>
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </UserTable>
      ) : (
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem' }}>
          No users found.
        </p>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
}

export default AdminPanel;