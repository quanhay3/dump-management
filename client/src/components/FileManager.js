import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const FileManagerContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 70px);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 20px;
`;

const FileList = styled.div`
  display: grid;
  gap: 15px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .file-icon {
      font-size: 2rem;
      color: #f44336;
    }
    
    .file-details {
      .file-name {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .file-meta {
        font-size: 0.9rem;
        color: #666;
      }
    }
  }
  
  .file-actions {
    display: flex;
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  }
  
  &.secondary {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
    }
  }
  
  &.danger {
    background: #f44336;
    color: white;
    
    &:hover {
      background: #d32f2f;
    }
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2196F3;
    background: #f0f8ff;
  }
  
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #666;
  }
  
  .upload-text {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 10px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    margin-bottom: 10px;
    color: #2c3e50;
  }
`;

function FileManager() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập danh sách file đã upload (trong thực tế sẽ lấy từ API)
    const mockFiles = [
      {
        id: 1,
        name: 'Azure_Questions_Set1.pdf',
        size: '2.5 MB',
        uploadDate: '2024-01-15',
        questionsCount: 50,
        status: 'processed'
      },
      {
        id: 2,
        name: 'AWS_Practice_Test.pdf',
        size: '1.8 MB',
        uploadDate: '2024-01-14',
        questionsCount: 35,
        status: 'processed'
      }
    ];
    
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFileUpload = () => {
    navigate('/upload');
  };

  const handleUseFile = (file) => {
    // Trong thực tế sẽ load questions từ file này
    navigate('/quiz');
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Bạn có chắc muốn xóa file này?')) {
      setFiles(files.filter(f => f.id !== fileId));
    }
  };

  if (loading) {
    return (
      <FileManagerContainer>
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px', color: 'white' }}>Đang tải danh sách file...</span>
        </div>
      </FileManagerContainer>
    );
  }

  return (
    <FileManagerContainer>
      <Header>
        <Title>📁 Quản Lý File</Title>
      </Header>

      <Card>
        <UploadArea onClick={handleFileUpload}>
          <div className="upload-icon">📄</div>
          <div className="upload-text">Tải lên file PDF mới</div>
          <div style={{ fontSize: '0.9rem', color: '#999' }}>
            Click để chọn file hoặc kéo thả vào đây
          </div>
        </UploadArea>

        {files.length === 0 ? (
          <EmptyState>
            <div className="empty-icon">📂</div>
            <h3>Chưa có file nào</h3>
            <p>Tải lên file PDF đầu tiên để bắt đầu</p>
          </EmptyState>
        ) : (
          <FileList>
            <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>
              File đã tải lên ({files.length})
            </h3>
            {files.map(file => (
              <FileItem key={file.id}>
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {file.size} • {file.questionsCount} câu hỏi • {file.uploadDate}
                    </div>
                  </div>
                </div>
                <div className="file-actions">
                  <Button 
                    className="primary" 
                    onClick={() => handleUseFile(file)}
                  >
                    Sử dụng
                  </Button>
                  <Button 
                    className="secondary" 
                    onClick={() => navigate('/upload')}
                  >
                    Tải lại
                  </Button>
                  <Button 
                    className="danger" 
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </FileItem>
            ))}
          </FileList>
        )}
      </Card>
    </FileManagerContainer>
  );
}

export default FileManager;