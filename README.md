# N T L A N

<img src="./public/NT.svg" width="64" alt="Norsk Tipping">

## Docker Example

```sh
docker build -t ntlan-seating .
```

```sh
docker run -p 3000:3000 -p 3004:3004 \
  -e API_USERNAME='someUsername' \
  -e API_PASSWORD='somePassword' \
  -e API_URL='localhost:5000' \
  -e NEXT_PUBLIC_WS_URL='https://ws.seating.com' \
  ntlan-seating
```

## Installere packages

```yarn
yarn
```

eller

```npm
npm i
```

## Bygging

```yarn
yarn build
```

eller

```npm
npm run build
```

## Kjøring (krever bygging)

### Både web-view og web-socket server

```yarn
yarn start
```

eller

```npm
npm run start
```

### Kun web-view (front-end)

```yarn
yarn next
```

eller

```npm
npm run next
```

### Kun web-socket (back-end)

```yarn
yarn next
```

eller

```npm
npm run next
```

## Utvikling

### Starte dev server

```yarn
yarn dev
```

eller

```npm
npm run dev
```

### Generere API-typedefinisjoner fra Swagger (krever JRE 11)

```yarn
yarn openapi
```

eller

```npm
npm run openapi
```
