from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from supabase import create_client, Client
from datetime import datetime
import re


app = Flask(__name__)
CORS(app) 

# Récupérer les variables d'environnement
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Endpoint pour récupérer les projets
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        # Appel à Supabase pour récupérer les projets
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/projects',
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
        )

        # Vérifie si la réponse est OK
        response.raise_for_status()  # Lève une erreur pour les réponses d'erreur

        # Renvoie les données au format JSON
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        # Gérer les erreurs de connexion
        return jsonify({"error": str(e)}), 500  # Renvoie une erreur 500 avec un message

# Endpoint pour récupérer les articles
@app.route('/api/articles', methods=['GET'])
def get_articles():
    try:
        # Appel à Supabase pour récupérer tous les articles
        response = supabase.table('articles').select('*').execute()
        
        # Vérifie si la réponse contient des données
        if not response.data:
            return jsonify({"message": "No articles found"}), 404  # Pas d'articles trouvés

        return jsonify(response.data)  # Renvoie les articles au format JSON

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Gérer d'autres exceptions

@app.route('/api/check_article_html/<int:article_id>', methods=['GET'])
def check_article_html(article_id):

    # Utiliser l'ID pour vérifier l'existence du fichier HTML
    file_path = os.path.join('articles', f"{article_id}.html")
    if os.path.exists(file_path):
        return jsonify({"exists": True}), 200  # Retourne true si le fichier existe
    
    return jsonify({"exists": False})

@app.route('/api/generate_html/<int:article_id>', methods=['GET'])
def generate_html(article_id):
    try:
        # Récupérer l'article
        article_response = supabase.table('articles').select('*').eq('id', article_id).execute()
        article = article_response.data
        

        if not article:
            return jsonify({"error": "Article not found"}), 404

        article = article[0]


        # Récupérer les paragraphes associés à l'article
        paragraphs_response = supabase.table('paragraphs').select('*').eq('article_id', article_id).order('position').execute()
        paragraphs = paragraphs_response.data

        article_response = supabase.table('articles').select('*').eq('id', article_id).execute()
        article = article_response.data[0]


        # Récupérer les informations de l'auteur
        author_id = article['author_fk']  # Assurez-vous que cet ID est disponible dans les données d'article
        author_response = supabase.table('autheur').select('*').eq('id', author_id).execute()
        author = author_response.data[0]

        # Convertir la date en utilisant le format approprié
        updated_at = datetime.strptime(article['updated_at'], '%Y-%m-%dT%H:%M:%S.%f').strftime('%d %B %Y')

        # Récupérer les articles liés (assurez-vous d'avoir une logique pour les articles liés)
        related_articles_response = supabase.table('articles').select('*').neq('id', article_id).limit(2).execute()  # Exemple pour récupérer d'autres articles
        related_articles_html = "".join([f"<li><a href='./{related_article['id']}.html' class='related-article'>{related_article['title']}</a></li>" for related_article in related_articles_response.data])
        
        # Contenu principal de l'article avec un style Medium
        article_content = f"""
            <div class="article">
                <h1 class='article-title'>{article['title']}</h1>
                <div class="article-meta">
                    <div class="author-info">
                        <img src="{author['author_image']}" alt="Photo de l'auteur" class="author-photo">
                        <div class="author-details">
                            <p class='article-author'><strong>By {author['author']}</strong></p>
                            <p class='publication-date'>· {article['reading_time']} read · {updated_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        """

        for paragraph in paragraphs:

             # Ajouter une image avec style si elle est présente
            if paragraph.get('image_url'):
                article_content += f"""
                <figure class='article-figure'>
                    <img src="{paragraph['image_url']}" alt="" class="article-image" loading="lazy">
                    <figcaption class='article-caption'>{paragraph.get('caption', '')}</figcaption>
                </figure>
                """
            # Ajouter une source si elle est présente
            if paragraph.get('source'):
                article_content += f"<p class='article-source'><em><a href='{paragraph['source']}'>{paragraph['source']}</a></em></p>"

            # Ajouter un titre de paragraphe
            if paragraph.get('Titre_paragraphe'):
                article_content += f"<h2 class='paragraph-title'>{paragraph['Titre_paragraphe']}</h2>"
            
            # Ajouter le contenu du paragraphe
            article_content += f"<p class='article-paragraph'>{paragraph['content']}</p>"
            article_content +="<br>"
            
        # Modèle HTML complet avec la structure Medium
        html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="{article['title']}" name="keywords">
    <meta content="{article['meta_description']}" name="description">

    <!-- Favicon -->
    <link rel="icon" href="../meta/favicon.ico" type="image/x-icon">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- CSS Libraries -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="../lib/animate/animate.min.css" rel="stylesheet">
    <link href="../lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="../lib/lightbox/css/lightbox.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="../css/style.css" rel="stylesheet">
</head>
    
    
    <title>{article['title']}</title>
</head>

<body data-spy="scroll" data-target=".navbar" data-offset="51">
    <!-- Nav Bar Start -->
    <div class="navbar navbar-expand-lg bg-light navbar-light">
        <div class="container-fluid">
            <a href="../index.html" class="navbar-brand-article">Portfolio</a>
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </div>
    <!-- Nav Bar End -->

    <!-- Bulle de chat -->
    <div class="chatbot-bubble" id="chatbotBubble">💬</div>

    <!-- Fenêtre de chat -->
    <div class="chat-popup" id="chatPopup">
        <div class="chat-popup-header">Poses moi tes questions</div>
        <div class="chat-popup-body" id="chatPopupBody">
            <p>Ecris ton message ici</p>
        </div>
        <div class="chat-popup-footer">
            <input type="text" id="userMessage" placeholder="Écrivez votre message...">
            <button onclick="sendMessage()">Envoyer</button>
        </div>
    </div>
    <!-- Bulle de chat End -->

    <!-- Article Start -->
    <div class="container article" id="article">
        <div class="text-center wow zoomIn" data-wow-delay="0.1s">
            {article_content}
        </div>
    </div>

    <div class="fixed-related-articles">
        <h4>Vous pourriez aussi lire...</h4>
        <ul>
            {related_articles_html}  <!-- Les articles liés seront insérés ici -->
        </ul>
    </div>

    <!-- Article End -->

    <!-- Footer Start -->
    <div class="contact" id="contact">
        <div class="footer wow fadeIn" data-wow-delay="0.3s" id="isfooter">
            <div class="container-fluid">
                <div class="container">
                    <div class="footer-info">
                        <h2>Envoyez moi un message !</h2>
                        <h3>Joris Salmon</h3>
                        <div class="footer-menu">
                            <p>+33 766840946</p>
                            <p>Joris.salmon53290@gmail.com</p>
                        </div>
                        <h3>Toulon, France</h3>
                        <div class="footer-social">
                            <a href="https://github.com/Jorissalmon" target="_blank"><i class="fab fa-github"></i></a>
                            <a href="https://www.linkedin.com/in/joris-salmon/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div class="container copyright">
                    <p>&copy; <a href="#">Joris Salmon</a>, Tous droits réservés | Conçu par <a href="https://htmlcodex.com">HTML Codex</a></p>
                </div>
            </div>
        </div>
    </div>
    <!-- Footer End -->

    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
    <script src="../lib/easing/easing.min.js"></script>
    <script src="../lib/wow/wow.min.js"></script>
    <script src="../lib/waypoints/waypoints.min.js"></script>
    <script src="../lib/typed/typed.min.js"></script>
    <script src="../lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="../lib/isotope/isotope.pkgd.min.js"></script>
    <script src="../lib/lightbox/js/lightbox.min.js"></script>

    <!-- Contact Javascript File -->
    <script src="../mail/jqBootstrapValidation.min.js"></script>
    <script src="../mail/contact.js"></script>
    <script src="../js/chatbot.js"></script>
    <script src="../js/supabase.js"></script>

    <!-- Template Javascript -->
    <script src="../js/main.js"></script>
</body>
</html>"""

        # Créez le dossier articles s'il n'existe pas
        if not os.path.exists('articles'):
            os.makedirs('articles')

        # Enregistrez le fichier HTML
        file_path = os.path.join('articles', f"{article['id']}.html")
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(html_content)

        return jsonify({"message": "HTML generated successfully", "file_path": file_path})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=8080)