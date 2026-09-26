# SupportSphere AWS Deployment Checklist

## 1. AWS Services

- [ ] AWS account ready
- [ ] IAM user/role configured
- [ ] Amazon ECR
- [ ] EC2 or ECS
- [ ] Amazon RDS for MySQL
- [ ] Amazon S3
- [ ] AWS Secrets Manager
- [ ] CloudFront
- [ ] Route 53
- [ ] ACM SSL certificate

## 2. Backend

- [x] Spring Boot production profile
- [x] Environment-based database configuration
- [x] Environment-based AI API key
- [x] Docker image
- [x] Java 17 runtime
- [ ] Push Docker image to ECR
- [ ] Deploy backend to EC2/ECS
- [ ] Configure production environment variables

## 3. Database

- [x] MySQL database schema
- [x] Local Docker MySQL verified
- [ ] Create RDS MySQL
- [ ] Create production database
- [ ] Configure RDS credentials
- [ ] Configure security group
- [ ] Test backend → RDS connection

## 4. Frontend

- [x] React production build
- [x] Nginx configuration
- [x] Docker image
- [ ] Deploy frontend
- [ ] Configure production API URL
- [ ] Configure HTTPS

## 5. File Storage

- [ ] Create S3 bucket
- [ ] Configure attachment storage
- [ ] Configure bucket permissions
- [ ] Update backend storage configuration

## 6. Security

- [x] Secrets removed from application.properties
- [x] .env excluded from Git
- [x] Production environment variables prepared
- [ ] Move secrets to AWS Secrets Manager
- [ ] HTTPS
- [ ] Restrict database access
- [ ] Configure IAM permissions

## 7. Final Verification

- [ ] Frontend accessible publicly
- [ ] Login works
- [ ] Dashboard works
- [ ] Ticket management works
- [ ] AI Chat works
- [ ] File uploads work
- [ ] Database persistence works
- [ ] HTTPS works
- [ ] Production logs verified