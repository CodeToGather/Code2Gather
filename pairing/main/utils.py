import json
from datetime import datetime


class Code2GatherEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return int(obj.timestamp())
        return json.JSONEncoder.default(self, obj)


class Code2GatherJson:
    @staticmethod
    def dumps(*args, **kwargs):
        return json.dumps(*args, **{**kwargs, "cls": Code2GatherEncoder})

    @staticmethod
    def loads(*args, **kwargs):
        return json.loads(*args, **kwargs)
