class Code2GatherException(Exception):
    status_code = 500

    def __init__(self, message="", status_code=None):
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        else:
            self.status_code = type(self).status_code
