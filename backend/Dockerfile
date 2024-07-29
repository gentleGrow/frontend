FROM public.ecr.aws/lambda/python:3.11

WORKDIR ${LAMBDA_TASK_ROOT}

ARG DEBIAN_FRONTEND=noninteractive

RUN yum update -y && \
    yum install -y gcc gcc-c++ make && \
    yum clean all

RUN pip install poetry
RUN pip install peewee==3.17.5

COPY pyproject.toml poetry.lock ${LAMBDA_TASK_ROOT}/

RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi --no-root

COPY . ${LAMBDA_TASK_ROOT}/

COPY ./app/data/yahoo/dividend.py ${LAMBDA_TASK_ROOT}/lambda.py

CMD ["lambda.lambda_handler"]
