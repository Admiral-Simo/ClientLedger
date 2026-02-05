terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.30.0"
    }
  }
}

variable "aws_region" {
  description = " The AWS region to deploy to"
  default = "eu-west-3"
}

provider "aws" {
    region = var.aws_region
}
