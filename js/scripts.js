// Initialiser un tableau pour stocker les messages
let conversationHistory = [];


// Si document n'existe pas (Node.js), utiliser JSDOM pour simuler le DOM
if (typeof document === 'undefined') {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <body>
            <div id="chatbotBubble"></div>
            <div id="chatPopupBody"></div>
            <input id="userMessage" />
            <div id="chatPopup"></div>
        </body>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
}

// Ouvrir/Fermer la fenêtre de chat
document.getElementById("chatbotBubble").addEventListener("click", function() {
    const popup = document.getElementById("chatPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";

    if (popup.style.display === "block") {
        this.style.animation = "none"; // Arrête l'animation
        showPresetPhrases();
    } else {
        this.style.animation = ""; // Réactive l'animation si la bulle est fermée
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
    "Comment te contacter ?",
    "Où te retrouver ?"
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
        button.onclick = (event) => {
            event.stopPropagation(); // Empêche la fermeture du chat
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

// Fermer la fenêtre de chat si l'utilisateur clique en dehors
document.addEventListener("click", function(event) {
    const popup = document.getElementById("chatPopup");
    const bubble = document.getElementById("chatbotBubble");
    const presetContainer = document.querySelector('.preset-phrases');

    // Vérifier si le clic est en dehors de la bulle de chat et de la fenêtre de chat
    if (popup.style.display === "block" && !popup.contains(event.target) && !bubble.contains(event.target)) {
        popup.style.display = "none"; // Fermer la fenêtre
        bubble.style.animation = ""; // Réactive l'animation de la bulle
    }
});

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

    // Créer l'élément d'animation de chargement
    var loading = document.createElement("div");
    loading.className = "loading";
    loading.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    chatBody.appendChild(loading); // Ajouter l'animation au chat



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
    
    La personne que je préfère c'est Kath 🥰 !
    La plus forte et de loin en SEO c'est Cécilia que tu retrouve à ceciliaremark.com

    Liens utiles :
    - GitHub : [https://github.com/Jorissalmon](https://github.com/Jorissalmon)
    - LinkedIn : [https://www.linkedin.com/in/joris-salmon/](https://www.linkedin.com/in/joris-salmon/)
    - CV : [https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing](https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing)
    
    On peut me contacter par mail à joris.salmon53290@gmail.com ou par téléphone au 0766840946

    Instructions de Mise en Forme
    Sois synthétique et direct et bref : Allez à l'essentiel sans détours.
    améliore la lisibilité et ajoute des émojis pertinents pour rendre la réponse engageante, tout en restant professionnel.

    Réponds à la question suivante : "${messageToSend}"`
    ;


     // Créer le prompt final en ajoutant l'historique des messages
     const messages = [{ role: "system", content: context }];
     conversationHistory.forEach(msg => messages.push(msg));
     messages.push({ role: "user", content: messageToSend });


     // Appel à l'API OpenAI pour obtenir une réponse
     try {
        const response = await fetch('https://porte-folio-kappa.vercel.app/api/callopenai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages
            })
        });
        const data = await response.json();
        const messageBot = data.choices[0].message.content;

        // Supprimer l'animation de chargement
        chatBody.removeChild(loading);

        // Ajouter le message de l'assistant avec effet de fondu
        const assistantBubble = document.createElement('p');
        assistantBubble.className = 'bulle-joris';
        assistantBubble.innerHTML = `<strong></strong>`;
        chatBody.appendChild(assistantBubble);
        assistantBubble.classList.add('fade-in'); // Ajouter classe d'animation

        // Assurez-vous de faire défiler vers le bas
        chatBody.scrollTop = chatBody.scrollHeight;

        // Ajouter l'effet de typewriter
        typeWriterEffect(assistantBubble, messageBot);

        // Ajouter le message à l'historique
        conversationHistory.push({ role: "assistant", content: messageBot });
    } catch (error) {
        chatBody.innerHTML += "<p><strong>Erreur:</strong> Le chatbot a connu une erreur.</p>";
        // Supprimer l'animation de chargement
        chatBody.removeChild(loading);
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
