"""
CV de Camille Esnault — serveur du site (Flask)

Ce fichier est le « point d'entrée » du site. Flask est une petite
bibliothèque Python qui :
  1. reçoit les visites (ex. quelqu'un ouvre https://ton-site/),
  2. choisit quelle page renvoyer,
  3. remplit cette page avec tes informations, puis l'envoie au navigateur.

Organisation du projet :
  app.py               ← ce fichier (le serveur)
  wsgi.py              ← utilisé par l'hébergeur (gunicorn) pour lancer app.py
  requirements.txt     ← bibliothèques Python à installer (flask, gunicorn)
  templates/index.html ← la page du CV (le contenu et sa structure)
  static/styles.css    ← l'apparence (couleurs, tailles, animations…)
  static/script.js     ← les comportements (menu, frise, défilement…)
  static/img/          ← photo et logos
  static/cv/           ← ton CV au format PDF

Pour lancer le site sur ton ordinateur :
  pip install -r requirements.txt
  python app.py
  puis ouvre http://127.0.0.1:5000/ dans ton navigateur.
"""

from flask import Flask, render_template, redirect

# Création de l'application Flask
app = Flask(__name__)


# --- Informations générales -------------------------------------------
# Ces valeurs sont réutilisées dans index.html avec la syntaxe {{ user.xxx }}.
# Par exemple {{ user.email }} affiche l'adresse email ci-dessous.
# → Pour changer ton email, ton téléphone ou ton LinkedIn partout sur le
#   site, il suffit de les modifier ici.
profil = {
    "nom": "Camille ESNAULT",
    "titre": "Data Analyst & Data Scientist Junior",   # utilisé dans le titre de l'onglet du navigateur
    "email": "camilleesnault.pro@gmail.com",
    "telephone": "06 73 66 97 55",
    "ville": "Souleuvre en Bocage",
    "linkedin": "https://www.linkedin.com/in/camille-esnault-992725227",
    "cv_pdf": "cv/CV_Camille_Esnault.pdf",            # chemin du PDF dans le dossier static/
}


# --- Pages du site -----------------------------------------------------
# « @app.route('/') » veut dire : quand quelqu'un visite l'adresse « / »
# (la page d'accueil), exécute la fonction juste en dessous.

@app.route('/')
def accueil():
    """Le CV tient sur une seule page qui défile."""
    # render_template remplit templates/index.html avec les infos de « profil »
    return render_template('index.html', user=profil)


# Les anciennes adresses (de la version à plusieurs pages) renvoient vers la
# bonne partie de la page unique, pour que les liens déjà partagés marchent.
# Exemple : /projets → /#projets (la page, directement à la section Projets)
@app.route('/academique')
@app.route('/professionnel')
def parcours():
    return redirect('/#parcours')


@app.route('/projets')
def projets():
    return redirect('/#projets')


@app.route('/contact')
def contact():
    return redirect('/#contact')


# --- Lancement en local ------------------------------------------------
# Ce bloc ne s'exécute que si on lance « python app.py » sur son ordinateur.
# En ligne, c'est l'hébergeur qui démarre le site via wsgi.py.
if __name__ == '__main__':
    # debug=True : la page se recharge automatiquement quand tu modifies le code
    # et les erreurs s'affichent en détail (à n'utiliser qu'en local)
    app.run(debug=True)
