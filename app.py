from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

CORS(app)
jwt = JWTManager(app)

from routes.auth import auth
app.register_blueprint(auth, url_prefix="/auth")

from routes.documents import documents
app.register_blueprint(documents, url_prefix="/documents")

@app.route("/")
def home():
    return {"message": "MediVault Backend is Running ✅"}

if __name__ == "__main__":
    app.run(debug=True)