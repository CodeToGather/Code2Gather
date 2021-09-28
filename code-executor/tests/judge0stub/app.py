# A local server to stub judge 0
import json
import uuid
import time
import base64
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr
from flask import Flask, request
try:
    from tests.judge0stub.constants import LANGUAGE_ID_LIST
except ImportError:
    from constants import LANGUAGE_ID_LIST

# Create app
app = Flask(__name__)

# Store submissions
d = {}


@app.route("/languages")
def supported_languages() -> str:
    return json.dumps(LANGUAGE_ID_LIST)


def eval_program(source_code: str) -> tuple[str, str, int]:
    stdout = StringIO()
    stderr = StringIO()
    with redirect_stdout(stdout):
        with redirect_stderr(stderr):
            start = time.time()
            try:
                eval(source_code)
            except Exception as e:
                stderr.write(str(e) + "\nNote: Stubs do not support imports")
            end = time.time()
    return stderr.getvalue(), stdout.getvalue(), end-start


# Stub only supports python
@app.route("/submissions/", methods=["POST"])
def submission() -> str:
    args = request.get_json()
    errval, output, runtime = eval_program(args.get('source_code', ""))
    uid = uuid.uuid4().__str__()
    d[uid] = {
        "compile_output": None,
        "memory": 1000,
        "message": None,
        "stdout": output if len(output) > 0 else None,
        "stderr": errval if len(errval) > 0 else None,
        "status": {"id": 3, "description": "Accepted"},
        "time": str(runtime),
        "token": uid
    }
    return json.dumps({'token': uid})


def serialise_key(result, key) -> dict:
    result[key] = base64.b64encode(result[key].encode()).decode(
    ) if result.get(key, None) is not None else None
    return result


@app.route("/submissions/<path:path>")
def submission_with_id(path) -> str:
    result = d.get(path, {"error": "Invalid submission id"})
    url_args = request.args
    if url_args.get('base64_encoded', "false") == 'true':
        serialise_key(result, 'stderr')
        serialise_key(result, 'stdout')
        serialise_key(result, 'message')
        serialise_key(result, 'compile_output')
    return json.dumps(result)


def start_app(host: str, port: int, debug: bool = False) -> None:
    """Launch Judge 0 Stub"""
    app.run(debug=debug, host=host, port=port)


if __name__ == "__main__":
    start_app('localhost', 2358, True)
