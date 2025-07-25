from flask import Flask, request, jsonify
from flask_smorest import Api
from flask_cors import CORS
from connexion import FlaskApp, middleware
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

def create_app():
    app = FlaskApp(__name__)
    app.add_api("api.yaml")
    app.add_middleware(
        CORSMiddleware,
        position=middleware.MiddlewarePosition.BEFORE_ROUTING,
        allow_origins="*",
        allow_methods="*",
        allow_headers="*",
        allow_credentials=True
    )
    load_dotenv()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="localhost", port=5000)