# --- 1. EC2 Instance Role (The Server's Permission) ---
resource "aws_iam_role" "beanstalk_ec2" {
  name = "clientledger-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Attach the "WebTier" policy (CRITICAL for Green Health)
resource "aws_iam_role_policy_attachment" "beanstalk_ec2_web" {
  role       = aws_iam_role.beanstalk_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

# Create the "Instance Profile" wrapper (Beanstalk needs this)
resource "aws_iam_instance_profile" "beanstalk_ec2_profile" {
  name = "clientledger-ec2-profile"
  role = aws_iam_role.beanstalk_ec2.name
}

# --- 2. Beanstalk Service Role (The Manager's Permission) ---
resource "aws_iam_role" "beanstalk_service" {
  name = "clientledger-service-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "elasticbeanstalk.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "beanstalk_service_health" {
  role       = aws_iam_role.beanstalk_service.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
}

resource "aws_iam_role_policy_attachment" "beanstalk_service_main" {
  role       = aws_iam_role.beanstalk_service.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService"
}
