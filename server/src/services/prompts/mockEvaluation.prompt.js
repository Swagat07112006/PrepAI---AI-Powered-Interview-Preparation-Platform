const mockEvaluationPrompt = ({
    question,
    answer,
}) => {
    return `
You are a Senior Software Engineering interviewer.

Evaluate the following interview answer.

Question:
${question}

Candidate Answer:
${answer}

INSTRUCTIONS

- Be strict but fair.
- Score out of 10.
- Mention strengths.
- Mention weaknesses.
- Explain what was missing.
- Give an ideal answer.
- Give improvement tips.
- Return ONLY valid JSON.
- Do NOT wrap inside markdown.

Return EXACTLY this structure:

{
    "score": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "missingPoints": [],
    "idealAnswer": "",
    "tips": []
}
`;
};

export { mockEvaluationPrompt };