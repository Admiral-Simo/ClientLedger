resource "aws_apigatewayv2_api" "https_proxy" {
  name          = "clientledger-https-proxy"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.https_proxy.id
  name        = "$default"
  auto_deploy = true
}

# 3. Create the Integration (Connects Gateway -> Beanstalk)
resource "aws_apigatewayv2_integration" "beanstalk_integration" {
  api_id                 = aws_apigatewayv2_api.https_proxy.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"

  # Forward traffic to your insecure Beanstalk URL
  # The /{proxy} part ensures paths like /api/contracts are preserved
  integration_uri        = "http://${aws_elastic_beanstalk_environment.backend_env.cname}/{proxy}"

  payload_format_version = "1.0"
}

# 4. Create the Route (Listen for ANY request)
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.https_proxy.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.beanstalk_integration.id}"
}

# 5. Output the new Secure URL
output "backend_https_url" {
  value = aws_apigatewayv2_api.https_proxy.api_endpoint
}
