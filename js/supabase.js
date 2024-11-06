async function loadProjects() {
    try {
        const response = await fetch("https://porte-folio-kappa.vercel.app/api/projects"); // Appelle l'API Flask pour récupérer les projets
        const projects = await response.json();

        const projectsContainer = document.getElementById("projectsContainer");

        // Vide d'abord le conteneur des projets
        projectsContainer.innerHTML = "";

        // Parcours des projets récupérés
        projects.forEach((project, index) => {
            // Calcule le delay pour l'effet d'animation
            const delay = index * 0.2; // 0.2 secondes pour chaque projet

            // Crée le conteneur HTML pour chaque projet
            const projectDiv = document.createElement("div");
            projectDiv.classList.add("col-lg-4", "col-md-6", "col-sm-12", "portfolio-item", `${project.category}`, "wow", "fadeInUp");
            projectDiv.setAttribute("data-wow-delay", `${delay}s`);

            projectDiv.innerHTML = `
                <div class="portfolio-wrap">
                    <div class="portfolio-img">
                        <img src="${project.image_url}" alt="${project.name}">
                    </div>
                    <div class="portfolio-text">
                        <h3>${project.name}</h3>
                        <a class="btn" href="${project.link}" target="_blank">+</a>
                    </div>
                </div>
            `;

            // Ajoute le projet au conteneur
            projectsContainer.appendChild(projectDiv);
        });

        // Portfolio filter
        var portfolioIsotope = $('#projectsContainer').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $('#portfolio-filter li').on('click', function () {
            $("#portfolio-filter li").removeClass('filter-active');
            $(this).addClass('filter-active');

            portfolioIsotope.isotope({ filter: $(this).data('filter') });
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
    }
}

async function loadArticles() {
    try {
        const response = await fetch("https://porte-folio-kappa.vercel.app/api/articles");

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const articles = await response.json();
        const articlesContainer = document.getElementById("blogjorisContainer");

        if (!articlesContainer) {
            console.error("Conteneur d'articles introuvable dans le DOM");
            return;
        }

        articles.forEach((article) => {
            const articleDiv = document.createElement("div");

            articleDiv.classList.add("col-lg-6", "blog-item", `${article.category}`, "wow", "fadeInUp");
            articleDiv.setAttribute("data-wow-delay", "0.1s");

            articleDiv.innerHTML = `
                <div class="blog-img">
                    <img src="${article.image_url || 'img/default_image.jpg'}" alt="Blog">
                </div>
                <div class="blog-text">
                    <h2>${article.title}</h2>
                    <div class="blog-meta">
                        <p><i class="far fa-user"></i>${article.author}</p>
                    </div>
                    <a class="btn" href="articles/${article.id}.html">Lire la suite <i class="fa fa-angle-right"></i></a>
                </div>
            `;

            articlesContainer.appendChild(articleDiv);
        });

        var blogIsotope = $('.blog .row').isotope({
            itemSelector: '.blog-item',
            layoutMode: 'fitRows'
        });

        // Gestion des clics sur les filtres du blog
        $('#blog-filter li').on('click', function () {
            $("#blog-filter li").removeClass('filter-active');
            $(this).addClass('filter-active');
            
            // Filtrer les éléments
            blogIsotope.isotope({ filter: $(this).data('filter') });
        });
    
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
    }
}

// Fonction pour vérifier et générer les fichiers HTML des articles
async function checkAndGenerateArticles() {
    const articlesResponse = await fetch('https://porte-folio-kappa.vercel.app/api/articles');
    const articles = await articlesResponse.json();
    
    for (const article of articles) {
        const articleId = article.id;
        const articleTitle = article.title.replace(/[^a-z0-9]/gi, '_');
        const articleHtmlPath = `articles/${articleTitle}.html`;
    

        // Vérifie si le fichier HTML de l'article existe
        const checkResponse = await fetch(`https://porte-folio-kappa.vercel.app/api/check_article_html/${articleId}`);
        const checkData = await checkResponse.json(); // Parse le JSON de la réponse

        // Vérifie si "exists" est false
        if (!checkData.exists) {
            console.log(`Le fichier HTML n'existe pas pour l'article: ${article.title}, génération en cours...`);
            
            // Génère le fichier HTML de l'article
            const generateResponse = await fetch(`https://porte-folio-kappa.vercel.app/api/generate_html/${articleId}`, { method: 'GET' });
            
            if (!generateResponse.ok) {
                throw new Error(`Erreur lors de la génération de l'article HTML: ${generateResponse.statusText}`);
            }
            
            console.log(`Fichier HTML généré pour l'article: ${article.title}`);
        } else {
            console.log(`Le fichier HTML existe déjà pour l'article: ${article.title}`);
        }
    }
}

// Appelle la fonction loadProjects pour charger les projets au chargement de la page
document.addEventListener("DOMContentLoaded", async () => {
    loadProjects(); 
    loadArticles();
    checkAndGenerateArticles();
});
