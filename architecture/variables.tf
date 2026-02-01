variable "db_username" {
  description = "The username for the RDS instance"
  type        = string
}

variable "db_password" {
  description = "The password for the RDS instance"
  type        = string
  sensitive   = true  # This hides the value from console logs
}

variable "security_group_id" {
  type = string
}

variable "db_subnet_group_name" {
  type = string
}
