const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { messages } = JSON.parse(event.body);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Utiliser la clé API depuis les variables d'environnement
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.text(); // Récupère le texte de l'erreur
            console.error('Erreur API:', errorData);
            throw new Error('Erreur de l\'API'); // Lance une nouvelle erreur
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Une erreur est survenue lors de l\'appel à l\'API OpenAI.' })
        };
    }
};
