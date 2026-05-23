# microservices-apps-deploy

GitOps-ready sample repository for deploying a small microservices application with Docker, Helm, Kubernetes, and ArgoCD.

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
argocd/
  root-app.yaml       App-of-apps entry point
  apps/               ArgoCD Applications for each service
  projects/           ArgoCD AppProject
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

## Bootstrap with ArgoCD

Update this placeholder before applying:

- `ingress.host` in `environments/dev/frontend-values.yaml`

Then apply the root app:

```bash
kubectl apply -f argocd/root-app.yaml
```

## GitOps Platform Reference

This application repo is referenced by `gitops-platform/argocd/apps/microservices-apps-deploy.yaml`.
When the `gitops-platform` root app syncs `argocd/apps`, ArgoCD creates the `microservices-apps-deploy`
application, which then syncs this repo's `argocd/root-app.yaml` and deploys the service applications.

## Image Publishing

On pull requests, `.github/workflows/docker-build.yml` builds changed service images as a validation check.
On pushes to `main`, it pushes changed service images to GHCR:

```text
ghcr.io/mahesh-newdevops/user-service:<commit-sha>
ghcr.io/mahesh-newdevops/order-service:<commit-sha>
ghcr.io/mahesh-newdevops/payment-service:<commit-sha>
ghcr.io/mahesh-newdevops/frontend:<commit-sha>
```

After pushing images, the workflow updates only the changed services' `environments/dev/*-values.yaml` files with the new commit SHA and commits that change back to `main`. ArgoCD detects that Git change and deploys only the applications whose values changed.
