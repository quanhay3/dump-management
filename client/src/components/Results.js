import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 70px);
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
`;

const Score = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${props => {
    if (props.percentage >= 80) return '#4CAF50';
    if (props.percentage >= 60) return '#FF9800';
    return '#f44336';
  }};
`;

const Message = styled.div`
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const DetailedResults = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  margin-bottom: 20px;
`;

const DetailTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

const QuestionResult = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  border-left: 4px solid ${props => props.isCorrect ? '#4CAF50' : '#f44336'};
  background: ${props => props.isCorrect ? '#e8f5e8' : '#ffebee'};
  
  .question-number {
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .result-status {
    font-weight: 600;
    color: ${props => props.isCorrect ? '#2e7d32' : '#c62828'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
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
  min-width: 150px;
  
  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: white;
  padding: 40px;
  
  h2 {
    margin-bottom: 20px;
  }
`;

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    return (
      <ResultsContainer>
        <EmptyState>
          <h2>Không có kết quả</h2>
          <p>Vui lòng làm bài quiz trước khi xem kết quả.</p>
          <Button className="primary" onClick={() => navigate('/quiz')}>
            Làm bài quiz
          </Button>
        </EmptyState>
      </ResultsContainer>
    );
  }

  const { score, total, percentage, results: detailedResults } = results;

  const getMessage = () => {
    if (percentage >= 80) return '🎉 Xuất sắc! Bạn đã nắm vững kiến thức!';
    if (percentage >= 60) return '👍 Khá tốt! Hãy ôn lại một số câu hỏi.';
    return '📚 Cần cố gắng thêm! Hãy ôn tập kỹ hơn.';
  };

  const correctAnswers = detailedResults.filter(result => result.isCorrect).length;
  const incorrectAnswers = total - correctAnswers;

  return (
    <ResultsContainer>
      <ResultCard>
        <Title>🎯 Kết Quả Quiz</Title>
        <Score percentage={percentage}>
          {score}/{total} ({percentage}%)
        </Score>
        <Message>{getMessage()}</Message>

        <StatsGrid>
          <StatCard>
            <div className="stat-number">{correctAnswers}</div>
            <div className="stat-label">Câu đúng</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{incorrectAnswers}</div>
            <div className="stat-label">Câu sai</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{percentage}%</div>
            <div className="stat-label">Tỷ lệ đúng</div>
          </StatCard>
        </StatsGrid>

        <ButtonGroup>
          <Button className="primary" onClick={() => navigate('/quiz')}>
            Làm lại
          </Button>
          <Button className="secondary" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </ButtonGroup>
      </ResultCard>

      <DetailedResults>
        <DetailTitle>📊 Chi Tiết Kết Quả</DetailTitle>
        {detailedResults.map((result, index) => (
          <QuestionResult key={index} isCorrect={result.isCorrect}>
            <div className="question-number">
              Câu {index + 1}
            </div>
            <div className="result-status">
              {result.isCorrect ? '✅ Đúng' : '❌ Sai'}
              {!result.isCorrect && (
                <span> - Đáp án đúng: {String.fromCharCode(65 + result.correctAnswer)}</span>
              )}
            </div>
          </QuestionResult>
        ))}
      </DetailedResults>
    </ResultsContainer>
  );
}

export default Results;