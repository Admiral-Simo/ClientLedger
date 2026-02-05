data "aws_elastic_beanstalk_solution_stack" "java17" {
  name_regex = "^64bit Amazon Linux 2023 v.* running Corretto 17$"
}

# 2. THE APPLICATION CONTAINER
resource "aws_elastic_beanstalk_application" "backend_app" {
  name        = "clientledger-backend"
  description = "Spring Boot Backend for Client Ledger"
}

# 3. THE SERVER ENVIRONMENT
resource "aws_elastic_beanstalk_environment" "backend_env" {
  name                = "clientledger-prod"
  application         = aws_elastic_beanstalk_application.backend_app.name

  # Use the dynamic name we found in step 1
  solution_stack_name = data.aws_elastic_beanstalk_solution_stack.java17.name

  # --- SERVER CONFIGURATION ---
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance" # Keeps costs low (Free Tier eligible)
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    # This role must exist in your AWS IAM.
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  # --- ENVIRONMENT VARIABLES (Injecting them into the server) ---

  # 1. Port
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SERVER_PORT"
    value     = "8080"
  }

  # 2. Database Connection
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

  # 3. Cognito Security (Hardcoded region to eu-west-3)
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "ISSUER_URI"
    value     = "https://cognito-idp.eu-west-3.amazonaws.com/${aws_cognito_user_pool.client_ledger_pool.id}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "JWT_SET_URI"
    value     = "https://cognito-idp.eu-west-3.amazonaws.com/${aws_cognito_user_pool.client_ledger_pool.id}/.well-known/jwks.json"
  }
}
