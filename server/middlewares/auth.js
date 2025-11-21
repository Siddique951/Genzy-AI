import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const authData = await req.auth();
        const userId = authData.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Authentication required"
            });
        }

        const hasPremiumPlan = await authData.has({ plan: 'premium' });
        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata?.free_usage !== undefined) {
            req.free_usage = user.privateMetadata.free_usage;
        } else if (!hasPremiumPlan) {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 }
            });
            req.free_usage = 0;
        } else {
            req.free_usage = 0;
        }

        req.userId = userId;
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();

    } catch (error) {
        console.log("Auth error:", error.message);
        res.json({ success: false, message: "Authentication required" });
    }
}