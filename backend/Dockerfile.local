FROM python:3.11

WORKDIR /code

COPY . /code

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --only main

ENV NAME World

CMD dockerize -wait tcp://db:3306 -timeout 60s && uvicorn main:app --host 0.0.0.0 --reload
