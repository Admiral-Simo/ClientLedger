resource "aws_ses_domain_identity" "main" {
  domain = "clientledger.com" # Replace with your actual domain
}

resource "aws_route53_record" "ses_verification" {
  zone_id = var.route53_zone_id
  name    = "_amazonses.${aws_ses_domain_identity.main.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.main.verification_token]
}

resource "aws_route53_record" "ses_spf" {
  zone_id = var.route53_zone_id
  name    = "yourdomain.com"
  type    = "TXT"
  ttl     = "300"
  records = ["v=spf1 include:amazonses.com ~all"]
}

resource "aws_iam_policy" "ses_sender" {
  name        = "SESSenderPolicy"
  description = "Allows backend to send emails via SES"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ses:SendRawEmail", "ses:SendEmail"]
      Resource = "*"
    }]
  })
}

resource "aws_sesv2_email_identity" "sender" {
  email_identity = "mohamedkhalisgm@gmail.com" # Change to the email you will send from
}

resource "aws_sesv2_email_identity" "test_client" {
  email_identity = "thementaliste08@gmail.com"
}
