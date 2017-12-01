# Setup
```
npm i
```

# Running locally

## Development
```BLUFFER_CONFIG=<YOUR_CONFIG> npm run dev```

```npm run watch```

## Production
```npm run build```

```
BLUFFER_CONFIG=<YOUR_CONFIG> npm start```

## Docker

```docker build . -t local/bluffer```

```docker run -p 6001:5001 local/bluffer```
