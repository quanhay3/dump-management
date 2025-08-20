// Tool để test parser với sample text
const fs = require('fs');

// Import parser functions từ index.js
// (Cần copy các hàm parser vào đây để test độc lập)

// Sample text từ PDF của bạn
const samplePdfText = `
Question #1                                                    Topic 1

You have an Azure subscription that contains a custom application named Application1. Application1 was developed by an external company named Fabrikam, Ltd. Developers at Fabrikam were assigned role-based access control (RBAC) permissions to the Application1 components. All users are licensed for the Microsoft 365 E5 plan.

You need to recommend a solution to verify whether the Fabrikam developers still require permissions to Application1. The solution must meet the following requirements: ⇨ To the manager of the developers, send a monthly email message that lists the access permissions to Application1. ⇨ If the manager does not verify an access permission, automatically revoke that permission. ⇨ Minimize development effort.

What should you recommend?

A. In Azure Active Directory (Azure AD), create an access review of Application1.
B. Create an Azure Automation runbook that runs the Get-AzRoleAssignment cmdlet.
C. In Azure Active Directory (Azure AD) Privileged Identity Management, create a custom role assignment for the Application1 resources.
D. Create an Azure Automation runbook that runs the Get-AzureADUserAppRoleAssignment cmdlet.

Correct Answer: A

Reference:
https://docs.microsoft.com/en-us/azure/active-directory/governance/manage-user-access-with-access-reviews

Community vote distribution
A (100%)
`;

// Test parser functions
function testParser() {
  console.log('Testing PDF parser with sample text...');
  console.log('Sample text length:', samplePdfText.length);
  
  // Test extractBoxedQuestions
  const blocks = extractBoxedQuestions(samplePdfText);
  console.log(`Found ${blocks.length} blocks`);
  
  blocks.forEach((block, index) => {
    console.log(`\nBlock ${index + 1}:`);
    console.log('Length:', block.length);
    console.log('Preview:', block.substring(0, 200) + '...');
    
    // Test parseBoxedQuestion
    const question = parseBoxedQuestion(block, index + 1);
    if (question) {
      console.log('Parsed question:', {
        id: question.id,
        question: question.question.substring(0, 100) + '...',
        optionsCount: question.options.length,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation.substring(0, 100) + '...'
      });
    } else {
      console.log('Failed to parse question');
    }
  });
}

// Copy parser functions here for testing
function extractBoxedQuestions(text) {
  const blocks = [];
  const questionPattern = /Question\s*#?\d+/gi;
  const matches = [...text.matchAll(questionPattern)];
  
  console.log(`Found ${matches.length} question headers`);
  
  if (matches.length === 0) {
    return [text];
  }
  
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

function parseBoxedQuestion(block, questionId) {
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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip headers
    if (line.match(/^Question\s*#?\d+/i) || line.match(/^Topic\s*\d+/i)) {
      continue;
    }
    
    // Detect options (but not community vote percentages)
    if (line.match(/^[A-D][\.\s]/) && !line.match(/^[A-D]\s*\(\d+%\)/)) {
      collectingQuestion = false;
      
      if (questionText && !question.question) {
        question.question = questionText.trim();
      }
      
      const optionText = line.replace(/^[A-D][\.\s]+/, '').trim();
      if (optionText.length > 0) {
        question.options.push(optionText);
      }
      continue;
    }
    
    // Detect correct answer
    if (line.match(/^Correct\s*Answer\s*:\s*[A-D]/i)) {
      // Extract the answer letter after the colon
      const answerMatch = line.match(/:\s*([A-D])/i);
      if (answerMatch) {
        console.log(`Found correct answer line: "${line}"`);
        console.log(`Answer match: ${answerMatch[1]}`);
        question.correctAnswer = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
        console.log(`Correct answer index: ${question.correctAnswer}`);
      }
      collectingExplanation = true;
      continue;
    }
    
    // Skip community vote lines
    if (line.match(/^Community/i) || line.match(/^[A-D]\s*\(\d+%\)/)) {
      continue;
    }
    
    // Collect explanation
    if (collectingExplanation && line.length > 0) {
      explanationText += (explanationText ? ' ' : '') + line;
      continue;
    }
    
    // Collect question text
    if (collectingQuestion && line.length > 0) {
      if (!line.match(/^[\|\-\+\s]+$/)) {
        questionText += (questionText ? ' ' : '') + line;
      }
    }
  }
  
  if (explanationText) {
    question.explanation = explanationText.trim();
  }
  
  return question.question && question.options.length >= 2 ? question : null;
}

// Run test
if (require.main === module) {
  testParser();
}

module.exports = { testParser, samplePdfText };