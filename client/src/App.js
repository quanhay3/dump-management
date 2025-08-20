import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import UploadPDF from './components/UploadPDF';
import FileManager from './components/FileManager';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  min-height: calc(100vh - 70px);
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPDF />} />
            <Route path="/files" element={<FileManager />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;