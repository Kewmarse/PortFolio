from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from supabase import create_client, Client
from datetime import datetime
import re


app = Flask(__name__)
CORS(app,origins=["*"]) 

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