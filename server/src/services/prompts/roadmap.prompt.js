const roadmapPrompt = ({
    targetCompany,
    currentLevel,
    role,
    timeAvailable,
    hoursPerDay,
    skills,
}) => {
    return `
You are an expert Software Engineering mentor.

Generate a detailed interview preparation roadmap.

Target Company: ${targetCompany}
Role: ${role}
Current Level: ${currentLevel}
Time Available: ${timeAvailable}
Study Hours Per Day: ${hoursPerDay}
Current Skills: ${skills.join(", ")}

IMPORTANT INSTRUCTIONS:

- Return ONLY valid JSON.
- Do NOT wrap the response inside markdown.
- Do NOT use \`\`\`json.
- Do NOT write explanations before or after the JSON.
- Follow the property names EXACTLY.
- The output must be directly parsable using JSON.parse().

Return this exact structure:

{
  "overview": "",
  "weeklyPlan": [
    {
      "week": 1,
      "goal": "",
      "topics": [],
      "questions": [],
      "revision": ""
    }
  ],
  "tips": []
}
`;
};

export { roadmapPrompt };