from typing import Any

from pytest_mock import MockerFixture
from src.code_executor import CodeExecutor
from tests.utils.request_mock import (
    generate_lang_mock_success,
    generate_result_mock_failure_error,
    generate_result_mock_success,
    generate_send_mock_failure_error,
    generate_send_mock_failure_missing_field,
    generate_send_mock_success,
)


class TestCodeExecutor(object):
    PYTHON = "Python (3.8.1)"
    EMPTY_STRING = ""
    URL = "mockurl"

    def create_executor(self, url: str) -> CodeExecutor:
        return CodeExecutor(url)

    def check_result(
        self,
        result: dict[str, Any],
        token_id: str,
        stdout: str = None,
        stderr: str = None,
        message: str = None,
        compile_output: str = None,
    ) -> None:
        assert result["compile_output"] == compile_output
        assert result["token"] == token_id
        assert result["stdout"] == stdout
        assert result["stderr"] == stderr
        assert result["message"] == message
        assert len(result["time"]) > 0
        assert result["memory"] > 0
        assert result["status"] is not None

    def test_get_languages(self, mocker: MockerFixture) -> None:
        mocker.patch(
            "requests.get",
            return_value=generate_lang_mock_success(),
        )
        executor = self.create_executor(self.URL)
        assert len(executor.get_supported_languages()) >= 0

    def test_language_to_id(self, mocker: MockerFixture) -> None:
        mocker.patch(
            "requests.get",
            return_value=generate_lang_mock_success(),
        )
        executor = self.create_executor(self.URL)
        supported_languages = executor.get_supported_languages()

        assert self.PYTHON in supported_languages

        for language in supported_languages:
            assert executor.get_id_from_language(language) is not None

    def test_submit_result_failure_missing_field(self, mocker: MockerFixture):
        mocker.patch("requests.get", return_value=generate_lang_mock_success())
        mocker.patch(
            "requests.post", return_value=generate_send_mock_failure_missing_field()
        )
        python_hello_world = 'print("Hello World!")'
        executor = self.create_executor(self.URL)

        # Check for correct id
        language_id = executor.get_id_from_language(self.PYTHON)
        assert language_id is not None

        # Check for correct execution result id
        results_id = executor.send_to_execute(
            python_hello_world, language_id, self.EMPTY_STRING
        )
        assert results_id is None

    def test_submit_result_failure_error(self, mocker: MockerFixture):
        mocker.patch("requests.get", return_value=generate_lang_mock_success())
        mocker.patch("requests.post", return_value=generate_send_mock_failure_error())
        python_hello_world = 'print("Hello World!")'
        executor = self.create_executor(self.URL)

        # Check for correct id
        language_id = executor.get_id_from_language(self.PYTHON)
        assert language_id is not None

        # Check for correct execution result id
        results_id = executor.send_to_execute(
            python_hello_world, language_id, self.EMPTY_STRING
        )
        assert results_id is None

    def test_get_results_success(self, mocker: MockerFixture) -> None:
        mocker.patch("requests.get", return_value=generate_lang_mock_success())
        mocker.patch("requests.post", return_value=generate_send_mock_success())
        python_hello_world = 'print("Hello World!")'
        executor = self.create_executor(self.URL)

        # Check for correct id
        language_id = executor.get_id_from_language(self.PYTHON)
        assert language_id is not None

        # Check for correct execution result id
        results_id = executor.send_to_execute(
            python_hello_world, language_id, self.EMPTY_STRING
        )
        assert results_id is not None
        assert len(results_id) > 0

        # Check for correct execution result
        mocker.patch("requests.get", return_value=generate_result_mock_success())
        results = executor.get_results(results_id)
        self.check_result(results, results_id, "Hello World!\n")

    def test_get_results_failure(self, mocker: MockerFixture):
        mocker.patch("requests.get", return_value=generate_lang_mock_success())
        mocker.patch("requests.post", return_value=generate_send_mock_success())
        python_hello_world = 'print("Hello World!")'
        executor = self.create_executor(self.URL)

        # Check for correct id
        language_id = executor.get_id_from_language(self.PYTHON)
        assert language_id is not None

        # Check for correct execution result id
        results_id = executor.send_to_execute(
            python_hello_world, language_id, self.EMPTY_STRING
        )
        assert results_id is not None
        assert len(results_id) > 0

        # Check for correct execution result
        mocker.patch("requests.get", return_value=generate_result_mock_failure_error())
        results = executor.get_results(results_id)
        assert results == {"error": "something went wrong"}
