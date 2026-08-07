# Alight Motion Activation — Vercel

Web frontend untuk alur verifikasi Alight Motion melalui API ZNN.

Token API tidak pernah dikirim ke browser. Token dibaca oleh Vercel Serverless Function dari Environment Variables lalu diteruskan ke API melalui header:

```http
Authorization: Bearer <AM_TOKEN>
```

## Environment Variables

Tambahkan di **Vercel → Project → Settings → Environment Variables**:

```env
AM_TOKEN=am_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AM_API_BASE=https://api.znn.my.id/alightmotion
```

Isi `AM_TOKEN` cukup token mentah yang diawali `am_`. Jangan tambahkan `Bearer` sendiri.

Set untuk **Production** dan **Preview** sesuai kebutuhan, lalu lakukan **Redeploy** setelah mengubah Environment Variables.

`AM_TOKEN_PARAM` tidak dipakai lagi dan boleh dihapus dari Vercel.

## Endpoint internal web

- `POST /api/send`
- `POST /api/verify`

Serverless function meneruskan request ke:

- `GET https://api.znn.my.id/alightmotion/send?...`
- `GET https://api.znn.my.id/alightmotion/verify?...`

Token tidak dimasukkan ke query URL.
