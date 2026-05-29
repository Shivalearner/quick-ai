import OpenAI from "openai";
import sql from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";
import { clerkClient } from "@clerk/express";
import axios from "axios";
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
//generateArticle
export const generateArticle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;
    // if the user havn't premium plan and used 10 free credit limit then will send the message as a respone
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });
    const content = response.choices[0].message.content;
    // SQL Query to add this content into database
    await sql` INSERT INTO Creations(user_id,prompt,content,type)
    VALUES (${userId},${prompt},${content},'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// GenerateBlogTitle
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;
    // if the user havn't premium plan and used 10 free credit limit then will send the message as a respone
    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue.",
      });
    }
    // Response get from gemini-3.5-flash API
    const response = await AI.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const content = response.choices[0].message.content;
    // SQL Query to add this content into database
    await sql` INSERT INTO Creations(user_id,prompt,content,type)
    VALUES (${userId},${prompt},${content},'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUser(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// generateImage
export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage ?? 0;
    // if the user havn't premium plan and used 10 free credit limit then will send the message as a respone
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    // Response get from clipdrop ai API
    const formData = new FormData();
    form.append("prompt", prompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    // Saving image into cloudinary storage
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    // SQL Query to add this content into database
    await sql` INSERT INTO Creations(user_id,prompt,content,type,publish)
    VALUES (${userId},${prompt},${secure_url},'image',${publish ?? false})`;

    res.json({ success: true, secure_url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
