import "dotenv/config";
import express from "express";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { text } from "stream/consumers";
import { type } from "os";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { type: "text", text: prompt },
        {
          inlineData: {
            data: base64Image,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-document", upload.single("document"), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString("base64");
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          type: "text",
          text: prompt ?? "Tolong buat ringkasan untnuk dokumen berikut:",
        },
        {
          inlineData: {
            data: base64Document,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString("base64");
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          type: "text",
          text: prompt ?? "Tolong buat ringkasan untnuk dokumen berikut:",
        },
        {
          inlineData: {
            data: base64Audio,
            mimeType: req.file.mimetype,
          },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
