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
