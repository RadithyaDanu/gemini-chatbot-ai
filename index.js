const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express(); // Initialize Express app
const port = process.env.PORT || 3000; // Set port from environment variable or default to 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Initialize Google Generative AI
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Get the generative model

// Routing
app.post('/api/chat', async (req, res) => {
  try {
    console.log(req.body);
    const { userMessage } = req.body; // Ambil field 'input' dari request body

    if (!userMessage) {
      return res.status(400).json({ reply: 'Message is required' });
    }

    const result = await model.generateContent(userMessage); // Generate content from model
    const response = result.response;
    const text = response.text(); // Convert response to text

    res.status(200).json({ reply: text }); // Kirim hasil ke client
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ reply: 'Error generating content' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
