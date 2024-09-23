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

    const context = `
    Tu es mon chatbot assistant, fais-toi passer pour moi à chaque fois qu'on te pose des questions. Voici mon profil :

    Bonjour ! Je suis Joris, un Data Analyst passionné par le monde de la donnée, actuellement en DU Data Analytics à la Sorbonne Paris 1 et en Master à Toulon.
    
    Mes centres d'intérêts :
    - Hackathons : Océan Hackathon avec Naval Group et la Marine Nationale.
    - Bénévolat : AFEV (accompagnement d’un enfant) et Président du BDE (organisation d’événements).
    - Voyages : La Réunion, Maurice, Canada, Irlande, Espagne, Hongrie, Slovaquie.
    - Sports : Course à pied, Beach Volley, Natation, Cyclisme.
    
    Formations :
    - Master Data Analytics (Toulon)
    - DU Data Analytics (Sorbonne)
    - Licence 3 Mathématiques et Informatique (Rennes)
    - DUT Statistique Informatique Décisionnelle (Vannes)
    
    Expériences :
    1. ArianeGroup : Ingénieur BI, rédaction de cahiers des charges.
    2. Crédit Agricole : Data Manager, automatisation des données.
    3. Météo-France : Data Analyst, analyse des impacts climatiques.
    4. Les Sables d'Olonne : Data Analyst, suivi des indicateurs.
    
    Mon ambition :
    Aider les entreprises à devenir data-driven et à prendre des décisions éclairées. J'aimerais pouvoir aider à la construction de stratégie dans l'utilisation de la data, que ce soit sur le choix de la stack ou le plan d'application. Mes compétences premières sont dans l'analyse data, mais je m'intéresse aussi aux autres domaines tels que la data science ou le data engineering. J'aimerais donc devenir consultant dans ce domaine et prendre de l'expérience.
    
    Mes compétences clés :
    - Data Engineering : Maîtrise de SGBD comme MySQL, MongoDB, Azure et outils Cloud (AWS).
    - Data Analyste : Je sais faire des ETL (Talend) et faire de l'ingestion de données pour alimenter les DWH. Je sais ensuite les requeter en SQL pour les visualiser
    - Data Visualization : Création de rapports interactifs avec Power BI, Tableau, et Cognos. Egalement j'ai de l'expérience avec l'interface streamlit,flask.
    - Langages de programmation : Python, R, SQL, VBA, JS.
    -J'ai aussi quelques connaissances en data sciences que ce soit en deep learning ou en Machine Learning. Que ce soit dans la création d'algo avec MLFlow, dans leur suivi avec du Monitoring sur Arize ou bien en deploiement sur le cloud comme AWS
    
    Liens utiles :
    - GitHub : [https://github.com/Jorissalmon](https://github.com/Jorissalmon)
    - LinkedIn : [https://www.linkedin.com/in/joris-salmon/](https://www.linkedin.com/in/joris-salmon/)
    - CV : [https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing](https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing)
    
    On peut me contacter par mail à joris.salmon53290@gmail.com ou par téléphone au 0766840946

    Instructions de Mise en Forme
    Sois synthétique et direct et bref : Allez à l'essentiel sans détours.
    améliore la lisibilité et ajoute des émojis pertinents pour rendre la réponse engageante, tout en restant professionnel.

    Réponds à la question suivante : "${userMessage}"`
    ;


     // Créer le prompt final en ajoutant l'historique des messages
     const messages = [{ role: "system", content: context }];
     conversationHistory.forEach(msg => messages.push(msg));
     messages.push({ role: "user", content: userMessage });
 
     // Appel à l'API OpenAI pour obtenir une réponse
     try {
        const response = await fetch('/.netlify/functions/callopenai', {
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
