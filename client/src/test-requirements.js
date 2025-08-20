// Test preprocessing requirements
const testText = "You need to recommend a solution. The solution must meet the following requirements: ⇨ To the manager of the developers, send a monthly email message. ⇨ If the manager does not verify an access permission, automatically revoke that permission. ⇨ Minimize development effort.";

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

const preprocessRequirements = (text) => {
  return text
    .replace(/(⇨|→)\s*([A-Z])/g, '\n$1 $2')
    .replace(/\.\s+(To the manager|If the manager|Minimize)/gi, '.\n→ $1')
    .replace(/\s+(To the manager|If the manager|Minimize)/gi, '\n→ $1')
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

console.log('Original text:');
console.log(testText);
console.log('\nCleaned text:');
console.log(cleanArrowsFromText(testText));
console.log('\nProcessed text:');
console.log(preprocessRequirements(testText));
console.log('\nSplit lines:');
preprocessRequirements(testText).split('\n').forEach((line, i) => {
  console.log(`${i}: "${line.trim()}"`);
});