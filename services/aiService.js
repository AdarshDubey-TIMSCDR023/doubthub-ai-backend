const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ================= GENERATE AI RESPONSE =================
const generateAIResponse = async (prompt) => {

  try {

    console.log("AI Prompt:", prompt);

    const completion =
      await groq.chat.completions.create({

        messages: [
          {
            role: "system",
            content:
              "You are an expert coding assistant helping students solve programming doubts.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        // Updated Working Model
        model: "llama-3.3-70b-versatile",
      });

    return completion.choices[0].message.content;

  } catch (error) {

    console.log(
      "GROQ ERROR:",
      error.message
    );

    return "AI response failed.";
  }
};


module.exports = {
  generateAIResponse,
};