import { Note } from "../models/note.model.js";
import { Question } from "../models/question.model.js";
import { Revision } from "../models/revision.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDashBoardData = asyncHandler(async (req, res) => {
    const totalQuestions = await Question.countDocuments({
        userId: req.user._id,
    });
    const solvedQuestions = await Question.countDocuments({
        userId: req.user._id,
        status: "Solved",
    })
    const pendingQuestions = totalQuestions - solvedQuestions;
    const totalNotes = await Note.countDocuments({
        userId: req.user._id,
    })

    const today = new Date();
    const dueRevisions = await Revision.countDocuments({
        userId: req.user._id,
        status: "Pending",
        dueDate: {
            $lte: today
        }
    })

    const topicAnalytics = await Question.aggregate([
        {
            $match: {
                userId: req.user._id,
            }
        },
        {
            $unwind: "$topics"
        },
        {
            $group: {
                _id: "$topics",
                total: {
                    $sum: 1
                },
                solved: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "Solved"] },
                            1,
                            0
                        ]
                    }
                },
            },
        },
        {
            $project: {
                _id: 0,
                topic: "$_id",
                total: 1,
                solved: 1,
                completion: {
                    $multiply: [
                        {
                            $divide: ["$solved", "$total"]
                        },
                        100
                    ]
                }
            }
        },
        {
            $sort: {
                completion: 1,
            }
        },
    ]);

    const solvedQuestion = await Question.find(
        {
            userId: req.user._id,
            status: "Solved"
        },
        {
            solvedAt: 1,
        }
    ).sort({
        solvedAt: -1
    });

    const uniqueWorkingDays = new Set()
    for (const question of solvedQuestion) {
        const day = question.solvedAt.toISOString().split("T")[0];
        uniqueWorkingDays.add(day)
    }
    const workingDays = [...uniqueWorkingDays]
    let streak = 0;
    let currentDay = new Date()
    let currentDate = currentDay.toISOString().split("T")[0];

    while (workingDays.includes(currentDate)) {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1)
        currentDate = currentDay.toISOString().split("T")[0];
    }

    const solvedQuestionsChart = await Question.aggregate([
        {
            $match: {
                userId: req.user._id,
                status: "Solved",
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$solvedAt"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                count: 1
            }
        },
        {
            $sort: {
                date: 1
            }
        }
    ])

    const recentQuestions = await Question.find(
        {
            userId: req.user._id,
            status: "Solved",
        },
        {
            title: 1,
            solvedAt: 1,
        }
    ).sort({
        solvedAt: -1
    }).limit(5);

    const questionActivity = recentQuestions.map((question) => ({
        type: "Question",
        title: question.title,
        time: solvedAt
    }))

    const recentNotes = await Note.find(
        {
            userId: req.user._id,
        },
        {
            title: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 })
    .limit(5)

    const noteActivity = recentNotes.map((note) => ({
        type: "note",
        title: note.title,
        time: note.createdAt,
    }))

    const recentRevisions = await Revision.find(
        {
            userId: req.user._id,
            status: "Completed",
        },
        {
            questionId: 1,
            completedAt: 1,
        }
    )
    .populate("questionId", "title")
    .sort({ completedAt: -1 })
    .limit(5)

    const revisionActivity = recentRevisions.map((revision) => ({
        type: "revision",
        title: revision.questionId.title,
        time: revision.completedAt,
    }))

    const recentActivities = [
        ...questionActivity,
        ...noteActivity,
        ...revisionActivity
    ]

    recentActivities.sort((a,b) => b.time - a.time)
    
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                overview: {
                    totalQuestions,
                    totalNotes,
                    pendingQuestions,
                    solvedQuestions,
                    dueRevisions,
                    streak,
                },
                topicAnalytics: topicAnalytics,
                solvedQuestionsChart: solvedQuestionsChart,
                recentActivities: recentActivities.slice(10)
            },
            "Dashboard data fetched successfully"
        )
    )
})

export { getDashBoardData }