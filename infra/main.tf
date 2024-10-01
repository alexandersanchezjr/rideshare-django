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