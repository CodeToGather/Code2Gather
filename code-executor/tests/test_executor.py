import pytest
import multiprocessing as mp
from typing import Any
from src.code_executor import CodeExecutor
try:
    from tests.judge0stub.app import start_app
except ImportError:
    from judge0stub.app import start_app


@pytest.fixture
def url():
    # Set up
    host = "localhost"
    port = 2358
    process = mp.Process(target=start_app, args=(host, port))
    process.start()

    # Yield stub url
    yield f"http://{host}:{port}"

    # Tear down
    process.kill()


class TestCodeExecutor(object):
    PYTHON = 'Python (3.8.1)'
    EMPTY_STRING = ''

    def create_executor(self, url: str) -> CodeExecutor:
        return CodeExecutor(url)

    def check_result(self, result: dict[str, Any], token_id: str, stdout: str = None, stderr: str = None, message: str = None, compile_output: str = None) -> bool:
        assert result['token'] == token_id
        assert result['stdout'] == stdout, f"Stdout is suppose to be '{stdout}' but got '{result[stdout]}'"
        assert result['stderr'] == stderr
        assert result['message'] == message
        assert len(result['time']) > 0
        assert result['memory'] > 0
        assert result['status'] is not None

    def test_get_languages(self, url):
        executor = self.create_executor(url)
        assert len(executor.get_supported_languages()) >= 0

    def test_language_to_id(self, url):
        executor = self.create_executor(url)
        supported_languages = executor.get_supported_languages()

        assert self.PYTHON in supported_languages

        for language in supported_languages:
            assert executor.get_id_from_language(language) is not None

    def test_get_results(self, url):
        python_hello_world = "print(\"Hello World!\")"
        executor = self.create_executor(url)

        # Check for correct id
        language_id = executor.get_id_from_language(self.PYTHON)
        assert language_id is not None

        # Check for correct execution result id
        results_id = executor.send_to_execute(
            python_hello_world, language_id, self.EMPTY_STRING)
        assert len(results_id) > 0

        # Check for correct execution result
        results = executor.get_results(results_id)
        self.check_result(results, results_id, "Hello World!\n")
