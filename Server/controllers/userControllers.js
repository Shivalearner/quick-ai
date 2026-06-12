import sql from "../config/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations = await sql`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`;
    res.json({ success: "true", creations });
  } catch (error) {
    res.json({ success: "false", message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({ success: "true", creations });
  } catch (error) {
    res.json({ success: "false", message: error.message });
  }
};

// 🌟 FIXED: Toggle like creation
export const toggleLikeCreation = async (req, res) => {
  try {
    // 1. Unified naming to userId matching your other routes
    const { userId } = req.auth(); 
    const { id } = req.body;

    // 2. Added WHERE clause so you only grab the specific creation
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: "false", message: "Creation not found" });
    }

    // 3. Fallback to an empty array if likes is null/undefined in DB
    const currentLikes = creation.likes || []; 
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      // 4. Fixed filter return shorthand (removed curly braces)
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked"; // 5. Fixed syntax from ':' to '='
    }

    const formattedArray=`{${updatedLikes.join(',')}`
    
    // 6. Simplified PostgreSQL array update using native driver array support
    await sql`UPDATE creations SET likes = ${updatedLikes} WHERE id = ${id}`;
    
    res.json({ success: "true", message });
  } catch (error) {
    res.json({ success: "false", message: error.message });
  }
};