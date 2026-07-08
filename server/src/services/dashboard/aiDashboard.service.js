import { User } from '../../models/user.model.js'
import { RoadmapHistory } from "../../models/history/roadmapHistory.model.js";
import { ResumeReviewHistory } from "../../models/history/resumeReviewHistory.model.js";
import { QuestionExplanationHistory } from '../../models/history/questionExplainationHistory.model.js'
import { MockInterviewHistory } from "../../models/history/mockInterviewHistory.model.js";
import { MockEvaluationHistory } from "../../models/history/mockEvaluationHistory.model.js";

const getDashboardData = async (userId) => {
    const [
        user,
        roadmapCount,
        resumeCount,
        questionCount,
        mockInterviewCount,
        mockEvaluationCount,
    ] = await Promise.all([
        User.findById(userId).select("fullName userName email createdAt").lean(),
        RoadmapHistory.countDocuments({ user: userId }),
        ResumeReviewHistory.countDocuments({ user: userId }),
        QuestionExplanationHistory.countDocuments({ user: userId }),
        MockInterviewHistory.countDocuments({ user: userId }),
        MockEvaluationHistory.countDocuments({ user: userId }),
    ])

    const [
        recentRoadmaps,
        recentResumeReviews,
        recentQuestionExplanations,
        recentMockInterviews,
        recentMockEvaluations,
    ] = await Promise.all([
        RoadmapHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        ResumeReviewHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        QuestionExplanationHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        MockInterviewHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        MockEvaluationHistory.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),
    ]);

    const roadmapActivity = recentRoadmaps.map((roadmap) => ({
        type: "Roadmap",
        title: `${roadmap.targetCompany} ${roadmap.role}`,
        time: roadmap.createdAt,
    }));

    const resumeActivity = recentResumeReviews.map((resume) => ({
        type: "Resume Review",
        title: resume.fileName,
        time: resume.createdAt,
    }));

    const explanationActivity = recentQuestionExplanations.map((question) => ({
        type: "Question Explanation",
        title: question.question,
        time: question.createdAt,
    }));

    const interviewActivity = recentMockInterviews.map((interview) => ({
        type: "Mock Interview",
        title: `${interview.company} ${interview.role}`,
        time: interview.createdAt,
    }));

    const evaluationActivity = recentMockEvaluations.map((evaluation) => ({
        type: "Mock Evaluation",
        title: evaluation.question,
        time: evaluation.createdAt,
    }));

    const recentActivities = [
        ...roadmapActivity,
        ...resumeActivity,
        ...explanationActivity,
        ...interviewActivity,
        ...evaluationActivity,
    ];

    recentActivities.sort((a, b) => b.time - a.time);

    return {
        profile: user,

        overview: {

            totalRoadmaps: roadmapCount,

            totalResumeReviews: resumeCount,

            totalQuestionExplanations: questionCount,

            totalMockInterviews: mockInterviewCount,

            totalMockEvaluations: mockEvaluationCount,

            totalAIGenerations: roadmapCount + resumeCount + questionCount + mockInterviewCount + mockEvaluationCount,
        },

        recentActivities: recentActivities.slice(0, 10)
    }
}

export { getDashboardData }