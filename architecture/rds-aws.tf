data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_security_group" "default" {
  vpc_id = data.aws_vpc.default.id
  name   = "default"
}

resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_db_instance" "default" {
  allocated_storage      = 20
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  identifier             = "my-terraform-rds-instance"
  db_name                = "mydatabase"

  # These pull from your secrets (tfvars or env vars)
  username               = var.db_username
  password               = var.db_password

  skip_final_snapshot    = true
  publicly_accessible    = true

  # REFERENCES TO THE DATA ABOVE:
  vpc_security_group_ids = [data.aws_security_group.default.id]
  db_subnet_group_name   = aws_db_subnet_group.default.name
}

output "rds_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.default.endpoint
}
