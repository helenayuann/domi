from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from endpoints.moodboard import generate_moodboard, import_furniture


def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)

    @app.get("/test")
    def health_check():
        return jsonify({"message": "Domi API is ready"})

    @app.post("/moodboard")
    def moodboard():
        return jsonify(generate_moodboard(request.get_json(silent=True) or {}))

    @app.post("/furniture/import")
    def furniture_import():
        result, status = import_furniture(request.get_json(silent=True) or {})
        return jsonify(result), status

    return app


if __name__ == "__main__":
    create_app().run(host="localhost", port=5000, debug=True)
