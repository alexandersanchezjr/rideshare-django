# Dockerfile for Django rideshare app
FROM python:3.12-slim

ARG DJANGO_SECRET_KEY
ARG DJANGO_DEBUG=False
ARG POSTGRES_DB
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG DB_HOST=db
ARG DB_PORT=5432

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ENV DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
ENV DJANGO_DEBUG=$DJANGO_DEBUG
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT

# Create app directory
WORKDIR /usr/src/backend

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the project
COPY . .

WORKDIR /usr/src/backend/rideshare_app

EXPOSE 8000

# Run Django
# CMD ["daphne", "-b", "0.0.0.0", "-p", "8001", "rideshare_app.asgi:application"]

# Run Django
CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0:8000