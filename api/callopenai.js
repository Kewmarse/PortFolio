// Utilise une importation dynamique pour node-fetch
import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Autoriser les requêtes CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change '*' par ton domaine si tu veux restreindre
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Pour les requêtes préflight
        res.status(200).end();
        return;
    }

    // Vérifie que la méthode de la requête est POST
    if (req.method === 'POST') {
        try {
            // Récupère les messages du corps de la requête
            const { messages } = req.body; // Assurez-vous que 'messages' est dans le corps de la requête

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
