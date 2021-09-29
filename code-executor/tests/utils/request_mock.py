import base64
import json
from typing import Any


class MockResponseObj(object):
    def __init__(self, content: str, args: str = None):
        self.content = content
        self.args = args


def b64_encode_key(result: dict[Any, Any], key: str) -> dict:
    result[key] = (
        base64.b64encode(result[key].encode()).decode()
        if result.get(key, None) is not None
        else None
    )
    return result


def generate_lang_mock() -> MockResponseObj:
    return MockResponseObj(json.dumps([{"id": 71, "name": "Python (3.8.1)"}]))


def generate_send_mock() -> MockResponseObj:
    return MockResponseObj(json.dumps({"token": "this_is_uuid_example"}))


def generate_result_mock() -> MockResponseObj:
    result = {
        "compile_output": None,
        "memory": 1000,
        "message": None,
        "stdout": "Hello World!\n",
        "stderr": None,
        "status": {"id": 3, "description": "Accepted"},
        "time": "0.122",
        "token": "this_is_uuid_example",
    }
    b64_encode_key(result, "stderr")
    b64_encode_key(result, "stdout")
    b64_encode_key(result, "message")
    b64_encode_key(result, "compile_output")
    return MockResponseObj(json.dumps(result))
