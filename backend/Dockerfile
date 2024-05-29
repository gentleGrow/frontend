# Base image with common configurations
FROM python:3.11-slim as python-base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.8.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

# Prepend Poetry and the virtual environment to the PATH
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# Install curl and other dependencies in the base image
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        curl \
        build-essential

# Builder stage
FROM python-base as builder-base

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION

# Copy the project requirement files
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml ./

# Install runtime dependencies without dev dependencies
RUN poetry install --no-dev

# Development stage
FROM python-base as development

ENV FASTAPI_ENV=development
WORKDIR $PYSETUP_PATH

# Copy Poetry and dependencies from builder-base stage
COPY --from=builder-base $POETRY_HOME $POETRY_HOME
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH

# Install all dependencies, including dev dependencies
RUN poetry install

WORKDIR /backend
COPY . /backend

# Set PYTHONPATH to include current directory
ENV PYTHONPATH=.

# Install Dockerize using curl
ENV DOCKERIZE_VERSION v0.6.1
RUN curl -sSL https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz -o dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Ensure all shell scripts are executable
RUN chmod +x /backend/etc/cronjob/setup.sh /backend/etc/cronjob/stock_jobs.sh /backend/etc/cronjob/main.sh

EXPOSE 8000

# Run the main shell script
CMD ["sh", "-c", "dockerize -wait tcp://${MYSQL_HOST}:3306 -timeout 60s && bash ./etc/cronjob/main.sh && uvicorn main:app --host 0.0.0.0 --reload"]
