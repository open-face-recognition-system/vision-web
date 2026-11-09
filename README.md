# Vision Web

Admin and teacher panel of Vision, a classroom attendance system based on face recognition. Admins manage semesters, subjects, classes, teachers, students and enrollments. Teachers see their classes and subjects, train the recognition model of a subject and review or correct attendance lists. Students use the mobile app instead.

React 19, MUI 9, React Router 8 and Vite. The app talks to [vision-server](https://github.com/open-face-recognition-system/vision-server) through `/api`, which Vite proxies in development and nginx proxies in the image.

## Running locally

With the API running on `localhost:3333` (see vision-server):

```bash
npm install
npm run dev        # http://localhost:5173, set API_URL to proxy elsewhere
npm test           # vitest
npm run build      # typecheck and production build
```

To run the whole stack in Docker, clone this repository next to vision-server and run `docker compose up -d --build` there. The web app is served on `http://localhost:8080`.

## Release

Every push to `master` publishes `<DOCKERHUB_USERNAME>/vision-web:latest` and `:sha-<short>` to Docker Hub after tests pass. Tagging `vX.Y.Z` also publishes `:X.Y.Z` and `:X.Y`. The workflow needs a `DOCKERHUB_USERNAME` variable and a `DOCKERHUB_TOKEN` secret in the repository settings.

## Running the published image

The image serves the app with nginx on port `80` and proxies `/api/` to `API_URL` (default `http://server:3333`, the service name used by vision-server's compose file).

```bash
docker run -d --name vision-web --restart unless-stopped \
  -e API_URL=http://<api-host>:3333 -p 8080:80 \
  <DOCKERHUB_USERNAME>/vision-web:latest
```

Set the API's `APP_URL` to the public web URL plus `/api` (for example `https://vision.example.com/api`) so photo links resolve through the same origin.
