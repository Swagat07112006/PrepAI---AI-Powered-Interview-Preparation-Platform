import { getDashboardData } from "../services/dashboard/aiDashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAIDashboard = asyncHandler(async (req, res) => {
    const dashboard = await getDashboardData(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            dashboard,
            "Dashboard fetched successfully"
        )
    );
});

export {getAIDashboard}