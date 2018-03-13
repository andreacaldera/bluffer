# Setup
```
npm i
```

# Running locally

```docker run -d -p 27017:27017 mongo```

##

## Development
```BLUFFER_CONFIG=<YOUR_CONFIG> npm run dev```

```npm run watch```

## Production
```npm run build```

```BLUFFER_CONFIG=<YOUR_CONFIG> npm start```

## Docker

```docker build . -t local/bluffer```

```docker run -p 7000-7010:7000-7010 local/bluffer```

### Troubleshooting

```docker exec -it IMAGE_ID bash```

```less /var/log/supervisor/bluffer.err.log```

```less /var/log/supervisor/bluffer.out.log```


# CI
