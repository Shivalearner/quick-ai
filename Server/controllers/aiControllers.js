import OpenAI from "openai";
import sql from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import fs from "fs";
// 1. Import the utility to handle CommonJS modules
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// 2. Safe-load pdf-parse using require
const pdf = require("pdf-parse");

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
// Generate Article
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
      model: "gemini-3.1-flash-lite",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: Math.ceil(length * 3),
    });
    const content = response.choices[0].message.content;
    // SQL Query to add this content into database
    await sql` INSERT INTO creations(user_id,prompt,content,type)
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
    if (error.status === 429) {
      return res.json({
        success: false,
        message:
          "Gemini free tier limit reached. Please wait 2 minutes and try again.",
      });
    }
    res.json({ success: false, message: error.message });
  }
};

// AI Blog Title Generator
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
      model: "gemini-3.1-flash-lite",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1800,
    });
    const content = response.choices[0].message.content;
    // SQL Query to add this content into database
    await sql` INSERT INTO creations(user_id,prompt,content,type)
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
    if (error.status === 429) {
      return res.json({
        success: false,
        message:
          "Gemini free tier limit reached. Please wait 2 minutes and try again.",
      });
    }
    res.json({ success: false, message: error.message });
  }
};

// Generate Image
export const generateImage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    // Response get from clipdrop ai API
    const formData = new FormData();
    formData.append("prompt", prompt);
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
    await sql` INSERT INTO creations(user_id,prompt,content,type,publish)
    VALUES (${userId},${prompt},${secure_url},'image',${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Image Background
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { image } = req.file;
    const plan = req.plan;
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    //

    // Saving image into cloudinary storage
    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });
    // SQL Query to add this content into database
    await sql` INSERT INTO creations(user_id,prompt,content,type)
    VALUES (${userId},"Remove background from image",${secure_url},'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Image Object
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { image } = req.file;
    const { object } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    //

    // Saving image into cloudinary storage
    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    // SQL Query to add this content into database
    await sql` INSERT INTO creations(user_id,prompt,content,type)
    VALUES (${userId},${`remove ${object} from image`},${imageUrl},'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Review Resume
export const resumeReview = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { resume } = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB)",
      });
    }

    // If the file is more than 5mb, we convert this resume using dataBuffer fileSystem
    const dataBuffer = fs.readFileSync(resume.path);

    // To extract text from the pdf using pdf-parse package
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strength, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

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
      max_tokens: 1000,
    });
    const content = response.choices[0].message.content;

    // SQL Query to add this content into database
    await sql` INSERT INTO creations(user_id,prompt,content,type)
    VALUES (${userId},'Review the uploded resume',${content},'resume-review')`;

    res.json({ success: true, content });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
