import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import { AuthContext } from './Context/AuthContext';

const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LeftContainer = styled.div`
  width: 55%;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
`;

const RightContainer = styled.div`
  width: 45%;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Slide = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.9);
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transform: scale(1);
  animation: ${(props) => (props.active ? 'zoomIn 90s ease-in-out' : 'none')};
  transition: opacity 1s ease-in-out;
  
  @keyframes zoomIn {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.5);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 450px;
`;

const Input = styled.input`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: #003087;
    box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.85rem;
  background: #003087;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 130px;
  align-self: flex-end;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: #002669;
    transform: scale(1.05);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
`;

const SubText = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
  margin: -0.5rem 0 0.5rem;
`;

const LinkText = styled.p`
  text-align: center;
  color: #003087;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: color 0.3s ease;
  &:hover {
    color: #002669;
    text-decoration: underline;
  }
`;

function Signin() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { signinData, signinErrors, updateSigninData, setSigninErrors } = useContext(UserContext);
  const { login } = useContext(AuthContext);

  const slides = [
    "https://img.freepik.com/premium-vector/hand-drawn-businessman-walking-up-stairs-success-concept-flat-style-isolated-background_1375-28638.jpg?ga=GA1.1.1416867470.1745098308&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-vector/top-cloud-success-ladder-flat-isometric_126523-1876.jpg?ga=GA1.1.1416867470.1745098308&semt=ais_hybrid&w=740",
    "https://img.freepik.com/premium-photo/man-walks-up-stairs-carrying-briefcase-using-white-cane_862489-33108.jpg?ga=GA1.1.1416867470.1745098308&semt=ais_hybrid&w=740"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSigninData({ [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signinData.email) newErrors.email = 'Email is required';
    if (!signinData.password) newErrors.password = 'Password is required';
    setSigninErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Signin Details:', signinData);
        const response = await fetch('http://localhost:8000/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'username': signinData.email,
            'password': signinData.password,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }
        const data = await response.json();
        console.log(data.message);

        // Fetch user data after successful login
        const userResponse = await fetch('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        login(userData, data.access_token);

        // Check if the user is an admin and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        setSigninErrors({ general: error.message });
        console.error('Signin error:', error);
      }
    }
  };

  return (
    <MainContainer>
      <RightContainer>
        {slides.map((slide, index) => (
          <Slide
            key={index}
            src={slide}
            alt={`signin image ${index + 1}`}
            active={index === currentSlide}
          />
        ))}
      </RightContainer>

      <LeftContainer>
        <Title>Sign In</Title>
        <SubText>Access your account to explore job opportunities and internships.</SubText>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={signinData.email}
            onChange={handleChange}
          />
          {signinErrors.email && <ErrorText>{signinErrors.email}</ErrorText>}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={signinData.password}
            onChange={handleChange}
          />
          {signinErrors.password && <ErrorText>{signinErrors.password}</ErrorText>}
          {signinErrors.general && <ErrorText>{signinErrors.general}</ErrorText>}
          <Button type="submit">Sign In</Button>
          <LinkText onClick={() => navigate('/signup')}>
            Don't have an account? Sign Up
          </LinkText>
        </Form>
      </LeftContainer>
    </MainContainer>
  );
}

export default Signin;