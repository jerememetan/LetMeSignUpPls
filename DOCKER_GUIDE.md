# Docker & Docker Compose Guide for LetMeSignUpPls

## Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

## 1. Build and Run the Vue App in Docker

### Build the Docker image:
```sh
cd LetMeSignUpPls
# Build the image (from the folder with the Dockerfile)
docker build -t letmesignuppls-frontend .
```

### Run the container:
```sh
docker run -p 8080:80 letmesignuppls-frontend
```
- Visit [http://localhost:8080](http://localhost:8080) in your browser.

## 2. Using Docker Compose (Recommended)

From the project root (where `docker-compose.yml` is):
```sh
docker-compose up --build
```
- This will build and start the frontend service.
- Stop with `Ctrl+C` and remove containers with `docker-compose down`.

## 3. Adding a Backend Microservice (Optional)
- Add a `backend/` folder with a simple Node.js/Express app and its own Dockerfile.
- Uncomment and configure the `backend` section in `docker-compose.yml`.

## 4. Development Tips
- For hot-reloading, use `npm run dev` locally instead of Docker.
- Rebuild the image after code changes for production (`docker-compose up --build`).

---

For more details, see the official docs:
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
