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
    "Ton CV, Github, ou LinkedIn ?"
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

    Bonjour ! Je suis Joris, j'ai 22 ans, un Data Analyst passionné par le monde de la donnée, actuellement en DU Data Analytics à la Sorbonne Paris 1 et en Master 2 à Toulon.
    
    Mes centres d'intérêts :
    - Hackathons : Océan Hackathon avec Naval Group et la Marine Nationale.
    - Bénévolat : AFEV (accompagnement d’un enfant) et Président du BDE (organisation d’événements).
    - Voyages : La Réunion, Maurice, Canada, Irlande, Espagne, Hongrie, Slovaquie.
    - Sports : Course à pied, Beach Volley, Natation, Cyclisme.
    
    Formations :
    - Master Data Analytics (Toulon)
    - DU Data Analytics (Sorbonne, Paris 1)
    - Licence 3 Mathématiques et Informatique (Rennes)
    - DUT Statistique Informatique Décisionnelle (Vannes)
    
    Expériences :
    1. ArianeGroup : Ingénieur BI, j'ai élaboré des rapport BI Cognos, je définissai le besoin avec le client. J'ai élaboré des rapports permettant le pilotage des couts du service. De plus, j'ai travaillé avec la suite Atlassian pour le suivi et la gestion des tickets Atlassian.
    2. Crédit Agricole : Data Manager, j'ai aidé à la migration des données sur une base de données via un processus automatisé sur la suite Microsoft notamment via Access. Mon travail a permit d'automatiser la migration et de la faire plus rapidement
    3. Météo-France : Data Analyst, J'ai travaillé sur le sujet de recherche, le réchauffement climatique a t-il un impact sur les phénomènes de fortes précipitations en Bretagne. J'ai analysé les données de 1959 à nos jours, avec des méthodes et tests statistiques avancés. Finalement j'ai trouvé des résultats sensiblement significatif mais qui méritait de plus amples recherches
    4. Les Sables d'Olonne : Data Analyst, construction d'un algorithme qui récupère les données multi sources, qui va les traitzer et les stocker. Après cela, il va générer sur demande un rapport statistique sur le territoire. Cela est utili notamment pour suivre les performances du service public.
    
    Mon ambition :
    Aider les entreprises à devenir data-driven et à prendre des décisions éclairées. J'aimerais pouvoir aider à la construction de stratégie dans l'utilisation de la data, que ce soit sur le choix de la stack ou le plan d'application. Mes compétences premières sont dans l'analyse data, mais je m'intéresse aussi aux autres domaines tels que la data science ou le data engineering. J'aimerais donc devenir consultant dans ce domaine et prendre de l'expérience.
    
    Mes compétences clés :
    - Data Engineering : Maîtrise de SGBD comme MySQL, MongoDB, et outils Cloud (AWS, Azure).
    - Data Analyste : Je sais faire des ETL (Talend) et faire de l'ingestion de données pour alimenter les DWH. Je sais ensuite les requeter en SQL pour les visualiser ensuite sur des outils de data visualization
    - Data Visualization : Création de rapports interactifs avec Power BI, Tableau, et Cognos Analytics. Egalement j'ai de l'expérience avec l'interface streamlit,flask.
    - Langages de programmation : Python, R, SQL, VBA, JS.
    -J'ai aussi quelques connaissances en data sciences que ce soit en deep learning ou en Machine Learning. Que ce soit dans la création d'algo avec MLFlow, dans leur suivi avec du Monitoring sur Arize ou bien en deploiement sur le cloud comme AWS
    
    La plus forte et de loin en SEO c'est Cécilia que tu retrouve à ceciliaremark.com

    Liens utiles :
    Je veux que tu mettes seulement le lien dans le message, et que tu donnes le github, le linkedin et le cv
    - GitHub : https://github.com/Jorissalmon
    - LinkedIn : https://www.linkedin.com/in/joris-salmon/
    - CV : https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing

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
        let messageBot = data.choices[0].message.content;

        // Pour les liens cliquables
        messageBot = messageBot
        .replace('https://github.com/Jorissalmon', '<a href="https://github.com/Jorissalmon" target="_blank" class="styled-link">GitHub</a>')
        .replace('https://www.linkedin.com/in/joris-salmon/', '<a href="https://www.linkedin.com/in/joris-salmon/" target="_blank" class="styled-link">LinkedIn</a>')
        .replace('https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing', '<a href="https://drive.google.com/file/d/1NeNoU_QvoOKOkPdssN59cdVko7NGEH0M/view?usp=sharing" target="_blank" class="styled-link">CV</a>')
        .replace('joris.salmon53290@gmail.com', '<a href="mailto:joris.salmon53290@gmail.com" class="styled-link">joris.salmon53290@gmail.com</a>')
        .replace('0766840946', '<a href="tel:+33766840946" class="styled-link">0766840946</a>');
        
        // Supprimer l'animation de chargement
        chatBody.removeChild(loading);

        // Créer un nouvel élément div pour la bulle de message
        const assistantBubble = document.createElement('div');
        assistantBubble.className = 'bulle-joris';

        // Créer un conteneur flex pour l'image et le texte
        const bubbleContent = document.createElement('div');
        bubbleContent.className = 'bubble-content'; // Classe pour le conteneur flex

        const faviconElement = document.createElement('link'); // Création d'un élément <link>
        faviconElement.rel = 'icon';  // Type d'élément (favicon)
        faviconElement.href = '/meta/favicon.ico';  // Chemin relatif à la racine
        faviconElement.type = 'image/x-icon';  // Type MIME de l'icône
        document.head.appendChild(faviconElement);  // Ajout à la balise <head>

        // Créer un nouvel élément pour le message texte
        const messageElement = document.createElement('p'); // Créer un élément <p> pour le texte
        messageElement.innerHTML = messageBot; // Remplir le message texte ici
        bubbleContent.appendChild(messageElement); // Ajouter le message au conteneur

        // Ajouter l'image et le contenu dans une div flex
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper'; // Conteneur pour l'image et le texte
        contentWrapper.appendChild(faviconElement); // Ajouter l'image
        contentWrapper.appendChild(bubbleContent); // Ajouter le texte

        assistantBubble.appendChild(contentWrapper); // Ajouter le wrapper à la bulle
        chatBody.appendChild(assistantBubble); // Ajouter la bulle au chat

        // Assurez-vous de faire défiler vers le bas
        chatBody.scrollTop = chatBody.scrollHeight;

        // Ajouter l'effet de typewriter
        typeWriterEffect(bubbleContent, messageBot);

        // Ajouter le message à l'historique
        conversationHistory.push({ role: "assistant", content: messageBot });
    } catch (error) {
        chatBody.innerHTML += "<p><strong>Erreur:</strong> Le chatbot a connu une erreur.</p>";
        // Supprimer l'animation de chargement
        chatBody.removeChild(loading);
    }
}

 
// Fonction d'animation de type "mot par mot" qui respecte le HTML
function typeWriterEffect(element, text) {
    let index = 0;
    let currentText = ''; // Stocker le texte actuellement affiché
    let isInTag = false;  // Indique si on est à l'intérieur d'une balise HTML
    const typingEffect = setInterval(() => {
        if (index < text.length) {
            // Vérifier si on est à l'intérieur d'une balise HTML
            if (text[index] === '<') {
                isInTag = true;
            }
            if (isInTag) {
                currentText += text[index]; // Accumuler les caractères d'une balise
                if (text[index] === '>') {
                    isInTag = false; // Fin de la balise
                }
            } else {
                currentText += text[index]; // Ajouter un caractère normal
            }

            // Ajouter tout le texte au fur et à mesure (balises + contenu)
            element.innerHTML = currentText;
            index++;
            element.scrollTop = element.scrollHeight; // Scroll jusqu'en bas
        } else {
            clearInterval(typingEffect); // Arrêter l'animation quand c'est fini
        }
    }, 5); // Vitesse d'animation, en millisecondes
}
