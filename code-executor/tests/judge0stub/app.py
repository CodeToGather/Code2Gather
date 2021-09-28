# A local server to stub judge 0
import base64
import json
import time
import uuid
from contextlib import redirect_stderr, redirect_stdout
from io import StringIO
from typing import Any

from flask import Flask, request

from tests.judge0stub.constants import LANGUAGE_ID_LIST

# Create app
app = Flask(__name__)

# Store submissions
d = {}


@app.route("/languages")
def supported_languages() -> str:
    return json.dumps(LANGUAGE_ID_LIST)


def eval_program(source_code: str) -> tuple[str, str, float]:
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
    return stderr.getvalue(), stdout.getvalue(), end - start


# Stub only supports python
@app.route("/submissions/", methods=["POST"])
def submission() -> str:
    args = request.get_json()
    if args is None:
        return json.dumps({"error": "Invalid input"})

    errval, output, runtime = eval_program(args.get("source_code", ""))
    uid = uuid.uuid4().__str__()
    d[uid] = {
        "compile_output": None,
        "memory": 1000,
        "message": None,
        "stdout": output if len(output) > 0 else None,
        "stderr": errval if len(errval) > 0 else None,
        "status": {"id": 3, "description": "Accepted"},
        "time": str(runtime),
        "token": uid,
    }
    return json.dumps({"token": uid})


def b64_encode_key(result: dict[Any, Any], key: str) -> dict:
    result[key] = (
        base64.b64encode(result[key].encode()).decode()
        if result.get(key, None) is not None
        else None
    )
    return result


@app.route("/submissions/<path:path>")
def submission_with_id(path: str) -> str:
    result = d.get(path, {"error": "Invalid submission id"})
    url_args = request.args
    if url_args.get("base64_encoded", "false") == "true":
        b64_encode_key(result, "stderr")
        b64_encode_key(result, "stdout")
        b64_encode_key(result, "message")
        b64_encode_key(result, "compile_output")
    return json.dumps(result)


def start_app(host: str, port: int, debug: bool = False) -> None:
    """Launch Judge 0 Stub"""
    app.run(debug=debug, host=host, port=port)


if __name__ == "__main__":
    start_app("localhost", 2358, True)
