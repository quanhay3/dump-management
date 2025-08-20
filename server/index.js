const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF!'), false);
    }
  }
});

// Sample questions data
let questions = [
  {
    id: 1,
    question: "You have an Azure subscription that contains a custom application named Application1. Application1 was developed by an external company named Fabrikam, Ltd. Developers at Fabrikam were assigned role-based access control (RBAC) permissions to the Application1 components. All users are licensed for the Microsoft 365 E5 plan. You need to recommend a solution to verify whether the Fabrikam developers still require permissions to Application1. The solution must meet the following requirements: To the manager of the developers, send a monthly email message that lists the access permissions to Application1. If the manager does not verify an access permission, automatically revoke that permission. Minimize development effort. What should you recommend?",
    options: [
      "In Azure Active Directory (Azure AD), create an access review of Application1.",
      "Create an Azure Automation runbook that runs the Get-AzRoleAssignment cmdlet.",
      "In Azure Active Directory (Azure AD) Privileged Identity Management, create a custom role assignment for the Application1 resources.",
      "Create an Azure Automation runbook that runs the Get-AzureADUserAppRoleAssignment cmdlet."
    ],
    correctAnswer: 0,
    explanation: "Azure AD Access Reviews allows you to periodically review and verify user access permissions. This feature can automatically send email notifications to managers and revoke access if not verified, meeting all the specified requirements with minimal development effort.\n\nReference: https://docs.microsoft.com/en-us/azure/active-directory/governance/manage-user-access-with-access-reviews"
  },
  {
    id: 2,
    question: "Your company has the divisions shown in the following table. Division Azure subscription Azure AD tenant East Sub1 Contoso.com West Sub2 Fabrikam.com Sub1 contains an Azure App Service web app named App1. App1 uses Azure AD for single-tenant user authentication. Users from contoso.com can authenticate to App1. You need to recommend a solution to enable users in the fabrikam.com tenant to authenticate to App1. What should you recommend?",
    options: [
      "Configure Azure AD join.",
      "Use Azure AD entitlement management to govern external users.",
      "Enable Azure AD pass-through authentication and update the sign-in endpoint.",
      "Configure assignments for the fabrikam.com users by using Azure AD Privileged Identity Management (PIM)."
    ],
    correctAnswer: 1,
    explanation: "Azure AD entitlement management allows you to manage access for external users from different tenants. This is the correct solution for enabling cross-tenant authentication while maintaining security and governance."
  },
  {
    id: 3,
    question: "You have an Azure subscription. The subscription has a blob container that contains multiple blobs. Ten users in the finance department of your company plan to access the blobs during the month of April. You need to recommend a solution to enable access to the blobs during the month of April only. Which security solution should you include in the recommendation?",
    options: [
      "shared access signatures (SAS)",
      "Conditional Access policies", 
      "certificates",
      "access keys"
    ],
    correctAnswer: 0,
    explanation: "Shared Access Signatures (SAS) allows for limited-time fine grained access control to resources. You can generate URL, specify duration (for month of April) and disseminate URL to 10 team members. On May 1, the SAS token is automatically invalidated, denying team members continued access.\n\nReference: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview"
  }
];

// Routes
app.get('/api/questions', (req, res) => {
  res.json({
    success: true,
    data: questions
  });
});

app.get('/api/questions/:id', (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy câu hỏi'
    });
  }

  res.json({
    success: true,
    data: question
  });
});

app.post('/api/submit-answer', (req, res) => {
  const { questionId, selectedAnswer } = req.body;
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy câu hỏi'
    });
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

  res.json({
    success: true,
    data: {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    }
  });
});

app.post('/api/submit-quiz', (req, res) => {
  const { answers } = req.body; // Array of {questionId, selectedAnswer}

  let score = 0;
  const results = answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) score++;

    return {
      questionId: answer.questionId,
      isCorrect,
      correctAnswer: question.correctAnswer,
      selectedAnswer: answer.selectedAnswer
    };
  });

  const percentage = Math.round((score / questions.length) * 100);

  res.json({
    success: true,
    data: {
      score,
      total: questions.length,
      percentage,
      results
    }
  });
});

// Upload PDF và parse câu hỏi
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file PDF'
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);

    // Xóa file sau khi đọc
    fs.unlinkSync(req.file.path);

    console.log('PDF Text Preview:', pdfData.text.substring(0, 500));
    console.log('PDF Text Length:', pdfData.text.length);

    // Thử parse với nhiều format khác nhau
    console.log('Trying main parser...');
    let parsedQuestions = parsePdfToQuestions(pdfData.text);
    console.log(`Main parser found ${parsedQuestions.length} questions`);

    // Nếu không parse được, thử format đơn giản hơn
    if (parsedQuestions.length === 0) {
      console.log('Main parser failed, trying simple format...');
      parsedQuestions = parseSimpleFormat(pdfData.text);
    }

    // Nếu vẫn không được, thử parser cho cấu trúc bảng
    if (parsedQuestions.length === 0) {
      console.log('Simple parser failed, trying table format...');
      parsedQuestions = parseTableFormat(pdfData.text);
    }

    // Debug: Log structure analysis
    const lines = pdfData.text.split('\n');
    console.log('Total lines in PDF:', lines.length);
    console.log('First 10 lines:', lines.slice(0, 10));
    console.log('Sample middle lines:', lines.slice(Math.floor(lines.length / 2), Math.floor(lines.length / 2) + 10));

    if (parsedQuestions.length > 0) {
      questions = parsedQuestions;
      console.log(`Parsed ${parsedQuestions.length} questions successfully`);
    }

    res.json({
      success: true,
      message: `Đã tải lên và phân tích ${parsedQuestions.length} câu hỏi`,
      data: {
        questionsCount: parsedQuestions.length,
        preview: parsedQuestions.slice(0, 2), // Preview 2 câu đầu
        rawTextPreview: pdfData.text.substring(0, 300) // Debug info
      }
    });

  } catch (error) {
    console.error('Lỗi khi xử lý PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xử lý file PDF: ' + error.message
    });
  }
});

// Hàm parse format đơn giản (fallback)
function parseSimpleFormat(text) {
  console.log('Trying simple format parser...');
  const lines = text.split('\n').filter(line => line.trim());
  const parsedQuestions = [];
  let currentQuestion = null;
  let questionId = 1;
  let questionText = '';
  let collectingQuestion = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Try to detect question by number or "Question" keyword
    if (line.match(/^\d+[\.\)]/) || line.match(/^Question/i)) {
      // Save previous question
      if (currentQuestion && currentQuestion.options.length >= 2) {
        if (questionText && !currentQuestion.question) {
          currentQuestion.question = questionText.trim();
        }
        parsedQuestions.push(currentQuestion);
      }

      currentQuestion = {
        id: questionId++,
        question: line.match(/^\d+[\.\)]/) ? line : '',
        options: [],
        correctAnswer: 0,
        explanation: "Chưa có giải thích"
      };

      if (line.match(/^Question/i)) {
        collectingQuestion = true;
        questionText = '';
      } else {
        collectingQuestion = false;
      }
    }
    // Collect question text
    else if (collectingQuestion && !line.match(/^[A-D][\.\s]/)) {
      if (!line.match(/^Topic/i) && line.length > 0) {
        questionText += (questionText ? ' ' : '') + line;
      }
    }
    // Detect options (A., B., C., D.)
    else if (line.match(/^[A-D][\.\s]/)) {
      if (currentQuestion) {
        collectingQuestion = false;
        if (questionText && !currentQuestion.question) {
          currentQuestion.question = questionText.trim();
        }

        const optionText = line.replace(/^[A-D][\.\s]+/, '').trim();
        currentQuestion.options.push(optionText);
      }
    }
    // Detect correct answer
    else if (line.match(/^Correct\s*Answer\s*:\s*[A-D]/i) ||
      line.includes('Đáp án:') ||
      line.includes('Answer:')) {
      if (currentQuestion) {
        const answerMatch = line.match(/[A-D]/i);
        if (answerMatch) {
          currentQuestion.correctAnswer = answerMatch[0].toUpperCase().charCodeAt(0) - 65;
        }
      }
    }
  }

  // Add last question
  if (currentQuestion && currentQuestion.options.length >= 2) {
    if (questionText && !currentQuestion.question) {
      currentQuestion.question = questionText.trim();
    }
    parsedQuestions.push(currentQuestion);
  }

  console.log(`Simple parser found ${parsedQuestions.length} questions`);
  return parsedQuestions;
}

// Hàm parse PDF text thành câu hỏi (tùy chỉnh cho format Azure/Microsoft với cấu trúc box)
function parsePdfToQuestions(text) {
  console.log('Starting advanced PDF parsing for boxed format...');

  // Tách text thành các khối câu hỏi dựa trên Question number
  const questionBlocks = extractBoxedQuestions(text);
  console.log(`Found ${questionBlocks.length} question blocks`);

  const parsedQuestions = [];
  let questionId = 1;

  for (const block of questionBlocks) {
    const question = parseBoxedQuestion(block, questionId);
    if (question && question.options.length >= 2) {
      parsedQuestions.push(question);
      questionId++;
    }
  }

  console.log(`Successfully parsed ${parsedQuestions.length} questions`);
  return parsedQuestions;
}

// Tách text thành các khối câu hỏi
function extractBoxedQuestions(text) {
  const blocks = [];

  // Tách theo pattern "Question #X" với xử lý box structure
  const questionPattern = /Question\s*#?\d+/gi;
  const matches = [...text.matchAll(questionPattern)];

  console.log(`Found ${matches.length} question headers`);

  if (matches.length === 0) {
    console.log('No question patterns found, trying alternative approach');
    // Thử tìm pattern khác như số đơn thuần
    const numberPattern = /^\d+\./gm;
    const numberMatches = [...text.matchAll(numberPattern)];
    if (numberMatches.length > 0) {
      console.log(`Found ${numberMatches.length} numbered items`);
      return extractByNumbers(text, numberMatches);
    }
    return [text]; // Fallback: treat entire text as one block
  }

  for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;

    const block = text.substring(startIndex, endIndex).trim();
    if (block.length > 30) { // Include smaller blocks for boxed format
      blocks.push(block);
      console.log(`Block ${i + 1} length: ${block.length} chars`);
    }
  }

  return blocks;
}

// Helper function để extract theo số
function extractByNumbers(text, matches) {
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;

    const block = text.substring(startIndex, endIndex).trim();
    if (block.length > 30) {
      blocks.push(block);
    }
  }
  return blocks;
}

// Parse một khối câu hỏi box thành object
function parseBoxedQuestion(block, questionId) {
  console.log(`Parsing question block ${questionId}...`);
  
  const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const question = {
    id: questionId,
    question: '',
    options: [],
    correctAnswer: 0,
    explanation: "Chưa có giải thích"
  };
  
  let questionText = '';
  let collectingQuestion = true;
  let collectingExplanation = false;
  let explanationText = '';
  let foundCorrectAnswer = false;
  
  // Phân tích từng dòng
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip headers
    if (line.match(/^Question\s*#?\d+/i) || line.match(/^Topic\s*\d+/i)) {
      continue;
    }
    
    // Detect table headers (Division, Azure subscription, etc.)
    if (line.match(/^(Division|Azure|East|West|Sub\d+|Contoso|Fabrikam)/i)) {
      // Skip table content but include in question if before options
      if (question.options.length === 0) {
        questionText += (questionText ? ' ' : '') + line;
      }
      continue;
    }
    
    // Detect options (A., B., C., D.) but not community vote percentages
    if (line.match(/^[A-D][\.\s]/) && !line.match(/^[A-D]\s*\(\d+%\)/)) {
      collectingQuestion = false;
      
      // Finalize question text
      if (questionText && !question.question) {
        question.question = cleanQuestionText(questionText);
      }
      
      // Extract option text
      const optionText = line.replace(/^[A-D][\.\s]+/, '').trim();
      if (optionText.length > 0) {
        question.options.push(optionText);
        console.log(`Found option: ${optionText.substring(0, 50)}...`);
      }
      continue;
    }
    
    // Skip community vote lines
    if (line.match(/^Community/i) || line.match(/^[A-D]\s*\(\d+%\)/)) {
      continue;
    }
    
    // Detect correct answer box
    if (line.match(/^Correct\s*Answer\s*:\s*[A-D]/i)) {
      // Extract the answer letter after the colon
      const answerMatch = line.match(/:\s*([A-D])/i);
      if (answerMatch) {
        question.correctAnswer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
        foundCorrectAnswer = true;
        console.log(`Found correct answer: ${answerMatch[1]}`);
      }
      
      collectingExplanation = true;
      
      // Extract explanation from same line
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const afterColon = line.substring(colonIndex + 1).trim();
        const answerLetter = answerMatch[0];
        const afterAnswer = afterColon.substring(afterColon.indexOf(answerLetter) + 1).trim();
        if (afterAnswer.length > 0) {
          explanationText = afterAnswer;
        }
      }
      continue;
    }
    
    // Collect explanation text
    if (collectingExplanation) {
      if (line.match(/^Reference\s*:/i)) {
        const refText = line.replace(/^Reference\s*:\s*/i, '').trim();
        if (refText.length > 0) {
          explanationText += (explanationText ? '\n\nTham khảo: ' : 'Tham khảo: ') + refText;
        }
      } else if (line.match(/^https?:\/\//)) {
        explanationText += (explanationText ? '\nTham khảo: ' : 'Tham khảo: ') + line;
      } else if (!line.match(/^Community/i) && !line.match(/^\d+\(\d+%\)/) && line.length > 0) {
        explanationText += (explanationText ? ' ' : '') + line;
      }
      continue;
    }
    
    // Collect question text (everything before options)
    if (collectingQuestion && line.length > 0) {
      // Skip pure table separators
      if (!line.match(/^[\|\-\+\s]+$/)) {
        questionText += (questionText ? ' ' : '') + line;
      }
    }
  }
  
  // Finalize question
  if (questionText && !question.question) {
    question.question = cleanQuestionText(questionText);
  }
  
  if (explanationText) {
    question.explanation = explanationText.trim();
  }
  
  // Validation with detailed logging
  const isValid = question.question && question.options.length >= 2;
  console.log(`Question ${questionId} validation:`, {
    hasQuestion: !!question.question,
    questionLength: question.question ? question.question.length : 0,
    optionsCount: question.options.length,
    hasCorrectAnswer: foundCorrectAnswer,
    isValid
  });
  
  if (!isValid) {
    console.log('Question text preview:', questionText.substring(0, 100));
    console.log('Options found:', question.options);
    return null;
  }
  
  return question;
}

// Làm sạch text câu hỏi
function cleanQuestionText(text) {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/^[^\w→•➤▶⇨-]*/, '') // Remove leading non-word characters but keep arrows and bullets
    .trim();
}

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
// Parser cho format bang/o phuc tap
function parseTableFormat(text) {
  console.log('Trying table format parser...');

  // Tách text thành các phần dựa trên whitespace patterns
  const sections = text.split(/\n\s*\n/).filter(section => section.trim().length > 0);
  console.log(`Found ${sections.length} text sections`);

  const parsedQuestions = [];
  let questionId = 1;

  for (const section of sections) {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Tìm các pattern có thể là câu hỏi
    let questionStart = -1;
    let hasOptions = false;
    let hasCorrectAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Tìm dòng có "Question" hoặc câu hỏi dài
      if (line.match(/Question\s*#?\d+/i) ||
        (line.length > 50 && line.includes('?'))) {
        questionStart = i;
      }

      // Kiểm tra có options không
      if (line.match(/^[A-D][\.\s]/)) {
        hasOptions = true;
      }

      // Kiểm tra có correct answer không
      if (line.match(/Correct\s*Answer/i)) {
        hasCorrectAnswer = true;
      }
    }

    // Nếu section này có đủ thành phần của một câu hỏi
    if (questionStart >= 0 && hasOptions && hasCorrectAnswer) {
      const question = parseTableSection(lines, questionId);
      if (question && question.options.length >= 2) {
        parsedQuestions.push(question);
        questionId++;
      }
    }
  }

  console.log(`Table parser found ${parsedQuestions.length} questions`);
  return parsedQuestions;
}

// Parse một section thành câu hỏi
function parseTableSection(lines, questionId) {
  const question = {
    id: questionId,
    question: '',
    options: [],
    correctAnswer: 0,
    explanation: "Chưa có giải thích"
  };

  let questionText = '';
  let explanationText = '';
  let collectingExplanation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip headers
    if (line.match(/^Question\s*#?\d+/i) || line.match(/^Topic\s*\d+/i)) {
      continue;
    }

    // Detect options
    if (line.match(/^[A-D][\.\s]/)) {
      const optionText = line.replace(/^[A-D][\.\s]+/, '').trim();
      if (optionText.length > 0) {
        question.options.push(optionText);
      }
      continue;
    }

    // Detect correct answer
    if (line.match(/^Correct\s*Answer\s*:\s*[A-D]/i)) {
      const answerMatch = line.match(/[A-D]/i);
      if (answerMatch) {
        question.correctAnswer = answerMatch[0].toUpperCase().charCodeAt(0) - 65;
      }
      collectingExplanation = true;

      // Get explanation from same line
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const afterColon = line.substring(colonIndex + 1).trim();
        const answerLetter = answerMatch[0];
        const afterAnswer = afterColon.substring(afterColon.indexOf(answerLetter) + 1).trim();
        if (afterAnswer.length > 0) {
          explanationText = afterAnswer;
        }
      }
      continue;
    }

    // Collect explanation
    if (collectingExplanation) {
      if (line.match(/^Reference\s*:/i)) {
        const refText = line.replace(/^Reference\s*:\s*/i, '').trim();
        if (refText.length > 0) {
          explanationText += (explanationText ? '\n\nTham khảo: ' : 'Tham khảo: ') + refText;
        }
      } else if (line.match(/^https?:\/\//)) {
        explanationText += (explanationText ? '\nTham khảo: ' : 'Tham khảo: ') + line;
      } else if (!line.match(/^Community/i) && line.length > 0) {
        explanationText += (explanationText ? ' ' : '') + line;
      }
      continue;
    }

    // Collect question text (before options)
    if (question.options.length === 0 && line.length > 0) {
      questionText += (questionText ? ' ' : '') + line;
    }
  }

  // Finalize
  if (questionText) {
    question.question = cleanQuestionText(questionText);
  }

  if (explanationText) {
    question.explanation = explanationText.trim();
  }

  return question.question && question.options.length >= 2 ? question : null;
}