import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const UploadContainer = styled.div`
  max-width: 600px;
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

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const UploadCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 20px;
`;

const DropZone = styled.div`
  border: 3px dashed #ddd;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover, &.dragover {
    border-color: #2196F3;
    background: #f0f8ff;
  }
  
  &.uploading {
    border-color: #4CAF50;
    background: #f0fff0;
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
  
  .upload-hint {
    font-size: 0.9rem;
    color: #999;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const SelectedFile = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .file-icon {
      font-size: 1.5rem;
      color: #f44336;
    }
    
    .file-details {
      .file-name {
        font-weight: 600;
        color: #2c3e50;
      }
      
      .file-size {
        font-size: 0.9rem;
        color: #666;
      }
    }
  }
  
  .remove-btn {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #d32f2f;
    }
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-bottom: 10px;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover:not(:disabled) {
      background: #5a6268;
      transform: translateY(-2px);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 15px;
  
  .progress {
    height: 100%;
    background: #4CAF50;
    transition: width 0.3s ease;
    width: ${props => props.progress}%;
  }
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  &.success {
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #4CAF50;
  }
  
  &.error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #f44336;
  }
  
  &.info {
    background: #e3f2fd;
    color: #1976D2;
    border: 1px solid #2196F3;
  }
`;

const Instructions = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
  
  h3 {
    margin-bottom: 15px;
    color: #fff;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
      
      &:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #4CAF50;
        font-weight: bold;
      }
    }
  }
`;

function UploadPDF() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Nhận file từ header nếu có
  useEffect(() => {
    if (location.state?.selectedFile) {
      setSelectedFile(location.state.selectedFile);
      setMessage({
        type: 'info',
        text: 'File đã được chọn từ menu. Nhấn "Tải lên và phân tích" để tiếp tục.'
      });
    }
  }, [location.state]);

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setMessage(null);
    } else {
      setMessage({
        type: 'error',
        text: 'Vui lòng chọn file PDF hợp lệ!'
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setMessage(null);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setMessage({
        type: 'success',
        text: response.data.message
      });

      // Chuyển đến trang quiz sau 2 giây
      setTimeout(() => {
        navigate('/quiz');
      }, 2000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Lỗi khi tải lên file!'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <UploadContainer>
      <Header>
        <Title>📄 Tải Lên File PDF</Title>
        <Subtitle>
          Tải lên file PDF chứa câu hỏi và đáp án để tạo bài quiz của bạn
        </Subtitle>
      </Header>

      <Instructions>
        <h3>📋 Định dạng PDF được hỗ trợ:</h3>
        <ul>
          <li>Format Azure/Microsoft: "Question #1", "Question #2"...</li>
          <li>Format đơn giản: "1.", "2.", "3."...</li>
          <li>Các đáp án: A., B., C., D. hoặc A B C D</li>
          <li>Đáp án đúng: "Correct Answer: A" hoặc "Đáp án: A"</li>
          <li>File PDF phải có thể đọc được (không phải hình ảnh scan)</li>
        </ul>
      </Instructions>

      <UploadCard>
        {message && (
          <Message className={message.type}>
            {message.text}
          </Message>
        )}

        {uploading && (
          <ProgressBar progress={uploadProgress}>
            <div className="progress"></div>
          </ProgressBar>
        )}

        <DropZone
          className={`${dragOver ? 'dragover' : ''} ${uploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="upload-icon">
            {uploading ? '⏳' : '📄'}
          </div>
          <div className="upload-text">
            {uploading ? 'Đang tải lên...' : 'Kéo thả file PDF vào đây'}
          </div>
          <div className="upload-hint">
            hoặc click để chọn file
          </div>
        </DropZone>

        <FileInput
          id="file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
        />

        {selectedFile && (
          <SelectedFile>
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
            </div>
            <button className="remove-btn" onClick={removeFile}>
              ×
            </button>
          </SelectedFile>
        )}

        <Button
          className="primary"
          onClick={uploadFile}
          disabled={!selectedFile || uploading}
        >
          {uploading ? `Đang tải lên... ${uploadProgress}%` : 'Tải lên và phân tích'}
        </Button>

        <Button
          className="secondary"
          onClick={() => navigate('/')}
          disabled={uploading}
        >
          Quay lại trang chủ
        </Button>
      </UploadCard>
    </UploadContainer>
  );
}

export default UploadPDF;