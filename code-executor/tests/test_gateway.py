import json
from unittest.mock import patch

import pytest
import requests
from flask.testing import FlaskClient
from pytest_mock import MockerFixture

from src import create_app
from tests.utils.request_mock import (
    LANGUAGES,
    TOKEN_RETURN,
    generate_lang_mock_success,
    generate_send_mock_success,
)


@pytest.fixture
def client():
    with patch("requests.get", return_value=generate_lang_mock_success()):
        with patch("requests.post", return_value=generate_send_mock_success()):
            app = create_app()
            with app.test_client() as client:
                yield client


def test_languages_endpoint_success(client: FlaskClient, mocker: MockerFixture) -> None:
    """Test the languages endpoint"""
    result = client.get("/languages")
    assert len(result.data) > 0
    assert json.loads(result.data) == [LANGUAGES[0]["name"]]


def test_submissions_endpoint_success_input_none(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    result = client.post(
        "/submission",
        data=json.dumps(
            {
                "code": 'print("Hello World!\n)"',
                "language": "Python (3.8.1)",
                "input": None,
            }
        ),
        content_type="application/json",
    )
    assert len(result.data) > 0
    assert json.loads(result.data) == {"result": TOKEN_RETURN["token"]}


def test_submissions_endpoint_success_input_not_none(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    result = client.post(
        "/submission",
        data=json.dumps(
            {
                "code": 'print("Hello World!\n)"',
                "language": "Python (3.8.1)",
                "input": "hello\n",
            }
        ),
        content_type="application/json",
    )
    assert len(result.data) > 0
    assert json.loads(result.data) == {"result": TOKEN_RETURN["token"]}


def test_submissions_endpoint_failure_invalid_packet(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    result = client.post("/submission")
    assert len(result.data) > 0
    assert result.status_code == 401
    assert json.loads(result.data) == {"error": "invalid request or not json request"}


def test_submissions_endpoint_failure_missing_args(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    result = client.post(
        "/submission",
        data=json.dumps(
            {"code": '#include<stdio.h> int main(void){prinft("Hello World");}'}
        ),
        content_type="application/json",
    )
    assert len(result.data) > 0
    assert result.status_code == 401
    assert json.loads(result.data) == {"error": "missing either code, language"}


def test_submissions_endpoint_failure_error_language(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    result = client.post(
        "submission",
        data=json.dumps(
            {
                "code": 'print("Hello World!\n)"',
                "language": "C",  # This is not avail in mock call
                "input": None,
            }
        ),
        content_type="application/json",
    )
    assert len(result.data) > 0
    assert result.status_code == 404
    assert json.loads(result.data) == {"error": "language is not found"}


def test_submissions_endpoint_failure_execution_server_down(
    client: FlaskClient, mocker: MockerFixture
) -> None:
    with patch("requests.get") as getMock:
        getMock.side_effect = requests.exceptions.RetryError
        with patch(
            "requests.post",
        ) as postMock:
            postMock.side_effect = requests.exceptions.RetryError
            result = client.post(
                "submission",
                data=json.dumps(
                    {
                        "code": 'print("Hello World!\n)"',
                        "language": "C",  # This is not avail in mock call
                        "input": None,
                    }
                ),
                content_type="application/json",
            )
            assert len(result.data) > 0
            assert result.status_code == 500
            assert json.loads(result.data) == {"error": "Execution server is down"}
