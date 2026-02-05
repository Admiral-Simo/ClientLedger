data "aws_elastic_beanstalk_solution_stack" "java17" {
  name_regex = "^64bit Amazon Linux 2023 v.* running Corretto 17$"
}

resource "aws_elastic_beanstalk_application" "backend_app" {
  name        = "clientledger-backend"
  description = "Spring Boot Backend for Client Ledger"
}

resource "aws_elastic_beanstalk_environment" "backend_env" {
  name                = "clientledger-prod"
  application         = aws_elastic_beanstalk_application.backend_app.name
  solution_stack_name = data.aws_elastic_beanstalk_solution_stack.java17.name

  # --- 1. HARDWARE ---
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  # --- 2. ROLES (Using the ones we just created in iam.tf) ---
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.beanstalk_ec2_profile.name
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.beanstalk_service.name
  }

  # --- 3. NETWORK ---
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = data.aws_vpc.default.id
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = join(",", data.aws_subnets.default.ids)
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.app_sg.id
  }

  # --- 4. HEALTH CHECKS (Critical for Green Status) ---
  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/health"
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "MatcherHTTPCode"
    value     = "200"
  }

  # --- 5. ENVIRONMENT VARIABLES ---
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVER_PORT"
    value     = "5000"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_URL"
    value     = "jdbc:mysql://${aws_db_instance.default.endpoint}/${aws_db_instance.default.db_name}"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_USERNAME"
    value     = var.db_username
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DB_PASSWORD"
    value     = var.db_password
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ISSUER_URI"
    value     = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.client_ledger_pool.id}"
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "JWT_SET_URI"
    value     = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.client_ledger_pool.id}/.well-known/jwks.json"
  }
}
