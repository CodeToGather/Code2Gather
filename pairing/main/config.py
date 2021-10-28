from os import getenv

from dotenv import load_dotenv

load_dotenv()

APP_CONFIG = {
    "HOST": getenv("HOST"),
    "PORT": getenv("PORT", 8003),
    "CORS_AUTOMATIC_OPTIONS": True,
    "CORS_SUPPORTS_CREDENTIALS": True,
}
