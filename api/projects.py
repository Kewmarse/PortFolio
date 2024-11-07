from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from supabase import create_client, Client
from datetime import datetime
import re

app = Flask(__name__)
CORS(app, origins=["*"])

# Récupérer les variables d'environnement pour la connexion Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL et SUPABASE_KEY doivent être définis dans les variables d'environnement.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fonction utilitaire pour centraliser l'appel à l'API Supabase
def fetch_supabase_data(endpoint: str):
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/{endpoint}',
            headers={
                'apikey': SUPABASE_KEY,
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Erreur lors de la connexion à Supabase: {e}")
        return None, str(e)

# Endpoint pour récupérer les projets
@app.route('/api/projects', methods=['GET'])
def get_projects():
    data, error = fetch_supabase_data('projects')
    if error:
        return jsonify({"error": f"Erreur de connexion avec Supabase : {error}"}), 500
    return jsonify(data)

# Ajout d'un handler d'erreurs génériques
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Une erreur interne s'est produite."}), 500

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"error": "Ressource non trouvée."}), 404

if __name__ == '__main__':
    app.run(debug=True)
