from src.utils.bimap import Bimap

class TestBimap(object):
    def test_retrieval(self):
        m = Bimap([("hi", "hello")])
        assert m.get_key_from_value("hello") == "hi"
        assert m.get_key_from_value("hi") is None
        assert m.get_value_from_key("hi") == "hello"
        assert m.get_value_from_key("hello") is None

    def test_get_keys(self):
        m = Bimap([("hi", "hello"), ("hello", "hi")])
        assert sorted(m.get_keys()) == ["hello", "hi"]
    
    def test_get_values(self):
        m = Bimap([("hi", "hello"), ("hello1", "hi")])
        assert sorted(m.get_values()) == ["hello", "hi"]