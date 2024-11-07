from sanic import Sanic, response
from supabase import create_client
import os
import aiohttp

# Configuration de l'application Sanic
app = Sanic("projects_api")

# Récupération des informations de Supabase depuis les variables d'environnement
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Définition de la route /projects pour récupérer les projets depuis Supabase
@app.route('/projects', methods=['GET'])
async def get_projects(request):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                f"{SUPABASE_URL}/rest/v1/projects",
                headers={
                    'apikey': SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}',
                    'Content-Type': 'application/json'
                }
            ) as resp:
                # Vérifie si la réponse est OK (200)
                if resp.status == 200:
                    data = await resp.json()
                    return response.json(data, status=200)
                else:
                    return response.json({'error': f"Error {resp.status}: {await resp.text()}"}, status=resp.status)
        except Exception as e:
            return response.json({'error': str(e)}, status=500)

# Pour que Vercel utilise cette application ASGI
app.run()
