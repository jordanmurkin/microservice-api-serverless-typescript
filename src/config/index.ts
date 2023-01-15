import 'dotenv/config'; // Instatiate environment variables

const CONFIG = {
  app: process.env.APP || 'dev',
  port: process.env.PORT || '3000',

  db_host: process.env.DB_HOST || 'localhost',
  db_port: Number(process.env.DB_PORT) || 3306,
  db_name: process.env.DB_NAME || 'db_name',
  db_user: process.env.DB_USER || 'db_user',
  db_password: process.env.DB_PASSWORD || 'db_password',

  jwt_encryption_key: process.env.JWT_ENCRYPTION_KEY || 'CGN28HUNQ8980NS3HFIOW8N34',
  jwt_access_expiry_time: process.env.JWT_ACCESS_EXPIRY_TIME || '86400', // 1 day
  jwt_refresh_expiry_time: process.env.JWT_REFRESH_EXPIRY_TIME || '2592000', // 30 days

  s3_bucket: process.env.S3_BUCKET || 'cus.door-to-door',
  s3_bucket_url: process.env.S3_BUCKET_URL || 'https://s3.eu-west-2.amazonaws.com/cus.door-to-door',

  aws_region: process.env.AWS_REGION_NAME || 'eu-west-2',
  aws_ses_sender: process.env.AWS_SES_SENDER || 'noreply@edflabs.net',
};

export default CONFIG;
