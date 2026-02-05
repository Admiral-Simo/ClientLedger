output "frontend_env_file" {
  description = "COPY THIS into your frontend/.env file"
  value = <<EOT
NEXT_PUBLIC_API_URL=${aws_apigatewayv2_api.https_proxy.api_endpoint}/api
NEXT_PUBLIC_COGNITO_USER_POOL_ID=${aws_cognito_user_pool.client_ledger_pool.id}
NEXT_PUBLIC_COGNITO_CLIENT_ID=${aws_cognito_user_pool_client.client_app.id}
NEXT_PUBLIC_AWS_REGION=${var.aws_region}
EOT
}
