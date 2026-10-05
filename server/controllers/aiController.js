const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables.");
}

// Initialize the API client
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

exports.getSuggestion = async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured on the server."
      });
    }

    const { url, method, headers, body, responseStatus, responseData } = req.body;

    const prompt = `You are an expert API and web developer debugging a failed HTTP request in an API testing tool (like Postman).

Request Details:
- Target URL: ${url || 'Unknown URL'}
- HTTP Method: ${method || 'GET'}
- Request Headers: ${JSON.stringify(headers || {}, null, 2)}
- Request Body: ${JSON.stringify(body || {}, null, 2)}

Response Details:
- HTTP Status Code: ${responseStatus || 'N/A'}
- Response Data / Error: ${typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData}

Analyze this failure and provide:
1. **Root Cause**: Why did this request fail (status code meaning, payload format, missing headers, or endpoint issue)?
2. **Actionable Fix**: Specific steps to fix the request (e.g. correct headers, JSON format, auth token, valid parameters).
3. **Example**: A short snippet showing how the corrected request should look.

Keep your response structured, concise, and friendly.`;

    const candidateModels = [
      process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite-preview"
    ];

    let text = "";
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        if (text) {
          console.log(`[AI Controller] Successfully generated suggestion using ${modelName}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AI Controller] Model ${modelName} failed (${err.message}), trying next fallback...`);
      }
    }

    if (!text) {
      throw lastError || new Error("Failed to generate response from any Gemini model");
    }

    res.json({ suggestion: text });
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    res.status(500).json({ 
      error: "Failed to get AI suggestion", 
      details: error.message 
    });
  }
};