const resumeReviewPrompt = ( resumeText ) => {
    return `
You are an expert ATS Resume Reviewer, Senior Software Engineering Hiring Manager, and Career Coach.

Analyze the following resume.

Resume:

${resumeText}

INSTRUCTIONS:

- Assume the resume is for Software Engineering roles.
- Evaluate ATS friendliness.
- Evaluate formatting.
- Evaluate technical skills.
- Evaluate projects.
- Evaluate achievements.
- Evaluate work experience.
- Evaluate education.
- Suggest improvements.
- Mention missing keywords.
- Mention strengths.
- Mention weaknesses.
- Give an ATS score out of 100.
- Return ONLY valid JSON.
- Do NOT wrap inside markdown.
- Do NOT use \`\`\`.

Return EXACTLY this structure:

{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "projectFeedback": "",
  "experienceFeedback": "",
  "educationFeedback": "",
  "technicalSkillsFeedback": "",
  "improvements": [],
  "finalVerdict": ""
}
`;
};

export { resumeReviewPrompt };