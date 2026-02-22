resource "aws_sesv2_email_identity" "sender" {
  email_identity = "mohamedkhalisgm@gmail.com"
}

resource "aws_sesv2_email_identity" "test_client" {
  email_identity = "thementaliste08@gmail.com"
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
