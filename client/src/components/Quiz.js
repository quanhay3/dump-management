import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 70px);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const Progress = styled.div`
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
  width: ${props => props.width}%;
`;

const QuestionCounter = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
`;

const QuestionText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #666;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 0;
    border: none;
    
    .question-number {
      font-size: 1rem;
      color: #999;
      font-weight: normal;
    }
    
    .topic {
      font-size: 1rem;
      color: #999;
      font-style: italic;
      font-weight: normal;
    }
  }
  
  .question-content {
    background: transparent;
    padding: 0;
    border: none;
    margin-bottom: 30px;
    box-shadow: none;
    
    p {
      margin-bottom: 16px;
      line-height: 1.6;
      color: #666;
      font-size: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .requirement-list {
      margin: 16px 0;
      background: transparent;
      border: none;
      padding: 0;
      border-radius: 0;
      
      .requirement-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .requirement-icon {
          margin-right: 8px;
          margin-top: 0;
          font-size: 1rem;
          color: #999;
          min-width: 16px;
          font-weight: normal;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        
        .requirement-text {
          flex: 1;
          line-height: 1.6;
          color: #666;
          font-size: 1rem;
        }
      }
    }
    
    .requirements-header {
      font-weight: normal;
      color: #666;
      margin-bottom: 12px;
      font-size: 1rem;
    }
  }
  
  .table-content {
    background: transparent;
    border: none;
    border-radius: 0;
    margin: 16px 0;
    overflow: visible;
    box-shadow: none;
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 1rem;
      
      th, td {
        padding: 8px 12px;
        text-align: left;
        border: 1px solid #ddd;
      }
      
      th {
        background: #f5f5f5;
        font-weight: normal;
        color: #666;
        font-size: 1rem;
      }
      
      td {
        color: #666;
        background: white;
      }
      
      tr:hover {
        background: inherit;
      }
    }
  }
  
  .question-ask {
    font-weight: normal;
    color: #666;
    margin-top: 20px;
    font-size: 1rem;
    padding: 0;
    border: none;
  }
`;

const AnswersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 30px;
`;

const AnswerOption = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  margin-bottom: 10px;
  
  .option-letter {
    font-weight: 600;
    color: #495057;
    margin-right: 8px;
  }
  
  .option-text {
    color: #212529;
  }
  
  &:hover:not(.disabled) {
    background: #f8f9fa;
    border-color: #2196F3;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
  
  &.selected {
    background: #e3f2fd;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
    
    .option-letter {
      color: #1976D2;
    }
    
    .option-text {
      color: #1976D2;
      font-weight: 500;
    }
  }
  
  &.correct {
    background: #e8f5e8;
    border-color: #4CAF50;
    
    .option-letter {
      color: #2e7d32;
      font-weight: 700;
    }
    
    .option-text {
      color: #2e7d32;
    }
    
    &::after {
      content: '✓';
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #4CAF50;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
  
  &.incorrect {
    background: #ffebee;
    border-color: #f44336;
    
    .option-letter {
      color: #c62828;
    }
    
    .option-text {
      color: #c62828;
    }
    
    &::after {
      content: '✗';
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #f44336;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
  
  &.disabled {
    cursor: not-allowed;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
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
  
  &.primary {
    background: #2196F3;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1976D2;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Feedback = styled.div`
  margin-top: 20px;
  
  .answer-box {
    background: #f8f9fa;
    border: 2px solid #dee2e6;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .answer-header {
      font-weight: 700;
      font-size: 1.2rem;
      margin-bottom: 20px;
      color: #2c3e50;
      padding-bottom: 10px;
      border-bottom: 2px solid #e9ecef;
      
      &.correct {
        color: #2e7d32;
        border-bottom-color: #4CAF50;
      }
      
      &.incorrect {
        color: #c62828;
        border-bottom-color: #f44336;
      }
    }
    
    .explanation {
      line-height: 1.7;
      color: #495057;
      font-size: 1rem;
      
      .reference {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
        font-size: 0.95rem;
        color: #666;
        
        a {
          color: #2196F3;
          text-decoration: none;
          font-weight: 500;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .community-vote {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 20px;
    
    .vote-header {
      font-weight: 600;
      margin-bottom: 12px;
      color: #495057;
      font-size: 1rem;
    }
    
    .vote-distribution {
      font-family: 'Courier New', monospace;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

// Helper function để clean text từ arrows
const cleanArrowsFromText = (text) => {
  return text
    .replace(/⇨/g, '')
    .replace(/→/g, '')
    .replace(/➤/g, '')
    .replace(/▶/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\s+:/g, ':')
    .trim();
};

// Helper function để format nội dung câu hỏi
const formatQuestionContent = (questionText) => {
  // Clean arrows first
  const cleanText = cleanArrowsFromText(questionText);
  
  // Tách câu hỏi thành các phần
  const parts = cleanText.split(/(?=What should you recommend\?|Which.*should.*\?|What.*\?)/i);
  
  if (parts.length > 1) {
    const context = parts[0].trim();
    const question = parts[1].trim();
    
    return (
      <>
        <div>{formatContextWithTable(context)}</div>
        <div className="question-ask">{question}</div>
      </>
    );
  }
  
  return <div>{formatContextWithTable(cleanText)}</div>;
};

// Helper function để format explanation
const formatExplanation = (explanation) => {
  if (!explanation || explanation === "Chưa có giải thích") {
    return <span>Không có giải thích chi tiết.</span>;
  }
  
  // Tách explanation và reference
  const parts = explanation.split(/(?=Tham khảo:|Reference:|https?:\/\/)/i);
  
  if (parts.length > 1) {
    const mainExplanation = parts[0].trim();
    const reference = parts.slice(1).join(' ').trim();
    
    return (
      <>
        <div>{mainExplanation}</div>
        <div className="reference">
          {reference.startsWith('http') ? (
            <a href={reference} target="_blank" rel="noopener noreferrer">
              {reference}
            </a>
          ) : (
            reference
          )}
        </div>
      </>
    );
  }
  
  return <div>{explanation}</div>;
};

// Helper function để format context có thể chứa bảng
const formatContextWithTable = (text) => {
  // Detect table content - more flexible detection
  if (text.includes('Division') && (text.includes('Azure subscription') || text.includes('Sub1') || text.includes('Sub2'))) {
    // Extract table data from text
    const tableMatch = text.match(/Division.*?Azure.*?tenant.*?East.*?Sub1.*?Contoso.*?West.*?Sub2.*?Fabrikam/i);
    
    if (tableMatch) {
      const beforeTable = text.substring(0, tableMatch.index);
      const afterTable = text.substring(tableMatch.index + tableMatch[0].length);
      
      return (
        <>
          {beforeTable && formatTextWithRequirements(beforeTable)}
          <div className="table-content">
            <table>
              <thead>
                <tr>
                  <th>Division</th>
                  <th>Azure subscription</th>
                  <th>Azure AD tenant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>East</td>
                  <td>Sub1</td>
                  <td>Contoso.com</td>
                </tr>
                <tr>
                  <td>West</td>
                  <td>Sub2</td>
                  <td>Fabrikam.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          {afterTable && formatTextWithRequirements(afterTable)}
        </>
      );
    }
  }
  
  return formatTextWithRequirements(text);
};

// Helper function để format text với requirements/bullet points
const formatTextWithRequirements = (text) => {
  // Trước tiên, tách các requirements từ text liền mạch
  const processedText = preprocessRequirements(text);
  const lines = processedText.split('\n').filter(line => line.trim());
  const result = [];
  let currentParagraph = [];
  let requirementItems = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip standalone arrow symbols or lines with just arrows
    if (line.match(/^(⇨|→|➤|▶)\s*$/) || line.match(/^\s*(⇨|→|➤|▶)\s*$/) || line === '⇨' || line === '→') {
      continue;
    }
    
    // Detect requirement items (lines starting with arrows, bullets, or dashes)
    if (line.match(/^(→|->|•|-|➤|▶|⇨)\s+/) || line.match(/^To the manager/i) || line.match(/^If the manager/i) || line.match(/^Minimize/i)) {
      // Save current paragraph if exists
      if (currentParagraph.length > 0) {
        result.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
        currentParagraph = [];
      }
      
      // Extract icon and text
      let icon = '⇨';
      let requirementText = line;
      
      if (line.match(/^(→|->|⇨)/)) {
        icon = '⇨';
        requirementText = line.replace(/^(→|->|⇨)\s*/, '');
      } else if (line.match(/^•/)) {
        icon = '⇨';
        requirementText = line.replace(/^•\s*/, '');
      } else if (line.match(/^-/)) {
        icon = '⇨';
        requirementText = line.replace(/^-\s*/, '');
      } else if (line.match(/^(➤|▶)/)) {
        icon = '⇨';
        requirementText = line.replace(/^(➤|▶)\s*/, '');
      } else {
        // For lines like "To the manager", "If the manager", etc.
        icon = '⇨';
      }
      
      requirementItems.push({
        icon,
        text: requirementText
      });
    } else if (requirementItems.length > 0 && line.length > 0) {
      // This might be a continuation of the last requirement
      if (requirementItems.length > 0) {
        requirementItems[requirementItems.length - 1].text += ' ' + line;
      }
    } else {
      // Regular paragraph text
      if (requirementItems.length > 0) {
        // Check if we need a requirements header
        const needsHeader = currentParagraph.some(p => 
          p.includes('following requirements') || 
          p.includes('must meet') ||
          p.includes('requirements:')
        );
        
        if (needsHeader && currentParagraph.length > 0) {
          result.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
          currentParagraph = [];
        }
        
        // Flush requirement items
        result.push(
          <div key={`req-${i}`} className="requirement-list">
            {requirementItems.map((item, idx) => (
              <div key={idx} className="requirement-item">
                <span className="requirement-icon">{item.icon}</span>
                <span className="requirement-text">{item.text}</span>
              </div>
            ))}
          </div>
        );
        requirementItems = [];
      }
      
      if (line.length > 0) {
        currentParagraph.push(line);
      } else if (currentParagraph.length > 0) {
        // Empty line - end current paragraph
        result.push(<p key={`p-${i}`}>{currentParagraph.join(' ')}</p>);
        currentParagraph = [];
      }
    }
  }
  
  // Flush remaining content
  if (requirementItems.length > 0) {
    result.push(
      <div key="req-final" className="requirement-list">
        {requirementItems.map((item, idx) => (
          <div key={idx} className="requirement-item">
            <span className="requirement-icon">{item.icon}</span>
            <span className="requirement-text">{item.text}</span>
          </div>
        ))}
      </div>
    );
  }
  
  if (currentParagraph.length > 0) {
    result.push(<p key="p-final">{currentParagraph.join(' ')}</p>);
  }
  
  return result;
};

// Helper function để preprocess text và tách requirements
const preprocessRequirements = (text) => {
  // Aggressive cleanup of all existing arrows first
  let cleanText = text
    // Remove ALL arrow symbols from the text completely
    .replace(/⇨/g, '')
    .replace(/→/g, '')
    .replace(/➤/g, '')
    .replace(/▶/g, '')
    // Clean up spaces left behind
    .replace(/\s+/g, ' ')
    // Clean up punctuation issues
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\s+:/g, ':')
    .trim()
    
  // Only add arrows for actual requirements that start with specific patterns
  return cleanText
    // Tách trước "To the manager", "If the manager", etc. chỉ khi chúng xuất hiện sau requirements:
    .replace(/(requirements:|following requirements:)\s+(To the manager|If the manager|Minimize)/gi, '$1\n⇨ $2')
    .replace(/\.\s+(To the manager|If the manager|Minimize)/gi, '.\n⇨ $1')
    // Clean up multiple newlines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data.data);
      setUserAnswers(new Array(response.data.data.length).fill(null));
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải câu hỏi:', error);
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex) => {
    if (isAnswered) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const checkAnswer = async () => {
    if (userAnswers[currentQuestionIndex] === null) {
      alert('Vui lòng chọn một đáp án!');
      return;
    }

    try {
      const response = await axios.post('/api/submit-answer', {
        questionId: questions[currentQuestionIndex].id,
        selectedAnswer: userAnswers[currentQuestionIndex]
      });

      setFeedback(response.data.data);
      setIsAnswered(true);
    } catch (error) {
      console.error('Lỗi khi kiểm tra đáp án:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setFeedback(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsAnswered(false);
      setFeedback(null);
    }
  };

  const finishQuiz = async () => {
    const answers = questions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: userAnswers[index]
    }));

    try {
      const response = await axios.post('/api/submit-quiz', { answers });
      navigate('/results', { state: { results: response.data.data } });
    } catch (error) {
      console.error('Lỗi khi nộp bài:', error);
    }
  };

  if (loading) {
    return (
      <QuizContainer>
        <Loading>
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Đang tải câu hỏi...</span>
        </Loading>
      </QuizContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <QuizContainer>
        <QuestionCard>
          <h2>Không có câu hỏi nào</h2>
          <p>Vui lòng tải lên file PDF hoặc liên hệ quản trị viên.</p>
          <Button className="primary" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        </QuestionCard>
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <QuizContainer>
      <Header>
        <Title>🎓 Ôn Tập Trắc Nghiệm</Title>
        <ProgressBar>
          <Progress width={progress} />
        </ProgressBar>
        <QuestionCounter>
          {currentQuestionIndex + 1} / {questions.length}
        </QuestionCounter>
      </Header>

      <QuestionCard>
        <QuestionText>
          <div className="question-header">
            <span className="question-number">Question #{currentQuestionIndex + 1}</span>
            <span className="topic">Topic 1</span>
          </div>
          <div className="question-content">
            {formatQuestionContent(currentQuestion.question)}
          </div>
        </QuestionText>
        
        <AnswersContainer>
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={index}
              className={`
                ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}
                ${isAnswered && feedback ? (
                  index === feedback.correctAnswer ? 'correct' : 
                  (index === userAnswers[currentQuestionIndex] && !feedback.isCorrect ? 'incorrect' : '')
                ) : ''}
                ${isAnswered ? 'disabled' : ''}
              `}
              onClick={() => selectAnswer(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
              <span className="option-text">{option}</span>
            </AnswerOption>
          ))}
        </AnswersContainer>

        {feedback && (
          <Feedback>
            <div className="answer-box">
              <div className={`answer-header ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                Correct Answer: {String.fromCharCode(65 + feedback.correctAnswer)}
              </div>
              <div className="explanation">
                {formatExplanation(feedback.explanation)}
              </div>
            </div>
            <div className="community-vote">
              <div className="vote-header">Community vote distribution</div>
              <div className="vote-distribution">
                {String.fromCharCode(65 + feedback.correctAnswer)} (100%)
              </div>
            </div>
          </Feedback>
        )}

        <Controls>
          <Button 
            className="secondary" 
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Câu trước
          </Button>
          
          {!isAnswered ? (
            <Button className="primary" onClick={checkAnswer}>
              Kiểm tra đáp án
            </Button>
          ) : (
            currentQuestionIndex === questions.length - 1 ? (
              <Button className="primary" onClick={finishQuiz}>
                Hoàn thành
              </Button>
            ) : (
              <Button className="primary" onClick={nextQuestion}>
                Câu tiếp →
              </Button>
            )
          )}
          
          <Button 
            className="secondary" 
            onClick={nextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Câu tiếp →
          </Button>
        </Controls>
      </QuestionCard>
    </QuizContainer>
  );
}

export default Quiz;