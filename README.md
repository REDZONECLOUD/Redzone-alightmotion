# Alight Motion Activation — Vercel

Web frontend untuk aktivasi Alight Motion melalui API ZNN.

## Status fitur web

- Aktivasi / Send: aktif
- Verify: aktif
- Bulk: tetap dinonaktifkan di web dan membuka popup menuju bot WhatsApp
- Baca Email: mengikuti UI project saat ini

Bulk sengaja tidak dibuka kembali oleh patch ini.

## Environment Variables

Tambahkan di **Vercel → Project → Settings → Environment Variables**:

```env
ZNN_ACCESS_TOKEN=znn_vcl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AM_TOKEN=am_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AM_API_BASE=https://api.znn.my.id/alightmotion
TEMPMAIL_API_BASE=https://api.znn.my.id
```

`ZNN_ACCESS_TOKEN` diambil dari **admin.znn.my.id → IP Whitelist → Akses Vercel**.

Setidaknya aktifkan environment variables untuk **Production**. Jika Preview juga dipakai, aktifkan untuk Preview.

Setelah menambah atau mengganti environment variable, lakukan **Redeploy**.

## Alur request

Browser tidak menerima token.

```text
Browser
  -> Vercel Serverless Function
  -> X-ZNN-Access: ZNN_ACCESS_TOKEN
  -> X-AM-Token: AM_TOKEN
  -> api.znn.my.id
```

Untuk endpoint non-AM seperti Temp Mail, Vercel hanya mengirim `X-ZNN-Access`.

## Endpoint internal web

- `POST /api/send`
- `POST /api/verify`
- `POST /api/inbox`
- `POST /api/bulk` masih ada di source lama untuk kompatibilitas, tetapi UI Bulk tetap dikunci oleh popup bot WhatsApp.

Jangan taruh `ZNN_ACCESS_TOKEN` atau `AM_TOKEN` di frontend, `index.html`, atau `app.js`.
