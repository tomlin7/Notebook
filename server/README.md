## Server

This is the server side of Notebook.

### Install dependencies

```
pip install -r requirements.txt
```

### Run server

```
fastapi run main.py
```

## Render Configuration

```
pip install -r requirements.txt; python vits.py
fastapi run main.py
```

### Docker

```
docker run -e PORT=8080 billyeatcookies/notebook:latest
```

#### Development with Docker

```
docker compose up --build
docker compose build
docker compose push
```
