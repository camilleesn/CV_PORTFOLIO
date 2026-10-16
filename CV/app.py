from flask import Flask, render_template, redirect

# Initialisation de l'application Flask
app = Flask(__name__)

# --- Informations générales (utilisées dans la page) ---
profil = {
    "nom": "Camille ESNAULT",
    "titre": "Data Analyst & Data Scientist Junior",
    "email": "camilleesnault.pro@gmail.com",
    "telephone": "06 73 66 97 55",
    "ville": "Souleuvre en Bocage",
    "linkedin": "https://www.linkedin.com/in/camille-esnault-992725227",
    "cv_pdf": "cv/CV_Camille_Esnault.pdf",
}


@app.route('/')
def accueil():
    """Le CV tient désormais sur une seule page qui défile."""
    return render_template('index.html', user=profil)


# Les anciennes adresses renvoient vers la bonne section de la page unique,
# pour que les liens déjà partagés continuent de fonctionner.
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


if __name__ == '__main__':
    # Accessible à l'adresse http://127.0.0.1:5000/
    app.run(debug=True)
