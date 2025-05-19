import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f6f5;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled.a`
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #003087;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #003087;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
`;

const UserName = styled.span`
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 1000;
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
  transition: background 0.3s ease;
  &:hover {
    background: #f5f6f5;
  }
`;

const MainContent = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 2;
`;

const RightColumn = styled.div`
  flex: 1;
  @media (max-width: 1024px) {
    order: -1;
  }
`;

const ProfileBanner = styled.div`
  background: #003087;
  color: white;
  padding: 2rem;
  border-radius: 8px 8px 0 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ProfilePicture = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #fff;
  font-weight: 700;
  border: 3px solid #fff;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

const ProfileDetails = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProfileInstitution = styled.p`
  font-size: 1.1rem;
  margin: 0.25rem 0;
`;

const ProfileMajor = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 0.75rem;
`;

const InfoTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const InfoSubtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0.25rem 0;
`;

const InfoDetails = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const VisibilitySection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const VisibilityText = styled.div`
  flex: 1;
`;

const VisibilityTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0;
`;

const VisibilityMessage = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0.5rem 0 0;
`;

const VisibilityButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) => (props.primary ? '#003087' : '#4b5e40')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.primary ? '#002669' : '#3a4a30')};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem;
  }
`;

const StrengthSection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StrengthTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Progress = styled.div`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #4b5e40;
  border-radius: 4px;
`;

const Checklist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChecklistItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const CheckIcon = styled.span`
  color: #4b5e40;
  font-size: 1.1rem;
`;

const AddIcon = styled.span`
  color: #003087;
  font-size: 1.1rem;
`;

// New styled components for the resume section
const ResumeContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f9fafb;
`;

const ResumeLink = styled.a`
  color: #003087;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #002669;
    text-decoration: underline;
  }
`;

const NoResumeText = styled.p`
  color: #718096;
  font-size: 1rem;
  font-style: italic;
`;

function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [profileProgress, setProfileProgress] = useState(50);
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    // Redirect admins to /admin
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    // Generate a URL for the resume if it exists
    if (user?.resume) {
      const blob = base64ToBlob(user.resume, 'application/pdf');
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);

      // Cleanup URL on component unmount
      return () => URL.revokeObjectURL(url);
    }

    const calculateProgress = () => {
      if (!user) return;
      const fields = [
        user.educationLevel,
        user.institutionName,
        user.major,
        user.graduationMonth,
        user.graduationYear,
        user.name,
        user.about,
        user.resume // Include resume in progress calculation
      ];
      const completed = fields.filter(field => field).length;
      const progress = (completed / fields.length) * 100;
      setProfileProgress(progress);
    };

    calculateProgress();
  }, [user, token, navigate]);

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
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

  const toggleProfileVisibility = () => {
    setIsProfilePublic(!isProfilePublic);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Logo>CareerRise.com</Logo>
        <Nav>
          <NavLink href="#">For You</NavLink>
          <NavLink href="#">Jobs</NavLink>
          <NavLink href="#">Events</NavLink>
          <NavLink href="#">Students</NavLink>
          <NavLink href="#">Career Center</NavLink>
        </Nav>
        <UserProfile>
          <UserAvatar>{getInitial()}</UserAvatar>
          <UserName onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.name || 'User'}
          </UserName>
          <Dropdown isOpen={dropdownOpen}>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        </UserProfile>
      </Header>

      <MainContent>
        <LeftColumn>
          <ProfileBanner>
            <ProfilePicture>{getInitial()}</ProfilePicture>
            <ProfileDetails>
              <ProfileName>{user?.name || 'User'}</ProfileName>
              <ProfileInstitution>{user?.institutionName || 'Not specified'}</ProfileInstitution>
              <ProfileMajor>
                {user?.major || 'Not specified'} • Graduates{' '}
                {user?.graduationMonth && user?.graduationYear
                  ? `${user.graduationMonth} ${user.graduationYear}`
                  : 'Not specified'}
              </ProfileMajor>
            </ProfileDetails>
          </ProfileBanner>

          <Section>
            <SectionTitle>Education</SectionTitle>
            <InfoItem>
              <InfoTitle>{user?.institutionName || 'Not specified'}</InfoTitle>
              <InfoSubtitle>Bachelor's, {user?.major || 'Not specified'}</InfoSubtitle>
              <InfoDetails>
                {user?.graduationMonth && user?.graduationYear
                  ? `${user.graduationMonth} ${user.graduationYear}`
                  : 'Not specified'}
              </InfoDetails>
            </InfoItem>
          </Section>

          <Section>
            <SectionTitle>Work Experience</SectionTitle>
            <InfoItem>
              <InfoTitle>Career Coach at {user?.institutionName || 'Not specified'}</InfoTitle>
              <InfoSubtitle>
                {user?.graduationMonth && user?.graduationYear
                  ? `${user.graduationMonth} ${user.graduationYear} - Present`
                  : 'Not specified'}
              </InfoSubtitle>
              <InfoDetails>
                {user?.about || 'No work experience details provided.'}
              </InfoDetails>
            </InfoItem>
          </Section>

          <Section>
            <SectionTitle>Your Resume</SectionTitle>
            {user.resume ? (
              <ResumeContainer>
                <ResumeLink href={resumeUrl} download="resume.pdf">
                  View/Download Your Resume
                </ResumeLink>
              </ResumeContainer>
            ) : (
              <NoResumeText>No resume uploaded yet.</NoResumeText>
            )}
          </Section>
        </LeftColumn>

        <RightColumn>
          <VisibilitySection>
            <VisibilityText>
              <VisibilityTitle>
                {isProfilePublic
                  ? 'Your profile is public'
                  : 'Your profile is hidden from employers'}
              </VisibilityTitle>
              <VisibilityMessage>
                {isProfilePublic
                  ? 'Employers can search for you and message you about job opportunities.'
                  : 'By marking your profile as private, over 200,000 employers cannot search for you or message you about job or internship opportunities.'}
              </VisibilityMessage>
            </VisibilityText>
            <VisibilityButton onClick={toggleProfileVisibility} primary>
              {isProfilePublic ? 'Make Profile Private' : 'Make Profile Public'}
            </VisibilityButton>
            <VisibilityButton>See Employer View</VisibilityButton>
          </VisibilitySection>

          <StrengthSection>
            <StrengthTitle>Profile Level: {profileProgress >= 100 ? 'Complete' : `${Math.round(profileProgress)}%`}</StrengthTitle>
            <ProgressBar>
              <Progress progress={profileProgress} />
            </ProgressBar>
            <Checklist>
              <ChecklistItem>
                {user?.educationLevel ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} Education Level
              </ChecklistItem>
              <ChecklistItem>
                {user?.institutionName ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} Institution Name
              </ChecklistItem>
              <ChecklistItem>
                {user?.major ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} Major
              </ChecklistItem>
              <ChecklistItem>
                {(user?.graduationMonth && user?.graduationYear) ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} Graduation Date
              </ChecklistItem>
              <ChecklistItem>
                {user?.about ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} About
              </ChecklistItem>
              <ChecklistItem>
                {user?.resume ? <CheckIcon>✔</CheckIcon> : <AddIcon>+</AddIcon>} Resume
              </ChecklistItem>
            </Checklist>
          </StrengthSection>
        </RightColumn>
      </MainContent>
    </Container>
  );
}

export default Dashboard;