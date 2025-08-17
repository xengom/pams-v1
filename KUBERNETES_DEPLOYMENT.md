# PAMS Kubernetes 배포 가이드

Personal Asset Management System (PAMS)을 Kubernetes 환경에서 배포하고 운영하는 방법을 설명합니다.

## 📊 현재 PAMS 구조 분석

- **Frontend**: React SPA (Vite 빌드)
- **Backend**: Cloudflare Pages Functions (서버리스)
- **Database**: Cloudflare D1 (SQLite)
- **Assets**: Static files

## 🏗️ Kubernetes 아키텍처 설계

### 전체 구조도

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LoadBalancer  │────│    Ingress      │────│   Frontend      │
│   (External)    │    │   Controller    │    │   (React SPA)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │    Backend      │────│   Database      │
                       │   (Node.js)     │    │  (PostgreSQL)   │
                       └─────────────────┘    └─────────────────┘
```

## 1. 컨테이너화 구조

### Frontend Container (nginx + static files)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend API Container (Node.js Express/Fastify)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY functions/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]
```

### Database Migration Strategy

**Option 1**: PostgreSQL + 마이그레이션 스크립트
- Drizzle ORM을 TypeORM/Prisma로 변환
- SQLite 스키마를 PostgreSQL로 변환
- 데이터 마이그레이션 스크립트 작성

**Option 2**: SQLite + Persistent Volume (개발 환경)

**Option 3**: External managed DB (RDS, Cloud SQL) - 권장

## 2. Kubernetes 리소스 구성

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pams-production
  labels:
    name: pams-production
    environment: production
```

### Frontend Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pams-frontend
  namespace: pams-production
  labels:
    app: pams-frontend
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pams-frontend
  template:
    metadata:
      labels:
        app: pams-frontend
        tier: frontend
    spec:
      containers:
      - name: frontend
        image: pams-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Backend API Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pams-backend
  namespace: pams-production
  labels:
    app: pams-backend
    tier: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pams-backend
  template:
    metadata:
      labels:
        app: pams-backend
        tier: backend
    spec:
      containers:
      - name: backend
        image: pams-backend:latest
        ports:
        - containerPort: 3000
          name: http
        - containerPort: 9090
          name: metrics
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pams-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: pams-secrets
              key: jwt-secret
        - name: API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: pams-config
              key: api-base-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Database - PostgreSQL StatefulSet

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: pams-postgres
  namespace: pams-production
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: pams-postgres
  template:
    metadata:
      labels:
        app: pams-postgres
        tier: database
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: pams
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: pams-secrets
              key: postgres-user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: pams-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - $(POSTGRES_USER)
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - $(POSTGRES_USER)
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "gp2"  # AWS EBS
      resources:
        requests:
          storage: 20Gi
```

## 3. 서비스 & 네트워킹

### Services

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: pams-frontend-service
  namespace: pams-production
spec:
  selector:
    app: pams-frontend
  ports:
  - name: http
    port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: pams-backend-service
  namespace: pams-production
  labels:
    app: pams-backend
spec:
  selector:
    app: pams-backend
  ports:
  - name: http
    port: 3000
    targetPort: 3000
    protocol: TCP
  - name: metrics
    port: 9090
    targetPort: 9090
    protocol: TCP
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: pams-postgres-service
  namespace: pams-production
spec:
  selector:
    app: pams-postgres
  ports:
  - name: postgres
    port: 5432
    targetPort: 5432
    protocol: TCP
  type: ClusterIP
```

### Ingress Controller

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pams-ingress
  namespace: pams-production
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - pams.yourdomain.com
    secretName: pams-tls
  rules:
  - host: pams.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: pams-backend-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: pams-frontend-service
            port:
              number: 80
```

## 4. 설정 관리

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pams-config
  namespace: pams-production
data:
  NODE_ENV: "production"
  API_BASE_URL: "https://pams.yourdomain.com/api"
  CORS_ORIGIN: "https://pams.yourdomain.com"
  DATABASE_HOST: "pams-postgres-service"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "pams"
  REDIS_HOST: "pams-redis-service"
  REDIS_PORT: "6379"
  LOG_LEVEL: "info"
  SESSION_TIMEOUT: "3600"
```

### Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: pams-secrets
  namespace: pams-production
type: Opaque
data:
  database-url: <base64-encoded-postgresql-connection-string>
  postgres-user: <base64-encoded-username>
  postgres-password: <base64-encoded-password>
  jwt-secret: <base64-encoded-jwt-secret>
  encryption-key: <base64-encoded-encryption-key>
  redis-password: <base64-encoded-redis-password>
```

## 5. 모니터링 & 로깅

### Prometheus ServiceMonitor

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: pams-backend-metrics
  namespace: pams-production
spec:
  selector:
    matchLabels:
      app: pams-backend
  endpoints:
  - port: metrics
    interval: 30s
    path: /metrics
```

### Grafana Dashboard ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pams-dashboard
  namespace: monitoring
data:
  pams-dashboard.json: |
    {
      "dashboard": {
        "title": "PAMS Application Metrics",
        "panels": [
          {
            "title": "Request Rate",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(http_requests_total{job=\"pams-backend\"}[5m])"
              }
            ]
          }
        ]
      }
    }
```

### Fluentd Logging

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1.14-debian-elasticsearch7-1
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

## 6. 보안 설정

### NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: pams-network-policy
  namespace: pams-production
spec:
  podSelector:
    matchLabels:
      app: pams-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: pams-production
    - podSelector:
        matchLabels:
          app: pams-frontend
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: pams-postgres
    ports:
    - protocol: TCP
      port: 5432
  - to: []  # Allow all egress for external APIs
    ports:
    - protocol: TCP
      port: 443
    - protocol: TCP
      port: 80
```

### RBAC

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pams-service-account
  namespace: pams-production

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: pams-production
  name: pams-role
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pams-role-binding
  namespace: pams-production
subjects:
- kind: ServiceAccount
  name: pams-service-account
  namespace: pams-production
roleRef:
  kind: Role
  name: pams-role
  apiGroup: rbac.authorization.k8s.io
```

### Pod Security Policy

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: pams-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

## 7. 스케일링 & 고가용성

### HorizontalPodAutoscaler

```yaml
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pams-frontend-hpa
  namespace: pams-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pams-frontend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pams-backend-hpa
  namespace: pams-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pams-backend
  minReplicas: 2
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
```

### PodDisruptionBudget

```yaml
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pams-frontend-pdb
  namespace: pams-production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: pams-frontend

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pams-backend-pdb
  namespace: pams-production
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: pams-backend
```

### VerticalPodAutoscaler

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: pams-backend-vpa
  namespace: pams-production
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pams-backend
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: backend
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 1
        memory: 1Gi
```

## 8. CI/CD 파이프라인

### GitOps with ArgoCD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pams-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/xengom/pams-k8s-manifests
    targetRevision: HEAD
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: pams-production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker images
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        ECR_REPOSITORY_FRONTEND: pams-frontend
        ECR_REPOSITORY_BACKEND: pams-backend
        IMAGE_TAG: ${{ github.sha }}
      run: |
        # Build frontend
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG
        
        # Build backend
        docker build -f Dockerfile.backend -t $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG
    
    - name: Update Kubernetes manifests
      run: |
        sed -i "s|IMAGE_TAG|${{ github.sha }}|g" k8s/overlays/production/kustomization.yaml
        git config --global user.email "actions@github.com"
        git config --global user.name "GitHub Actions"
        git add k8s/overlays/production/kustomization.yaml
        git commit -m "Update image tag to ${{ github.sha }}"
        git push
```

### Kustomize Structure

```
k8s/
├── base/
│   ├── kustomization.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── database/
│       ├── statefulset.yaml
│       └── service.yaml
├── overlays/
│   ├── development/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   └── production/
│       ├── kustomization.yaml
│       └── patches/
```

## 9. 백업 & 재해복구

### Database Backup CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: pams-production
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: postgres-backup
            image: postgres:15
            command:
            - /bin/bash
            - -c
            - |
              export PGPASSWORD=$POSTGRES_PASSWORD
              pg_dump -h $DATABASE_HOST -U $POSTGRES_USER -d $DATABASE_NAME > /backup/backup-$(date +%Y%m%d-%H%M%S).sql
              
              # Upload to S3
              aws s3 cp /backup/backup-$(date +%Y%m%d-%H%M%S).sql s3://pams-backups/database/
              
              # Cleanup old local backups
              find /backup -type f -name "*.sql" -mtime +7 -delete
            env:
            - name: DATABASE_HOST
              value: pams-postgres-service
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: pams-secrets
                  key: postgres-user
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: pams-secrets
                  key: postgres-password
            - name: DATABASE_NAME
              value: pams
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: access-key-id
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: secret-access-key
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
  failedJobsHistoryLimit: 3
  successfulJobsHistoryLimit: 3
```

### Disaster Recovery Plan

```yaml
# Restore Job Template
apiVersion: batch/v1
kind: Job
metadata:
  name: postgres-restore
  namespace: pams-production
spec:
  template:
    spec:
      containers:
      - name: postgres-restore
        image: postgres:15
        command:
        - /bin/bash
        - -c
        - |
          # Download backup from S3
          aws s3 cp s3://pams-backups/database/backup-YYYYMMDD-HHMMSS.sql /restore/
          
          # Restore database
          export PGPASSWORD=$POSTGRES_PASSWORD
          psql -h $DATABASE_HOST -U $POSTGRES_USER -d $DATABASE_NAME < /restore/backup-YYYYMMDD-HHMMSS.sql
        env:
        - name: DATABASE_HOST
          value: pams-postgres-service
        # ... (same env vars as backup job)
        volumeMounts:
        - name: restore-storage
          mountPath: /restore
      volumes:
      - name: restore-storage
        emptyDir: {}
      restartPolicy: Never
  backoffLimit: 3
```

## 10. 성능 최적화

### Redis Caching Layer

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pams-redis
  namespace: pams-production
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pams-redis
  template:
    metadata:
      labels:
        app: pams-redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: pams-secrets
              key: redis-password
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
        volumeMounts:
        - name: redis-storage
          mountPath: /data
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: pams-redis-service
  namespace: pams-production
spec:
  selector:
    app: pams-redis
  ports:
  - port: 6379
    targetPort: 6379
  type: ClusterIP
```

### CDN Integration

```yaml
# CloudFront Distribution (if using AWS)
# This would be managed via Terraform or CloudFormation
apiVersion: v1
kind: ConfigMap
metadata:
  name: cdn-config
  namespace: pams-production
data:
  cdn_domain: "d1234567890.cloudfront.net"
  cdn_enabled: "true"
  static_assets_cache_ttl: "86400"  # 24 hours
```

## 🎯 주요 고려사항

### 1. 데이터베이스 마이그레이션

- **Drizzle → TypeORM/Prisma** 변환
- **SQLite → PostgreSQL** 스키마 변환
- 데이터 마이그레이션 스크립트 작성
- 인덱스 최적화

### 2. API 변환

- **Pages Functions → Express/Fastify** 변환
- REST API 엔드포인트 구현
- 인증/인가 시스템 추가 (JWT)
- Rate limiting 구현

### 3. 환경 변수 관리

- Cloudflare 환경변수 → K8s ConfigMap/Secret
- 다중 환경 (dev/staging/prod) 설정
- 시크릿 로테이션 정책

### 4. 보안 강화

- TLS 인증서 자동 갱신 (cert-manager)
- 컨테이너 이미지 보안 스캔
- Pod Security Standards 적용
- Network Policy 세분화

## 💰 비용 예상 (AWS EKS 기준)

### 월간 운영 비용

| 리소스 | 사양 | 월 비용 (USD) |
|--------|------|---------------|
| EKS 클러스터 | Control Plane | $73 |
| 워커 노드 | t3.medium × 3 | $100 |
| 데이터베이스 | RDS PostgreSQL (db.t3.micro) | $15 |
| 스토리지 | EBS 50Gi | $5 |
| Load Balancer | ALB/NLB | $18 |
| 모니터링 | CloudWatch/Prometheus | $20 |
| 백업 | S3 storage | $5 |
| **총합** | | **$236/월** |

### 비용 최적화 방안

1. **Spot Instances** 활용 (워커 노드 50% 절약)
2. **Reserved Instances** 구매 (1년 약정 시 30% 절약)
3. **Resource Limits** 최적화
4. **Auto Scaling** 활용
5. **Development 환경** 비용 최소화

## 📚 추가 참고 자료

- [Kubernetes 공식 문서](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager](https://cert-manager.io/)
- [Prometheus Operator](https://prometheus-operator.dev/)
- [ArgoCD](https://argo-cd.readthedocs.io/)
- [Kustomize](https://kustomize.io/)

## 🚀 배포 시작하기

1. **클러스터 준비**: EKS/GKE/AKS 클러스터 생성
2. **필수 컴포넌트 설치**: Ingress Controller, cert-manager, Prometheus
3. **시크릿 생성**: 데이터베이스 credentials, TLS 인증서
4. **네임스페이스 생성**: `kubectl apply -f namespace.yaml`
5. **애플리케이션 배포**: `kubectl apply -k overlays/production/`
6. **모니터링 설정**: Grafana 대시보드 구성
7. **백업 설정**: CronJob으로 정기 백업 구성

이 가이드를 따라 PAMS를 확장성 있고 안정적인 Kubernetes 환경에서 운영할 수 있습니다.