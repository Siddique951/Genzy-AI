import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { PDFParse } from "pdf-parse";

// AI instance
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Article Generation
export const generateArticle = async (req, res) => {
    try {
        const userId = req.userId;
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: 'Limit reached. Upgrade to continue.'
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            }],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES(${userId}, ${prompt}, ${content}, 'article')
        `;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        console.log("Generate Article Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// Blog Title Generation
export const generateBlogTitle = async (req, res) => {
    try {
        const userId = req.userId;
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({
                success: false,
                message: 'Limit reached. Upgrade to continue.'
            });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            }],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES(${userId}, ${prompt}, ${content}, 'blog-title')
        `;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        }

        res.json({ success: true, content });

    } catch (error) {
        console.log("Generate Blog Title Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Image Generation (UPDATED - HUGGING FACE)
export const generateImage = async (req, res) => {
    try {
        const userId = req.userId;
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: 'This feature is only available for premium users'
            });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY
                },
                responseType: "arraybuffer",
            }
        );

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image, {
            folder: 'ai-generated-images'
        });

        await sql`
            INSERT INTO creations (user_id, prompt, content, type, publish)
            VALUES(${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
        `;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log("Generate Image Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageBackground = async (req, res) => {
    try {
        const userId = req.userId;
        const image = req.file;
        const plan = req.plan;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: 'This feature is only available for premium users'
            });
        }


        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        });

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES(${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log("Remove Background Image Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const removeImageObject = async (req, res) => {
    try {
        const userId = req.userId;
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: 'This feature is only available for premium users'
            });
        }


        const { public_id } = await cloudinary.uploader.upload(image.path)

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image',
        })

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES(${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl });

    } catch (error) {
        console.log("Remove Background Image Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

export const resumeReview = async (req, res) => {
    try {
        const userId = req.userId;
        const resume = req.file;
        const plan = req.plan;

        if (!userId) {
            return res.json({
                success: false,
                message: "User ID not found"
            });
        }

        if (plan !== 'premium') {
            return res.json({
                success: false,
                message: 'This feature is only available for premium users'
            });
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.json({
                success: false,
                message: "File size exceeds 5MB limit"
            });
        }

        const buffer = fs.readFileSync(resume.path);

        const parser = new PDFParse({ data: buffer });
        const pdfResult = await parser.getText();

        const pdfText = pdfResult.text;

        const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume text and return the output ONLY in the EXACT structured format below.

DO NOT add extra paragraphs. DO NOT repeat text. USE CLEAN MARKDOWN.

---

# 📝 Overall Summary
Write 2–3 lines summarizing the resume quality.

---

# ⭐ Strengths
- Bullet point
- Bullet point
- Bullet point
(Minimum 4)

---

# ⚠ Weaknesses / Issues
- Bullet point
- Bullet point
- Bullet point
(Minimum 4)

---

# 🛠 Actionable Improvements
Give specific, practical improvements:
- Fix 1
- Fix 2
- Fix 3
(Minimum 5)

---

# 📊 ATS Analysis
**ATS Score:** __ / 100

### Missing Keywords:
- keyword 1  
- keyword 2  
- keyword 3  
(Minimum 5)

---

# 📁 Resume Section Review
### ✔ Contact Information
Short analysis

### ✔ Summary / Profile
Short analysis

### ✔ Skills
Short analysis

### ✔ Projects
Short analysis

### ✔ Experience (If any)
Short analysis

### ✔ Education
Short analysis

---

# 📝 Final 2-Line Verdict
Give a short, motivating closing summary.

---

Resume Text:
${pdfText}
`;
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{
                role: "user",
                content: prompt,
            }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        await sql`
            INSERT INTO creations (user_id, prompt, content, type)
            VALUES(${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
        `;

        res.json({ success: true, content });

    } catch (error) {
        console.log("Resume Review Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};