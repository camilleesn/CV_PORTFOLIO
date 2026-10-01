from flask import Flask, render_template, request
# 1. Initialisation de l'application Flask
app = Flask(__name__)

# --- 2. VOS DONNÉES (Le contenu de votre CV) ---
parcours_data = {
    "nom": "Camille ESNAULT",
    "titre": "Consultante Data",
    "contact": "camilleesnault.pro@gmail.com",
    "experiences": [
        {"titre": "Développeur Backend Senior", "entreprise": "Innovatech Solutions", "annee": "2022-Présent", "description": "Conception et maintenance d'APIs RESTful avec Flask et SQLAlchemy."},
        {"titre": "Développeur Junior", "entreprise": "DataFlow Agency", "annee": "2019-2022", "description": "Automatisation de rapports et développement d'outils internes en Python."}
    ],
    "competences": ["Python", "Flask", "SQL", "HTML/CSS", "JavaScript", "Git"]
}
# ----------------------------------------------


@app.route('/')
def accueil():
    """Route pour la page d'accueil du CV/Portfolio."""
    return render_template('index.html', user=parcours_data)

@app.route('/academique')
def academique():
    return render_template('academique.html', user=parcours_data)

@app.route('/professionnel')
def professionnel():
    return render_template('professionnel.html', user=parcours_data)

@app.route('/projets')
def projets():
    return render_template('projets.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    success = False
    if request.method == 'POST':
        # Récupération des données du formulaire
        nom = request.form.get('nom')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Pour l'instant, tu peux simplement afficher les données dans ton terminal
        print(f"Nouveau message de {nom} ({email}) : {message}")
        
        success = True

    return render_template('contact.html', user=parcours_data, success=success)


if __name__ == '__main__':
    # Lance l'application web. Accessible à l'adresse http://127.0.0.1:5000/
    app.run(debug=True)


    