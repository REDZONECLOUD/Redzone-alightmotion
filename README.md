# Alight Motion Activation — Vercel

Frontend sederhana untuk alur verifikasi Alight Motion melalui API ZNN.

Token API tidak pernah dikirim ke browser. Token hanya dibaca oleh Vercel Serverless Function dari Environment Variables.

## Deploy ke Vercel

1. Upload folder ini ke GitHub.
2. Import repository di Vercel.
3. Buka **Project → Settings → Environment Variables**.
4. Tambahkan:

```env
AM_TOKEN=token_kamu
AM_API_BASE=https://api.znn.my.id/alightmotion
AM_TOKEN_PARAM=token
```

5. Aktifkan variabel untuk Production, Preview, dan Development sesuai kebutuhan.
6. Redeploy.

Jangan commit `.env` atau token asli ke GitHub.

## Endpoint internal web

- `POST /api/send` body `{ "email": "user@example.com" }`
- `POST /api/verify` body `{ "email": "user@example.com", "link": "https://..." }`

Kedua endpoint serverless akan meneruskan request ke:

- `/alightmotion/send`
- `/alightmotion/verify`

Token otomatis ditambahkan di sisi server sebagai query parameter yang namanya dikontrol oleh `AM_TOKEN_PARAM`.

## Local

Dengan Vercel CLI:

```bash
vercel dev
```

Buat `.env.local`:

```env
AM_TOKEN=token_kamu
AM_API_BASE=https://api.znn.my.id/alightmotion
AM_TOKEN_PARAM=token
```
