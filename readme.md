# Nova-App: AWS EKS Deployment Project


[![AWS](https://img.shields.io/badge/AWS-EKS-orange)](https://aws.amazon.com/eks/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

A manual, budget-friendly Node.js application deployed on Amazon EKS (Elastic Kubernetes Service) demonstrating cloud-native development and container orchestration skills.

## Project Overview

This project showcases a complete containerized application deployment workflow:
- Building a Node.js Express application
- Containerizing with Docker
- Deploying to AWS EKS
- Implementing Kubernetes best practices
- Cost optimization strategies

**Total Deployment Cost:** Under $2 using optimized t3.small instances

## Architecture
User → AWS Load Balancer → EKS Cluster → Pod Replicas (3x) → Node.js App

## Features

- ✅ RESTful API with health check endpoint
- ✅ Docker containerization
- ✅ Kubernetes deployment with 3 replicas for high availability
- ✅ AWS LoadBalancer integration
- ✅ Manual and auto-scaling capabilities
- ✅ Cost-optimized infrastructure

## Technologies Used

- **Cloud Platform:** AWS (EKS, EC2, VPC, LoadBalancer)
- **Container Orchestration:** Kubernetes
- **Containerization:** Docker
- **Runtime:** Node.js v18
- **Framework:** Express.js
- **IaC:** YAML manifests (eksctl, kubectl)
- **Tools:** AWS CLI, eksctl, kubectl, Docker CLI

## 📁 Project Structure
```
nova-app/
├── server.js              # Main application file
├── package.json           # Node.js dependencies
├── package-lock.json      # Locked dependency versions
├── Dockerfile             # Docker image definition
├── k8s/
│   ├── cluster-config.yaml  # EKS cluster configuration
│   └── deployment.yaml      # Kubernetes deployment & service
├── .gitignore             # Git ignore rules
├── LICENSE                # MIT License
└── readme.md              # Project documentation
```

## Prerequisites

- [AWS Account](https://aws.amazon.com/free/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (configured)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [eksctl](https://eksctl.io/installation/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/)
- [Docker Hub account](https://hub.docker.com/signup)

## Installation & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Globak143/nova-app.git
cd nova-app
```

### 2. Test Locally
```bash
npm install
node server.js
# Visit http://localhost:3000
```

### 3. Build Docker Image
```bash
docker build -t nova-app:v1 .
docker run -d -p 3000:3000 nova-app:v1
```

### 4. Push to Docker Hub
```bash
docker login
docker tag nova-app:v1 YOUR-USERNAME/nova-app:v1
docker push YOUR-USERNAME/nova-app:v1
```

### 5. Create EKS Cluster
```bash
eksctl create cluster -f k8s/cluster-config.yaml
# Wait 10-20 minutes for cluster creation
```

### 6. Deploy Application
Update k8s/deployment.yaml with your Docker Hub username, then:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl get svc  # Get LoadBalancer URL
```

### 7. Access Application
```bash
# Get external IP
kubectl get svc nova-app-service

# Visit in browser:
# http://<EXTERNAL-IP>
# http://<EXTERNAL-IP>/health
```

## Scaling
```bash
# Scale up
kubectl scale deployment nova-app-deployment --replicas=5

# Scale down
kubectl scale deployment nova-app-deployment --replicas=1

# Check status
kubectl get pods
```

## Cleanup (IMPORTANT!)

**Always clean up to avoid AWS charges:**
```bash
eksctl delete cluster -f k8s/cluster-config.yaml
```

Verify deletion in AWS Console:
- EC2 Instances
- Load Balancers
- EKS Clusters

## Cost Breakdown

| Resource | Duration | Cost |
|----------|----------|------|
| EKS Control Plane | ~2 hours | ~$0.40 |
| 2x t3.small nodes | ~2 hours | ~$0.08 |
| Load Balancer | ~2 hours | ~$0.05 |
| **Total** | | **~$1.50-$2.00** |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application endpoint |
| `/health` | GET | Health check with uptime |

## What I Learned

- AWS EKS cluster management and configuration
- Kubernetes deployment strategies and replica management
- Docker containerization and multi-stage builds
- Infrastructure cost optimization
- Cloud-native application architecture
- LoadBalancer configuration and external access
- Kubernetes service types and networking
- Infrastructure lifecycle management

## Contributing

Found an issue or have a suggestion? Feel free to open an issue or submit a pull request.

## Related Resources

- **Medium Article:** [Deploying a Simple Node.js App on AWS EKS](https://medium.com/@gloriaboakye/deploying-a-simple-node-js-app-on-aws-eks-a-beginner-and-budget-friendly-guide-02d1e101fd26)
- **AWS EKS Documentation:** [https://docs.aws.amazon.com/eks/](https://docs.aws.amazon.com/eks/)
- **Kubernetes Docs:** [https://kubernetes.io/docs/](https://kubernetes.io/docs/)

## Author

**Gloria Boakye**
- LinkedIn: [linkedin.com/in/gloriaboakye](https://linkedin.com/in/gloriaboakye)
- Medium: [@gloriaboakye](https://medium.com/@gloriaboakye)
- GitHub: [github.com/Globak143](https://github.com/Globak143)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- AWS re/Start Program by Azubi Africa
- Kubernetes and Cloud Native Computing Foundation
- The DevOps and Cloud Native community

---

⭐ If you find this project helpful, please give it a star!
