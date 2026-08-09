const express = require("express");
const { GoogleGenAI, Type } = require("@google/genai");
const upload = require("../middleware/uploadMiddleware");
const Item = require("../models/Item");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = "Analyze this image of a lost or found item for a campus portal. Extract accurate visual details that can help identify the item.";

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Short descriptive title of the item" },
        category: { type: Type.STRING, description: "Item category such as Electronics, Cards, Clothing, Wallet, Keys, Bags, Books, or Other" },
        color: { type: Type.STRING, description: "Primary visual color of the item" },
        description: { type: Type.STRING, description: "Important visible details such as logos, patterns, scratches, markings, or distinctive features" },
      },
      required: ["title", "category", "color", "description"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const parsedData = JSON.parse(response.text);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI Analysis Failed",
      error: error.message,
    });
  }
});

router.get("/matches/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.status === "Returned") {
      return res.status(200).json({
        success: true,
        matches: [],
        message: "Returned items do not need matching",
      });
    }

    const oppositeStatus = item.status === "Lost" ? "Found" : "Lost";

    const candidates = await Item.find({
      status: oppositeStatus,
      _id: { $ne: item._id },
    })
      .select("title description category location date status image phone postedBy")
      .populate("postedBy", "name email")
      .limit(20);

    if (candidates.length === 0) {
      return res.status(200).json({
        success: true,
        matches: [],
        message: `No ${oppositeStatus} items available for matching`,
      });
    }

    const candidateData = candidates.map((candidate) => ({
      id: candidate._id.toString(),
      title: candidate.title,
      description: candidate.description,
      category: candidate.category,
      location: candidate.location,
      date: candidate.date,
    }));

    const prompt = `
You are an AI matching system for a college Lost and Found Portal.

Compare the user's item with the candidate items and identify the most likely matches.

USER ITEM:
Title: ${item.title}
Description: ${item.description}
Category: ${item.category}
Location: ${item.location}
Date: ${item.date.toISOString().split("T")[0]}
Status: ${item.status}

CANDIDATE ITEMS:
${JSON.stringify(candidateData, null, 2)}

Consider:
- Category similarity
- Description similarity
- Color and visible characteristics mentioned in descriptions
- Location similarity
- Date proximity
- Unique identifying features

Give a score from 0 to 100.

Only return genuinely relevant possible matches. Do not assume two items match just because they have the same category.
`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        matches: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ["id", "score", "reason"],
          },
        },
      },
      required: ["matches"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = JSON.parse(response.text);

    const matches = result.matches
      .filter((match) => match.score >= 50)
      .sort((a, b) => b.score - a.score)
      .map((match) => {
        const candidate = candidates.find(
          (candidate) => candidate._id.toString() === match.id
        );

        return {
          ...match,
          item: candidate,
        };
      })
      .filter((match) => match.item);

    res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Smart Matching Error:", error);
    res.status(500).json({
      success: false,
      message: "Smart matching failed",
      error: error.message,
    });
  }
});

module.exports = router;