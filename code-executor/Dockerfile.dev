FROM python:3.9-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app/code-executor

COPY requirements.txt .

RUN pip install -r requirements.txt && pip install gunicorn

COPY . .

ENTRYPOINT ["gunicorn", "src.wsgi:app", "-b 0.0.0.0:3000"]
