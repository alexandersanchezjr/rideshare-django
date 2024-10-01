# Rideshare Project with Websockets, Django, Angular, and Terraform

## Overview

This project is a rideshare application that uses websockets to provide real-time updates. The backend is built with Django using Django REST Framework (DRF) for APIs and Django Channels for WebSocket handling, with Daphne as the ASGI server and Redis for message brokering. The frontend is an Angular application, which manages WebSocket data streams asynchronously using the RxJS library.

The project is containerized using Docker and includes a `docker-compose.yaml` file for easy deployment of the backend and frontend services. Infrastructure provisioning is done using Terraform to set up an AWS EC2 instance with security groups, and GitHub Actions is used for CI/CD, automating the build and deployment process.

## Project Structure

- **Backend**: Django + DRF + Django Channels + Daphne + Redis
- **Frontend**: Angular with RxJS for WebSockets
- **Infrastructure**: Terraform to provision AWS EC2 with security groups
- **CI/CD**: GitHub Actions pipeline for building Docker images, pushing to a repository, and deploying to EC2

## Backend Implementation (Django)

### Requirements
The `requirements.txt` contains all the necessary Python packages to run the Django backend:

```bash
asgiref==3.8.1
attrs==24.2.0
autobahn==24.4.2
Automat==24.8.1
cffi==1.17.1
channels==4.1.0
channels-redis==4.2.0
constantly==23.10.4
cryptography==43.0.1
daphne==4.1.2
Django==5.1.1
django-cors-headers==4.4.0
django-redis==5.4.0
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
hyperlink==21.0.0
idna==3.10
incremental==24.7.2
jmespath==1.0.1
msgpack==1.1.0
psycopg2-binary==2.9.9
pyasn1==0.6.1
pyasn1_modules==0.4.1
pycparser==2.22
PyJWT==2.9.0
pyOpenSSL==24.2.1
python-dateutil==2.9.0.post0
redis==5.0.8
s3transfer==0.10.2
service-identity==24.1.0
setuptools==75.1.0
six==1.16.0
sqlparse==0.5.1
Twisted==24.7.0
txaio==23.1.1
typing_extensions==4.12.2
tzdata==2024.1
urllib3==2.2.3
zope.interface==7.0.3
```

### Backend Dockerfile
Here is the `Dockerfile` to build the backend container:

```dockerfile
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
CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0:8000
```

### Running the Backend
To run the backend using Docker:

1. Build the Docker image:
   ```bash
   docker build -t rideshare-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 rideshare-backend
   ```

3. Alternatively, use `docker-compose` to run everything:
   ```bash
   docker-compose up
   ```

## Frontend Implementation (Angular)

The Angular frontend interacts with the backend via WebSockets for real-time updates using RxJS to manage data streams.

### WebSocket Integration Example
In Angular, RxJS is used to handle WebSocket connections:

```typescript
import { webSocket } from 'rxjs/webSocket';

  // Connection to WebSocket
  connect(): void {
    if (!this.webSocket || this.webSocket.closed) {
      const accessToken = this.auth.accessToken;
      this.webSocket = webSocket(
        `${this.websocketUrl}?token=${accessToken}`
      );
      this.messages = this.webSocket.pipe(share());
      this.messages.subscribe((message) => console.log(message));
    }
  }

  // Some interaction
  createTrip(trip: TripDataMessage): void {
    this.connect();
    const message: TripMessage = {
      type: 'create.trip',
      data: trip,
    };
    this.webSocket.next(message);
  }
```

### Frontend Dockerfile
Here is the `Dockerfile` for building the Angular project:

```dockerfile
# Frontend Dockerfile
# Stage 1: Build the Angular app
FROM node:18.20.4-alpine AS build

# Set environment variables using Docker ARG directives
ARG PRODUCTION=true
ARG HOSTNAME=localhost:8000/
ARG WS_ENDPOINT=ws/rideshare/
ARG SIGNUP=v1/signup
ARG LOGIN=v1/login
ARG TOKEN_REFRESH=v1/token/refresh
ARG TRIPS=v1/trip
ARG GOOGLE_MAPS_API_KEY
ARG PORT=8000

ENV PRODUCTION=$PRODUCTION
ENV HOSTNAME=$HOSTNAME
ENV WS_ENDPOINT=$WS_ENDPOINT
ENV SIGNUP=$SIGNUP
ENV LOGIN=$LOGIN
ENV TOKEN_REFRESH=$TOKEN_REFRESH
ENV TRIPS=$TRIPS
ENV GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY
ENV PORT=$PORT

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Write the environment variables to a TypeScript file
RUN mkdir -p src/environments && \
    echo "export const environment = {" > src/environments/environment.ts && \
    echo "  production: ${PRODUCTION:-true}," >> src/environments/environment.ts && \
    echo "  hostname: '${HOSTNAME:-localhost}:${PORT:-8000}/'," >> src/environments/environment.ts && \
    echo "  wsEndpoint: '${WS_ENDPOINT:-ws/rideshare/}'," >> src/environments/environment.ts && \
    echo "  signup: '${SIGNUP:-v1/signup}'," >> src/environments/environment.ts && \
    echo "  login: '${LOGIN:-v1/login}'," >> src/environments/environment.ts && \
    echo "  tokenRefresh: '${TOKEN_REFRESH:-v1/token/refresh}'," >> src/environments/environment.ts && \
    echo "  trips: '${TRIPS:-v1/trip}'," >> src/environments/environment.ts && \
    echo "  googleMapsApiKey: '${GOOGLE_MAPS_API_KEY}'," >> src/environments/environment.ts && \
    echo "};" >> src/environments/environment.ts


# Export the Angular port
EXPOSE 4200

# Start the Angular server
CMD ["ng", "serve", "--host", "0.0.0.0"]
```

### Running the Frontend
To run the frontend using Docker:

1. Build the Angular Docker image:
   ```bash
   docker build -t rideshare-frontend .
   ```

2. Run the Angular container:
   ```bash
   docker run -p 80:4200 rideshare-frontend
   ```
3. Alternatively, use `docker-compose` to run everything:
   ```bash
   docker-compose up
   ```

## Infrastructure (Terraform)

The infrastructure is managed using Terraform. It provisions an AWS EC2 instance with the necessary security groups and minor resources.

### Sample Terraform Configuration
Here’s a basic configuration for an EC2 instance with a security group:

```hcl
# main.tf

# Create a security group to allow SSH, HTTP, and HTTPS traffic
resource "aws_security_group" "allow_ssh_http_https" {
  name = "allow_ssh_http_https"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Launch an EC2 instance
resource "aws_instance" "docker_ec2" {
  ami             = "ami-006dcf34c09e50022" # Amazon Linux 2 AMI (replace with your desired AMI)
  instance_type   = var.instance_type
  key_name        = var.key_name
  security_groups = [aws_security_group.allow_ssh_http_https.name]

  user_data = <<-EOF
              #!/bin/bash
              # Update the package manager
              yum update -y

              # Install Docker
              amazon-linux-extras install docker -y
              service docker start
              usermod -aG docker ec2-user

              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              EOF

  tags = {
    Name = "docker-ec2-instance"
  }
}
```

The `variables.tf` file contains the variables used in the Terraform configuration:

```hcl
# variables.tf

variable "region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "The name of the SSH key pair to use"
  default     = "rideshare"
}
```

Finally, the `outputs.tf` file contains the output values:

```hcl
# outputs.tf

# Output public IP of the instance
output "instance_public_ip" {
  description = "The public IP of the EC2 instance"
  value       = aws_instance.docker_ec2.public_ip
}

# Output Public DNS of the instance
output "instance_public_dns" {
  description = "The public DNS of the EC2 instance"
  value       = aws_instance.docker_ec2.public_dns
}

# Optionally, output the SSH connection string
output "ssh_connection" {
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.docker_ec2.public_ip}"
  description = "Command to SSH into the EC2 instance"
}
```

### Running Terraform
To deploy the infrastructure:

1. Initialize Terraform:
   ```bash
   terraform init
   ```
2. Validate the configuration:
   ```bash
   terraform validate
   ```
3. Plan the deployment:
   ```bash
   terraform plan
   ```

4. Apply the configuration:
   ```bash
   terraform apply
   ```

## CI/CD (GitHub Actions)

A GitHub Actions pipeline is used to automate the build and deployment process:

1. **Build and push Docker images** to a Docker registry.
2. **Transfer `docker-compose.yaml`** to the EC2 instance.
3. **Run Docker Compose** remotely to deploy the application.

### Example GitHub Actions Workflow
Here is a sample `.github/workflows/deploy.yml` for building and deploying the app:

```yaml
name: "Deploy"

on: 
  push:
    branches:
      - master

jobs:
    docker:
      name: Build and Push
      runs-on: ubuntu-latest

      steps:
        - name: Checkout Repo
          uses: actions/checkout@v3

        - name: Docker Setup Buildx
          uses: docker/setup-buildx-action@v3.0.0

        - name: Docker Login
          uses: docker/login-action@v1
          with:
              username: ${{ secrets.DOCKER_USERNAME }}
              password: ${{ secrets.DOCKER_PASSWORD }}

        - name: Build and Push Docker Backend Image
          uses: docker/build-push-action@v5.0.0
          with:
            context: ./backend  # Context remains the same (current directory)
            file: ./backend/Dockerfile  # Dynamic Dockerfile path
            push: true  # Enable pushing the image
            tags: ${{ secrets.DOCKER_USERNAME }}/rideshare-backend:latest  # Separate tags for services

        - name: Build and Push Docker Frontend Image
          uses: docker/build-push-action@v5.0.0
          with:
            context: ./frontend  # Context remains the same (current directory)
            file: ./frontend/Dockerfile  # Dynamic Dockerfile path
            push: true  # Enable pushing the image
            tags: ${{ secrets.DOCKER_USERNAME }}/rideshare-frontend:latest  # Separate tags for services
            build-args: |
              HOSTNAME=${{ vars.HOSTNAME }}
              PORT=${{ vars.PORT }}
              GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}

    deploy:
      name: Deploy to EC2
      runs-on: ubuntu-latest
      needs: docker
      steps:
        - uses: actions/checkout@v2 
        - name: Build & Deploy
          env:
            PRIVATE_KEY: |
              ${{ secrets.PRIVATE_KEY }}
            HOSTNAME: ${{vars.HOSTNAME}}
            USER_NAME: ec2-user
            DJANGO_SECRET_KEY: ${{ secrets.DJANGO_SECRET_KEY }}
            DJANGO_DEBUG: ${{ vars.DJANGO_DEBUG }}
            POSTGRES_DB: ${{ secrets.POSTGRES_DB }}
            POSTGRES_USER: ${{ secrets.POSTGRES_USER }}
            POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
            DB_HOST: ${{ vars.DB_HOST }}
            DB_PORT: ${{ vars.DB_PORT }}
          run: |
            echo "$PRIVATE_KEY" > pkey.pem && chmod 600 pkey.pem

            echo "$DJANGO_SECRET_KEY" > .env
            echo "DJANGO_DEBUG=$DJANGO" >> .env
            echo "POSTGRES_DB=$POSTGRES_DB" >> .env
            echo "POSTGRES_USER=$POSTGRES_USER" >> .env
            echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
            echo "DB_HOST=$DB_HOST" >> .env
            echo "DB_PORT=$DB_PORT" >> .env

            scp -o StrictHostKeyChecking=no -i pkey.pem .env ${USER_NAME}@${HOSTNAME}:~/.env
            scp -o StrictHostKeyChecking=no -i pkey.pem docker-compose.yaml ${USER_NAME}@${HOSTNAME}:~/docker-compose.yml
            ssh -o StrictHostKeyChecking=no -i pkey.pem ${USER_NAME}@${HOSTNAME} '
  
                # Change to the directory where docker-compose.yml is located
                cd ~
                
                # Pull the latest images (if necessary)
                docker-compose pull

                # Start the services using Docker Compose
                docker-compose up -d
                '
```

Make sure to store your private key and sensitive data in GitHub Secrets for security.

## Demo of the Application

To accesss the **Rideshare app** you can go though this link: [ec2-18-234-128-247.compute-1.amazonaws.com](ec2-18-234-128-247.compute-1.amazonaws.com) and you will see the following screen:

![Rideshare App](images/rideshare-app.png)


## Conclusion

This project demonstrates how to build a real-time rideshare application using Django Channels for WebSocket handling and Angular for the frontend, while managing the infrastructure with Terraform and deploying via GitHub Actions. Both the backend and frontend are containerized using Docker for easy deployment.