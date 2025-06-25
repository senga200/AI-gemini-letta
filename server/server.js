import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  try {
    const requestBody = req.body; // récupère le Json du front
    console.log('Requête reçue:', requestBody);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody), // transmet le Json à gemini
      }
    );

    const data = await geminiRes.json();
    res.json(data); // renvoie la resp gemini au front
  } catch (error) {
    console.error('Erreur Gemini:', error);
    res.status(500).json({ error: 'Erreur serveur avec Gemini' });
  }
});

app.listen(3001, () => console.log('Serveur backend en écoute sur http://localhost:3001'));
