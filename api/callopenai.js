const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { messages } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Utilisation de la clé API OpenAI stockée dans les variables d'environnement
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    const data = await response.json();
    res.status(200).json(data); // Renvoyer la réponse d'OpenAI à ton frontend
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
