# Nova-App: Node.js on AWS EKS, from Manual Deploy to CI/CD with Monitoring

[![Deploy](https://github.com/Globak143/nova-app/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Globak143/nova-app/actions/workflows/deploy.yml)
[![AWS](https://img.shields.io/badge/AWS-EKS-orange)](https://aws.amazon.com/eks/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

A small Node.js (Express) app used as a hands-on project to learn how applications run on Amazon EKS. It started as a manual, budget-friendly deployment and has grown into an automated pipeline with monitoring. This is a learning project, not a production system.

## Two ways to run it

The repo has two stages. They use the same application code, Dockerfile and Kubernetes manifests.

| | Manual deployment | Automated CI/CD + monitoring |
|---|---|---|
| What it is | Build the image, push it to Docker Hub, apply the manifests yourself | `git push` tests, builds, pushes to ECR and deploys to EKS; Prometheus monitors the pods |
| Where to find it | [`manual-deployment` tag](https://github.com/Globak143/nova-app/tree/manual-deployment) | This branch (`main`) |
| Article | [Deploying a Simple Node.js App on AWS EKS](https://medium.com/@gloriaboakye/deploying-a-simple-node-js-app-on-aws-eks-a-beginner-and-budget-friendly-guide-02d1e101fd26) | Part 1 and Part 2 on AWS Builder Center (links coming) |

**Following the manual article?** Use the [`manual-deployment` tag](https://github.com/Globak143/nova-app/tree/manual-deployment), not `main`. It has the exact code and README the article describes, including the public Docker Hub image. On `main`, `k8s/deployment.yaml` points at a private ECR repository that you cannot pull from.

## Architecture (automated version)

```
 Developer
    |  git push
    v
 GitHub Actions --> run tests --> build Docker image
                                        |
                                        v
                                 Amazon ECR
                                        |  deploy
                                        v
 +------------------- Amazon EKS ---------------------+
 |                                                    |
 |   nova-app  (3 pods, each exposes /metrics)        |
 |        ^                                           |
 |        | scrape (via ServiceMonitor)               |
 |   Prometheus ----> Grafana                         |
 |        |                                           |
 |        +---------> Alertmanager                    |
 |                                                    |
 +----------------------------------------------------+
```

Prometheus is scraping all three pods. The Grafana dashboard and Alertmanager rules are being built next and will be covered in Part 2.

## What's in this repo

```
nova-app/
├── server.js                      # Express app (/, /health, /version, /metrics)
├── package.json                   # Node.js dependencies
├── Dockerfile                     # Image definition
├── tests/
│   └── server.test.js             # Automated tests (run first in the pipeline)
├── .github/workflows/
│   └── deploy.yml                 # CI/CD: test, build, push to ECR, deploy to EKS
├── k8s/
│   ├── cluster-config.yaml        # EKS cluster definition (eksctl)
│   ├── deployment.yaml            # Deployment (3 replicas) and LoadBalancer Service
│   ├── rbac.yaml                  # Role and RoleBinding: least-privilege access for the pipeline
│   └── servicemonitor.yaml        # Tells Prometheus how to scrape the app
├── .dockerignore
├── .gitignore
├── LICENSE
└── readme.md
```

The manual deployment uses only `server.js`, `package.json`, `Dockerfile`, `k8s/cluster-config.yaml` and `k8s/deployment.yaml`. The tests, workflow, RBAC and ServiceMonitor were added for the automated version.

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `/` | Main application endpoint |
| `/health` | Health check with uptime |
| `/version` | Shows which commit is currently deployed |
| `/metrics` | Prometheus metrics, including request counts and latency per pod |

## Automated CI/CD

The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:

1. Run the tests
2. Build the Docker image
3. Push it to Amazon ECR (tagged with the commit SHA, plus `:latest`)
4. Update the Deployment on EKS and wait for the rollout to finish

After a push, open `/version` to see the new commit.

**Note:** the workflow updates the container image only. It does not apply the files in `k8s/`. When you change a manifest, apply it yourself with `kubectl apply -f k8s/<file>.yaml`.

## Monitoring

Prometheus, Grafana and Alertmanager run in a `monitoring` namespace, installed with the `kube-prometheus-stack` Helm chart. A typical install looks like this (adjust values, such as the Grafana admin password, for your setup):

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

Then apply the manifests so Prometheus can find the app:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/servicemonitor.yaml
```

Two details matter, and both fail silently if wrong:
- The Service in `k8s/deployment.yaml` needs the label `app: nova-app` and a port named `http`.
- The ServiceMonitor needs the label `release: monitoring`, which must match your Helm release name.

Prometheus and Grafana are not exposed publicly. Reach them with `kubectl port-forward`.

## Cost and cleanup

An EKS cluster, its nodes and the load balancer all bill by the hour, so **always clean up when you are done**:

```bash
eksctl delete cluster -f k8s/cluster-config.yaml
```

Then check the AWS Console for leftover EC2 instances, load balancers and EKS clusters.

The manual article's cost breakdown (about $1.50 to $2.00) applies to a short run of roughly two hours. A cluster left running for days, with monitoring installed, will cost more.

## Technologies

- **Cloud:** AWS (EKS, ECR, EC2, VPC, Load Balancer)
- **Containers and orchestration:** Docker, Kubernetes
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus, Grafana, Alertmanager (kube-prometheus-stack via Helm)
- **Application:** Node.js, Express
- **Tools:** AWS CLI, eksctl, kubectl, Helm

## Related resources

- **Medium:** [Deploying a Simple Node.js App on AWS EKS](https://medium.com/@gloriaboakye/deploying-a-simple-node-js-app-on-aws-eks-a-beginner-and-budget-friendly-guide-02d1e101fd26)
- **AWS Builder Center:** Part 1 and Part 2 (links coming)
- [Amazon EKS documentation](https://docs.aws.amazon.com/eks/)
- [Kubernetes documentation](https://kubernetes.io/docs/)

## Author

**Gloria Boakye**
- LinkedIn: [linkedin.com/in/gloriaboakye](https://linkedin.com/in/gloriaboakye)
- Medium: [@gloriaboakye](https://medium.com/@gloriaboakye)
- GitHub: [Globak143](https://github.com/Globak143)

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- AWS re/Start Program by Azubi Africa
- Kubernetes and the Cloud Native Computing Foundation
- The DevOps and cloud native community
