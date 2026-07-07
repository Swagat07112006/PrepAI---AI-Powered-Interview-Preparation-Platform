const mockInterviewPrompt = ({
    company,
    role,
    difficulty,
    questionCount,
}) => {
    return `
You are an experienced Software Engineering interviewer.

Generate a realistic mock interview.

Company:
${company}

Role:
${role}

Difficulty:
${difficulty}

Number of Questions:
${questionCount}

INSTRUCTIONS

- Questions must resemble real interview questions asked at ${company}.
- Mix DSA, Core CS, JavaScript, React, Node.js, System Design, Behavioral depending on role.
- Increase difficulty gradually.
- Return ONLY valid JSON.
- Do NOT wrap inside markdown.
- Do NOT use \`\`\`.

Return EXACTLY this format:

{
    "title": "",
    "description": "",
    "questions": [
        {
            "id": 1,
            "type": "",
            "difficulty": "",
            "question": "",
            "expectedDuration": ""
        }
    ]
}
`;
};

export { mockInterviewPrompt };