import base64
import json
from typing import Any

LANGUAGES = [{"id": 71, "name": "Python (3.8.1)"}]
TOKEN_RETURN = {"token": "this_is_uuid_example"}


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


def generate_lang_mock_success() -> MockResponseObj:
    return MockResponseObj(json.dumps(LANGUAGES))


def generate_send_mock_failure_missing_field() -> MockResponseObj:
    return MockResponseObj(
        json.dumps({"language_id": ["can't be blank"], "error": "This is an error msg"})
    )


def generate_send_mock_failure_error() -> MockResponseObj:
    return MockResponseObj(json.dumps({"error": "wait not allowed"}))


def generate_send_mock_success() -> MockResponseObj:
    return MockResponseObj(json.dumps(TOKEN_RETURN))


def generate_result_mock_success() -> MockResponseObj:
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


def generate_result_mock_failure_error() -> MockResponseObj:
    return MockResponseObj(json.dumps({"error": "something went wrong"}))
