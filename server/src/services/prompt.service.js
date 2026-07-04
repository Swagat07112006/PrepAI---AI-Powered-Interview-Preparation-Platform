const roadmapPrompt = ({
    targetCompany,
    currentLevel,
    role,
    timeAvailable,
    hoursPerDay,
    skills,
}) => {
    return `
        You are an expert Software Engineer mentor.
        Create a detailed interview preparation roadmap.
        Target Company: ${targetCompany}
        Role: ${role}
        Current Level: ${currentLevel}
        Time Available: ${timeAvailable}
        hoursPerDay: ${hoursPerDay}
        Current Skills: ${skills}

        Return only valid JSON.

        Format:

        {
            "overview": "",
            "weeklyplan": [{
                "week": 1,
                "goal": "",
                "topics": [],
                "questions": [],
                "revision": "",
            }],
            "tips": []
        }
    `
}

export {roadmapPrompt}