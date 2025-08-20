import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    flex-direction: column;
    padding: 20px;
    gap: 15px;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 12px;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const FileInput = styled.input`
  display: none;
`;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Chuyển đến trang upload với file đã chọn
      navigate('/upload', { state: { selectedFile: file } });
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('header-file-input').click();
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo onClick={() => navigate('/')}>
          🎓 Quiz App
        </Logo>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink 
            className={isActive('/') ? 'active' : ''}
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
          >
            🏠 Trang chủ
          </NavLink>
          
          <NavLink 
            className={isActive('/quiz') ? 'active' : ''}
            onClick={() => {
              navigate('/quiz');
              setIsMenuOpen(false);
            }}
          >
            📝 Làm bài
          </NavLink>
          
          <NavLink 
            className={isActive('/files') ? 'active' : ''}
            onClick={() => {
              navigate('/files');
              setIsMenuOpen(false);
            }}
          >
            📁 Quản lý file
          </NavLink>
          
          <NavLink 
            className={isActive('/upload') ? 'active' : ''}
            onClick={() => {
              navigate('/upload');
              setIsMenuOpen(false);
            }}
          >
            📄 Upload PDF
          </NavLink>

          <UploadButton onClick={triggerFileUpload}>
            ⚡ Upload nhanh
          </UploadButton>
        </NavLinks>

        <MobileMenuButton 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <FileInput
          id="header-file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
        />
      </Nav>
    </HeaderContainer>
  );
}

export default Header;