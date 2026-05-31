# microservices-apps-deploy

Sample microservices repository with Docker, Helm charts, and per-environment values. ArgoCD configuration is centralized in `gitops-platform`.

## Repository layout

```text
services/
  user-service/       Node.js API service and Dockerfile
  order-service/      Node.js API service and Dockerfile
  payment-service/    Node.js API service and Dockerfile
  frontend/           Static nginx frontend and Dockerfile
charts/
  microservice/       Reusable Helm chart for every service
environments/
  dev/                Per-service Helm values for dev
```

## Build a service image

```bash
docker build -t user-service:local services/user-service
docker run --rm -p 3000:3000 user-service:local
```

Health check:

```bash
curl http://localhost:3000/health
```

## Render Helm manifests

```bash
helm template user-service charts/microservice \
  --namespace microservices-dev \
  -f environments/dev/user-service-values.yaml
```

## Deployment Through ArgoCD

Update this placeholder before applying:

- `ingress.host` in `environments/dev/frontend-values.yaml`

ArgoCD `Application` and `AppProject` manifests for these services live in:

```text
gitops-platform/argocd/microservices
```

Those Applications point to this repo's `charts/microservice` path and use the values under `environments/dev`.

## Image Publishing

On pull requests, `.github/workflows/docker-build.yml` builds changed service images as a validation check.
On pushes to `main`, it pushes changed service images to GHCR:

```text
ghcr.io/mahesh-newdevops/user-service:<commit-sha>
ghcr.io/mahesh-newdevops/order-service:<commit-sha>
ghcr.io/mahesh-newdevops/payment-service:<commit-sha>
ghcr.io/mahesh-newdevops/frontend:<commit-sha>
```

After pushing images, the workflow updates only the changed services' `environments/dev/*-values.yaml` files with the new commit SHA and commits that change back to `main`. ArgoCD detects that source/value change through the centralized Applications in `gitops-platform` and deploys only the applications whose values changed.
