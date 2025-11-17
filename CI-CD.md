# GitHub Actions CI/CD Setup

This repository includes automated CI/CD pipelines using GitHub Actions to build, test, and deploy your SQL Agent application to Docker Hub.

## 🔧 Workflows

### 1. **CI - Test and Lint** (`.github/workflows/ci.yml`)

Runs on every push and pull request to validate code quality:

- ✅ Installs dependencies
- ✅ Runs ESLint
- ✅ Type-checks with TypeScript
- ✅ Builds the application
- ✅ Tests Docker image build

### 2. **Build and Push Docker Image** (`.github/workflows/docker-build-push.yml`)

Automatically builds and pushes Docker images to Docker Hub:

- 🐳 Builds multi-platform images (amd64, arm64)
- 📦 Pushes to Docker Hub
- 🏷️ Creates semantic version tags
- 📝 Updates Docker Hub description
- ⚡ Uses GitHub Actions cache for faster builds

## 🚀 Setup Instructions

### Step 1: Create Docker Hub Account and Token

1. Go to [Docker Hub](https://hub.docker.com/)
2. Create an account or sign in
3. Go to **Account Settings** → **Security** → **New Access Token**
4. Create a token with **Read & Write** permissions
5. Save the token securely (you won't be able to see it again)

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following:

   | Secret Name          | Value                        | Description           |
   | -------------------- | ---------------------------- | --------------------- |
   | `DOCKERHUB_USERNAME` | Your Docker Hub username     | e.g., `johndoe`       |
   | `DOCKERHUB_TOKEN`    | Your Docker Hub access token | The token from Step 1 |

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

The workflows will automatically trigger!

## 📊 Workflow Triggers

### CI Workflow

- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main`
- ✅ Manual trigger via workflow_dispatch

### Docker Build & Push Workflow

- ✅ Push to `main` or `develop` branches
- ✅ Git tags matching `v*.*.*` (e.g., `v1.0.0`)
- ✅ Manual trigger via workflow_dispatch
- ⚠️ Pull requests (build only, no push)

## 🏷️ Docker Image Tagging Strategy

The pipeline automatically creates multiple tags for each build:

| Trigger           | Generated Tags                 | Example                          |
| ----------------- | ------------------------------ | -------------------------------- |
| Push to `main`    | `latest`, `main`, `main-<sha>` | `latest`, `main`, `main-abc1234` |
| Push to `develop` | `develop`, `develop-<sha>`     | `develop`, `develop-def5678`     |
| Tag `v1.2.3`      | `1.2.3`, `1.2`, `1`, `v1.2.3`  | `1.2.3`, `1.2`, `1`              |
| Pull request #42  | `pr-42`                        | `pr-42`                          |

## 📥 Using the Docker Images

After the pipeline runs successfully, pull and use your images:

### Pull latest version

```bash
docker pull <your-dockerhub-username>/sql-agent:latest
```

### Pull specific version

```bash
docker pull <your-dockerhub-username>/sql-agent:1.2.3
```

### Run the container

```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e MISTRAL_API_KEY="your_api_key" \
  <your-dockerhub-username>/sql-agent:latest
```

### Update docker-compose.yml to use your image

```yaml
services:
  app:
    image: <your-dockerhub-username>/sql-agent:latest
    # Remove the build section
    # build:
    #   context: .
    #   dockerfile: Dockerfile
```

## 🔄 Release Process

### Create a new release

1. **Tag a version:**

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **The pipeline automatically:**
   - Builds the Docker image
   - Tags it with `1.0.0`, `1.0`, `1`, and `v1.0.0`
   - Pushes to Docker Hub
   - Updates the repository description

### Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.x.x): Breaking changes
- **MINOR** version (x.1.x): New features (backward compatible)
- **PATCH** version (x.x.1): Bug fixes

## 🔍 Monitoring Workflows

### View workflow runs

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Select a workflow to see its runs

### Check Docker Hub

1. Go to [Docker Hub](https://hub.docker.com/)
2. Navigate to your repository
3. Check the **Tags** tab for pushed images

## 🐛 Troubleshooting

### Build fails with "invalid credentials"

- Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are correct
- Ensure the access token has **Read & Write** permissions
- Try regenerating the token on Docker Hub

### Build fails during TypeScript check

- Run `npx tsc --noEmit` locally to identify issues
- Fix type errors and commit

### Build fails during Docker build

- Test locally: `docker build -t test .`
- Check Dockerfile syntax
- Ensure all required files exist

### Image not appearing on Docker Hub

- Check if the workflow completed successfully
- Verify the push step wasn't skipped (happens on PRs)
- Check Docker Hub rate limits

## 🎯 Advanced Configuration

### Build for specific platforms only

Edit `.github/workflows/docker-build-push.yml`:

```yaml
platforms: linux/amd64 # Remove arm64 if not needed
```

### Add environment-specific builds

Create separate workflows for staging/production:

```yaml
on:
  push:
    branches:
      - staging
env:
  IMAGE_NAME: ${{ secrets.DOCKERHUB_USERNAME }}/sql-agent-staging
```

### Add automated testing

Extend the CI workflow to include:

- Unit tests
- Integration tests
- E2E tests
- Security scanning

### Enable Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Semantic Versioning](https://semver.org/)

## ✅ Checklist

- [ ] Docker Hub account created
- [ ] Access token generated
- [ ] GitHub secrets configured (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`)
- [ ] Workflows committed and pushed
- [ ] First workflow run successful
- [ ] Images visible on Docker Hub
- [ ] Tested pulling and running the image

---

**Need help?** Check the [Actions tab](../../actions) in your repository for detailed logs.
