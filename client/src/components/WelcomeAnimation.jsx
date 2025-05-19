import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #003087 0%, #0052cc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const WelcomeText = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-out, ${pulse} 2s infinite;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out 0.5s forwards;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ResumeUploadContainer = styled.div`
  opacity: 0;
  animation: ${fadeIn} 1s ease-out 1s forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ResumeInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ffffff;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 300px;
  max-width: 100%;
  box-sizing: border-box;

  &::file-selector-button {
    padding: 0.5rem 1rem;
    background: #f5c518;
    color: #003087;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s ease;
  }

  &::file-selector-button:hover {
    background: #e0b015;
  }
`;

const ContinueButton = styled.button`
  padding: 0.75rem 2rem;
  background: #f5c518;
  color: #003087;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #e0b015;
    transform: scale(1.05);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

function WelcomeAnimation({ onComplete, token }) {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('pdf')) {
        setError('Please upload a PDF file.');
        setResumeFile(null);
      } else if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setResumeFile(null);
      } else {
        setError('');
        setResumeFile(file);
      }
    }
  };

  const handleContinue = async () => {
    if (resumeFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('resume', resumeFile);

        const response = await fetch('http://localhost:8000/upload_resume', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to upload resume');
        }

        const data = await response.json();
        console.log(data.message);
        onComplete(resumeFile);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
        setUploading(false);
      }
    } else {
      onComplete(null);
      navigate('/dashboard');
    }
  };

  return (
    <FullScreenContainer>
      <WelcomeText>Welcome to CareerRise.com</WelcomeText>
      <Tagline>Your Journey to a Dream Career Starts Here!</Tagline>
      <ResumeUploadContainer>
        <ResumeInput
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ContinueButton onClick={handleContinue} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Continue to Dashboard'}
        </ContinueButton>
      </ResumeUploadContainer>
    </FullScreenContainer>
  );
}

export default WelcomeAnimation;