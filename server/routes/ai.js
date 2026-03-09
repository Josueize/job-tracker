const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate Cover Letter
router.post('/cover-letter', auth, async (req, res) => {
  const { company, role, notes } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach who writes compelling, professional cover letters. Write in a confident, personable tone. Keep it to 3-4 paragraphs."
        },
        {
          role: "user",
          content: `Write a cover letter for a ${role} position at ${company}. ${notes ? `Additional context: ${notes}` : ''}`
        }
      ],
      max_tokens: 600,
    });
    res.json({ letter: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate Interview Questions
router.post('/interview-prep', auth, async (req, res) => {
  const { company, role } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach. Generate exactly 8 interview questions as a JSON array. Return ONLY valid JSON like: {\"questions\": [{\"question\": \"...\", \"tip\": \"...\", \"category\": \"Technical|Behavioral|Situational\"}]}"
        },
        {
          role: "user",
          content: `Generate 8 interview questions for a ${role} position at ${company}.`
        }
      ],
      max_tokens: 800,
    });
    const text = completion.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;