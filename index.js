const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express(); 
const port = process.env.PORT || 3000; 

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Routing
app.post('/api/chat', async (req, res) => {
  try {
    console.log(req.body);
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ reply: 'Message is required' });
    }

    const result = await model.generateContent(userMessage); 
    const response = result.response;
    const text = response.text(); 

    res.status(200).json({ reply: text }); 
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ reply: 'Error generating content' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
