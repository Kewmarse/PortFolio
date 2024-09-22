// Initialiser un tableau pour stocker les messages
let conversationHistory = [];



// Ouvrir/Fermer la fenêtre de chat
document.getElementById("chatbotBubble").addEventListener("click", function() {
    const popup = document.getElementById("chatPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";

    // Afficher les phrases préfabriquées uniquement lorsque la fenêtre est ouverte
    if (popup.style.display === "block") {
        showPresetPhrases();
    }
});

// Écouter l'événement "keypress" sur le champ de texte
document.getElementById("userMessage").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Empêcher le comportement par défaut
        sendMessage(document.getElementById("userMessage").value); // Appeler la fonction d'envoi de message
    }
});

// Ajoutez les phrases préfabriquées
const presetPhrases = [
    "Bonjour, qui es-tu ?",
    "Quelles sont tes compétences ?",
    "Comment te contacter ?"
];

// Fonction pour afficher les phrases préfabriquées
function showPresetPhrases() {
    const presetContainer = document.createElement('div');
    presetContainer.classList.add('preset-phrases');
    
    // Vider le conteneur avant de le remplir
    presetContainer.innerHTML = '';

    presetPhrases.forEach(phrase => {
        const button = document.createElement('button');
        button.innerText = phrase;
        button.onclick = () => {
            sendMessage(phrase); // Envoie le message
            presetContainer.style.display = 'none'; // Masque les boutons après utilisation
        };
        presetContainer.appendChild(button);
    });

    const chatBody = document.getElementById("chatPopupBody");
    // Assurez-vous que le conteneur n'est pas déjà présent
    if (!document.querySelector('.preset-phrases')) {
        chatBody.appendChild(presetContainer);
    }
}

// Réinitialiser la conversation lors du chargement de la page
window.onload = function() {
    conversationHistory = []; // Réinitialiser l'historique
    const chatBody = document.getElementById("chatPopupBody");
    chatBody.innerHTML = ""; // Effacer le contenu du chat
};

// Fonction d'envoi de message
async function sendMessage(userMessage = null) {
    // Utiliser le message utilisateur passé ou obtenir le champ de saisie
    const messageToSend = userMessage || document.getElementById("userMessage").value;
    if (messageToSend.trim() === "") return;


    // Ajouter le message utilisateur dans le chat
    const chatBody = document.getElementById("chatPopupBody");
    chatBody.innerHTML += `<p class="bulle-utilisateur"><strong>Vous:</strong> ${messageToSend}</p>`;
    
    // Vérifier les doublons avant d'ajouter à l'historique
    if (!conversationHistory.some(msg => msg.content === messageToSend)) {
        conversationHistory.push({ role: "user", content: messageToSend });
    }

    document.getElementById("userMessage").value = ""; // Effacer le champ

    // Masquer les phrases préfabriquées après l'envoi du premier message
    const presetContainer = document.querySelector('.preset-phrases');
    if (presetContainer) {
        presetContainer.style.display = 'none';
    }




     // Créer le prompt final en ajoutant l'historique des messages
     const messages = [{ role: "system", content: context }];
     conversationHistory.forEach(msg => messages.push(msg));
     messages.push({ role: "user", content: userMessage });
 
     // Appel à l'API OpenAI pour obtenir une réponse
     try {
        const response = await fetch('/.netlify/functions/callOpenAI', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages })
        });
        const data = await response.json();
        const messageBot = data.choices[0].message.content;

        chatBody.scrollTop = chatBody.scrollHeight;

        chatBody.innerHTML += `<p class="bulle-joris"></p>`;
        typeWriterEffect(chatBody.lastChild, messageBot);
        conversationHistory.push({ role: "assistant", content: messageBot });
    } catch (error) {
        chatBody.innerHTML += "<p><strong>Erreur:</strong> Le chatbot a connu une erreur.</p>";
    }
 }

 
 // Fonction d'animation de type "mot par mot"
 function typeWriterEffect(element, text) {
    let index = 0;
    const words = text.split(' ');
    const typingEffect = setInterval(() => { 
        if (index < words.length) {
            element.innerHTML += words[index] + ' ';
            index++;
            element.scrollTop = element.scrollHeight; // Scroll jusqu'en bas
        } else {
            clearInterval(typingEffect); // Arrêter l'animation
        }
    }, 50); // Vitesse d'animation, en millisecondes
}