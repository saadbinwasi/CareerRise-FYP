import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import { AuthContext } from './Context/AuthContext';

// Styled components for existing UI
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

const Form = styled.div`
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

const Select = styled.select`
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

const GraduationContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const GraduationSelect = styled.select`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  flex: 1;
  box-sizing: border-box;
  background: #fafafa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: #003087;
    box-shadow: 0 0 0 3px rgba(0, 48, 135, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background: #fafafa;
  resize: vertical;
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

const BackButton = styled.button`
  padding: 0.85rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 130px;
  align-self: flex-start;
  transition: background 0.3s ease, transform 0.2s ease;
  &:hover {
    background: #d1d5db;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.5rem;
`;

const Label = styled.label`
  color: #374151;
  font-size: 0.95rem;
  font-weight: 500;
`;

// New styled components for the welcome animation
const WelcomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #003087 0%, #0052cc 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  animation: slideIn 1s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: center;
  animation: slideIn 1s ease-out 0.5s;
  animation-fill-mode: backwards;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ResumeUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  animation: slideIn 1s ease-out 1s;
  animation-fill-mode: backwards;
`;

const ResumeInput = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
  border: 2px dashed #ffffff;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;

  &::-webkit-file-upload-button {
    padding: 0.5rem 1rem;
    background: #f5c518;
    color: #003087;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  &::-webkit-file-upload-button:hover {
    background: #e0b015;
  }
`;

const UploadButton = styled.button`
  padding: 0.85rem 2rem;
  background: #f5c518;
  color: #003087;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #e0b015;
    transform: scale(1.05);
  }
`;

const SkipButton = styled.button`
  margin-top: 1rem;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #f5c518;
  }
`;

function Signup() {
  const [step, setStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();
  const { signupData, signupErrors, updateSignupData, setSignupErrors } = useContext(UserContext);
  const { login, user, token } = useContext(AuthContext);

  const slides = [
    "https://img.freepik.com/free-photo/children-studying-outdoors_23-2147650688.jpg?ga=GA1.1.1416867470.1745098308&semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/handsome-young-indian-student-man-holding-notebooks-while-standing-street_231208-2772.jpg?semt=ais_hybrid&w=740",
    "https://img.freepik.com/free-photo/student-girl-with-notebook-backpack_23-2147689812.jpg?semt=ais_hybrid&w=740"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000); // Change slide every 20 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSignupData({ [name]: value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      setSignupErrors({ resume: "Please upload a PDF file." });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!signupData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) newErrors.email = 'Invalid email format';
    }
    if (step === 2) {
      if (!signupData.educationLevel) newErrors.educationLevel = 'Education level is required';
      if (!signupData.institutionName) newErrors.institutionName = 'Institution name is required';
      else if (signupData.institutionName.length < 2) newErrors.institutionName = 'Institution name must be at least 2 characters';
      if (!signupData.major) newErrors.major = 'Major is required';
      else if (signupData.major.length < 2) newErrors.major = 'Major must be at least 2 characters';
      if (!signupData.graduationMonth) newErrors.graduationMonth = 'Graduation month is required';
      if (!signupData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    }
    if (step === 3) {
      if (!signupData.password) newErrors.password = 'Password is required';
      else if (signupData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    }
    if (step === 4) {
      if (!signupData.name) newErrors.name = 'Name is required';
      else if (signupData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!signupData.about) newErrors.about = 'About section is required';
      else if (signupData.about.length < 5) newErrors.about = 'About must be at least 5 characters';
    }
    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
      } else if (step === 4) {
        try {
          console.log('Signup Details:', signupData);
          // Step 1: Register the user
          const signupResponse = await fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
          });
          if (!signupResponse.ok) {
            const errorData = await signupResponse.json();
            if (signupResponse.status === 422 && errorData.detail) {
              const newErrors = {};
              errorData.detail.forEach((err) => {
                const field = err.loc[1];
                newErrors[field] = err.msg;
              });
              setSignupErrors(newErrors);
              return;
            } else if (signupResponse.status === 400) {
              throw new Error(errorData.detail || 'Signup failed');
            } else {
              throw new Error('An unexpected error occurred');
            }
          }
          const signupDataResponse = await signupResponse.json();
          console.log(signupDataResponse.message);

          // Step 2: Sign in to get a token
          const signinResponse = await fetch('http://localhost:8000/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'username': signupData.email,
              'password': signupData.password,
            }),
          });
          if (!signinResponse.ok) {
            const errorData = await signinResponse.json();
            throw new Error(errorData.detail || 'Signin after signup failed');
          }
          const signinData = await signinResponse.json();

          // Step 3: Fetch user data with the token
          const userResponse = await fetch('http://localhost:8000/me', {
            headers: {
              Authorization: `Bearer ${signinData.access_token}`,
            },
          });
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data after signup');
          }
          const userData = await userResponse.json();

          // Step 4: Update AuthContext with user data and token
          login(userData, signinData.access_token);
          console.log('After login - User:', userData, 'Token:', signinData.access_token);

          // Move to the welcome animation step
          setStep(5);
        } catch (error) {
          const errorMessage = typeof error.message === 'string' ? error.message : 'An error occurred during signup';
          setSignupErrors({ general: errorMessage });
          console.error('Signup error:', error);
        }
      }
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setSignupErrors({ resume: "Please upload a resume to proceed." });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

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

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setSignupErrors({ resume: error.message });
      console.error('Resume upload error:', error);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Generate years from 2025 to 2035
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      {step === 5 ? (
        <WelcomeContainer>
          <WelcomeTitle>Welcome to CareerRise.com</WelcomeTitle>
          <Tagline>Your Journey to a Dream Career Starts Here!</Tagline>
          <ResumeUploadContainer>
            <Label style={{ color: 'white', fontSize: '1.2rem' }}>
              Upload Your Resume to Get Started
            </Label>
            <ResumeInput
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
            />
            {signupErrors.resume && <ErrorText style={{ color: '#f5c518' }}>{signupErrors.resume}</ErrorText>}
            <UploadButton onClick={handleResumeUpload}>Upload & Continue</UploadButton>
            <SkipButton onClick={handleSkip}>Skip for Now</SkipButton>
          </ResumeUploadContainer>
        </WelcomeContainer>
      ) : (
        <MainContainer>
          <RightContainer>
            {slides.map((slide, index) => (
              <Slide
                key={index}
                src={slide}
                alt={`signup image ${index + 1}`}
                active={index === currentSlide}
              />
            ))}
          </RightContainer>

          <LeftContainer>
            {step === 1 && (
              <>
                <Title>Let's find your next job</Title>
                <SubText>Join our community of job seekers, the best place for students to find jobs and internships.</SubText>
                <Form>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={signupData.email}
                    onChange={handleChange}
                  />
                  {signupErrors.email && <ErrorText>{signupErrors.email}</ErrorText>}
                  <SubText>Using an .edu email will get you quicker access to the platform.</SubText>
                  <Button onClick={handleNext}>Continue</Button>
                  <LinkText onClick={() => navigate('/signin')}>
                    Already have an account? Sign in here
                  </LinkText>
                  <LinkText>Are you an employer? Register here</LinkText>
                </Form>
              </>
            )}

            {step === 2 && (
              <>
                <Title>Education Details</Title>
                <Form>
                  <Label>Where are you studying?</Label>
                  <Select
                    name="educationLevel"
                    value={signupData.educationLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="school">School</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                  </Select>
                  {signupErrors.educationLevel && <ErrorText>{signupErrors.educationLevel}</ErrorText>}
                  <Label>Institution Name</Label>
                  <Input
                    type="text"
                    name="institutionName"
                    placeholder="Enter your school/college/university name"
                    value={signupData.institutionName}
                    onChange={handleChange}
                  />
                  {signupErrors.institutionName && <ErrorText>{signupErrors.institutionName}</ErrorText>}
                  <Label>Major</Label>
                  <Input
                    type="text"
                    name="major"
                    placeholder="Enter your major"
                    value={signupData.major}
                    onChange={handleChange}
                  />
                  {signupErrors.major && <ErrorText>{signupErrors.major}</ErrorText>}
                  <Label>Expected Graduation Date</Label>
                  <GraduationContainer>
                    <div>
                      <GraduationSelect
                        name="graduationMonth"
                        value={signupData.graduationMonth}
                        onChange={handleChange}
                      >
                        <option value="">Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </GraduationSelect>
                    </div>
                    <div>
                      <GraduationSelect
                        name="graduationYear"
                        value={signupData.graduationYear}
                        onChange={handleChange}
                      >
                        <option value="">Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </GraduationSelect>
                    </div>
                  </GraduationContainer>
                  {signupErrors.graduationMonth && <ErrorText>{signupErrors.graduationMonth}</ErrorText>}
                  {signupErrors.graduationYear && <ErrorText>{signupErrors.graduationYear}</ErrorText>}
                  <ButtonContainer>
                    <BackButton onClick={handleBack}>Back</BackButton>
                    <Button onClick={handleNext}>Continue</Button>
                  </ButtonContainer>
                </Form>
              </>
            )}

            {step === 3 && (
              <>
                <Title>Create a Password</Title>
                <Form>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={handleChange}
                  />
                  {signupErrors.password && <ErrorText>{signupErrors.password}</ErrorText>}
                  <ButtonContainer>
                    <BackButton onClick={handleBack}>Back</BackButton>
                    <Button onClick={handleNext}>Continue</Button>
                  </ButtonContainer>
                </Form>
              </>
            )}

            {step === 4 && (
              <>
                <Title>Tell Us About Yourself</Title>
                <Form>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={handleChange}
                  />
                  {signupErrors.name && <ErrorText>{signupErrors.name}</ErrorText>}
                  <Label>About Yourself</Label>
                  <TextArea
                    name="about"
                    placeholder="Tell us about yourself"
                    value={signupData.about}
                    onChange={handleChange}
                    rows="4"
                  />
                  {signupErrors.about && <ErrorText>{signupErrors.about}</ErrorText>}
                  {signupErrors.general && <ErrorText>{signupErrors.general}</ErrorText>}
                  <ButtonContainer>
                    <BackButton onClick={handleBack}>Back</BackButton>
                    <Button onClick={handleNext}>Finish</Button>
                  </ButtonContainer>
                </Form>
              </>
            )}
          </LeftContainer>
        </MainContainer>
      )}
    </>
  );
}

export default Signup;