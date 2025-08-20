import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 70px);
  text-align: center;
  color: white;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 200px;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
    }
  }
  
  &.secondary {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
    padding: 12px 24px;
  }
`;

const FeatureList = styled.div`
  margin-top: 60px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 800px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  p {
    opacity: 0.9;
    line-height: 1.5;
  }
`;

function Home() {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Title>🎓 Ôn Tập Trắc Nghiệm</Title>
      <Subtitle>
        Nền tảng ôn tập trắc nghiệm thông minh với giao diện thân thiện. 
        Tải lên file PDF câu hỏi của bạn hoặc bắt đầu với bộ câu hỏi mẫu.
      </Subtitle>
      
      <ButtonGroup>
        <Button 
          className="primary" 
          onClick={() => navigate('/quiz')}
        >
          🚀 Bắt đầu ôn tập
        </Button>
        <Button 
          className="secondary" 
          onClick={() => navigate('/upload')}
        >
          📄 Tải lên PDF
        </Button>
      </ButtonGroup>
      
      <FeatureList>
        <FeatureCard>
          <h3>✅ Kiểm tra ngay lập tức</h3>
          <p>Nhận phản hồi và giải thích chi tiết cho từng câu hỏi</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📊 Theo dõi tiến độ</h3>
          <p>Thanh tiến trình và thống kê kết quả chi tiết</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📱 Responsive Design</h3>
          <p>Tương thích hoàn hảo trên mọi thiết bị</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📄 Hỗ trợ PDF</h3>
          <p>Tự động phân tích và chuyển đổi file PDF thành câu hỏi</p>
        </FeatureCard>
      </FeatureList>
    </HomeContainer>
  );
}

export default Home;