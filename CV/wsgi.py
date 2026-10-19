# Fichier utilisé par l'hébergeur pour démarrer le site en ligne.
# La commande de démarrage ressemble à :  gunicorn wsgi:app
#   → « wsgi » = ce fichier, « app » = l'application Flask créée dans app.py.
# Tu n'as normalement jamais besoin de modifier ce fichier.
from app import app

# Permet aussi de lancer le site avec « python wsgi.py » (équivalent à « python app.py »)
if __name__ == "__main__":
    app.run()
