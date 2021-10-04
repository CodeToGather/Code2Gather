from flask import Flask

from src.gateway import executor_blueprint

__version__ = "0.0.1"


def create_app():
    app = Flask(__name__)
    app.register_blueprint(executor_blueprint)
    return app


if __name__ == "__main__":
    create_app().run(debug=True)
