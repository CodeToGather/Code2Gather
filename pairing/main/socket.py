import socketio


class PairingSocket(socketio.AsyncNamespace):
    def __init__(self, namespace, config):
        super().__init__(namespace)
        self.config = config

    async def on_connect(self, sid, environ):
        print(environ)
        return {"data": "success"}

    async def on_disconnect(self, sid):
        return {"data": "success"}
