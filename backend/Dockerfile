# Dockerfile for Django rideshare app
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

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