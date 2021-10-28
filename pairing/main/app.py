import traceback

import socketio
from main.config import APP_CONFIG
from main.exceptions import Code2GatherException
from main.socket import PairingSocket
from main.utils import Code2GatherJson
from sanic import Sanic
from sanic.exceptions import SanicException
from sanic.response import json
from sanic_cors.extension import CORS as initialize_cors

app = Sanic(load_env=False)
app.config.update(APP_CONFIG)

sio = socketio.AsyncServer(
    async_mode="sanic", cors_allowed_origins=[], json=Code2GatherJson
)
sio.attach(app)
# TODO: Complete the namespace below
sio.register_namespace(PairingSocket("/", app.config))

initialize_cors(app)


async def error_handler(request, exception):
    if isinstance(exception, Code2GatherException):
        if exception.status_code == 404:
            message = f"Requested URL {request.path} not found"
        else:
            message = exception.message
        return json({"error": message}, status=exception.status_code)
    elif isinstance(exception, SanicException):
        return json({"error": exception.args}, status=exception.status_code)
    traceback.print_exc()
    return json({"error": "An internal error occurred."}, status=500)


app.error_handler.add(Exception, error_handler)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=app.config["PORT"])
