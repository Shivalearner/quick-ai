import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please sign in." });
    }

    const hasPremiumPlan = await has({ plan: "premium" });

    // In newer @clerk/express versions, clerkClient is a function — call it first
    const client = typeof clerkClient === "function" ? clerkClient() : clerkClient;

    const user = await client.users.getUser(userId);
    const userFree = user?.privateMetadata?.free_usage ?? 0;

    if (!hasPremiumPlan && userFree > 0) {
      req.free_usage = userFree;
    } else {
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};