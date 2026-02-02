resource "aws_cognito_user_pool" "client_ledger_pool" {
  name = "clientledger-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 6
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }
}

resource "aws_cognito_resource_server" "backend_api" {
  identifier = "com.clientledger.backend"
  name       = "Client Ledger Backend"
  user_pool_id = aws_cognito_user_pool.client_ledger_pool.id

  scope {
    scope_name        = "contracts.create"
    scope_description = "Allows creating new contracts"
  }

  scope {
    scope_name        = "contracts.read"
    scope_description = "Allows reading existing contracts"
  }
}

resource "aws_cognito_user_pool_client" "client_app" {
  name = "clientledger-frontend"

  user_pool_id = aws_cognito_user_pool.client_ledger_pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes = [
    "openid",
    "email",
    "profile",
    "com.clientledger.backend/contracts.create",
    "com.clientledger.backend/contracts.read"
  ]

  callback_urls = ["http://localhost:3000/callback"]
  logout_urls   = ["http://localhost:3000/logout"]

  supported_identity_providers = ["COGNITO"]

  depends_on = [aws_cognito_resource_server.backend_api]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "clientledger-auth-${random_string.suffix.result}"
  user_pool_id = aws_cognito_user_pool.client_ledger_pool.id
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

output "cognito_issuer_uri" {
  value = "https://cognito-idp.us-east-3.amazonaws.com/${aws_cognito_user_pool.client_ledger_pool.id}"
}
