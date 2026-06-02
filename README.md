# Gillette Leaderboard

Etkinlik skor tablosu. iPad'den isim/soyisim/skor girilir, 43" ekranda ilk 5 canlı güncellenir. iPad'deki müzik butonu büyük ekrandan ses çalar.

## Ekranlar
- **Büyük ekran (43"):** `/` veya `/mainPage.html` — skor tablosu + ses çıkışı.
  İlk açılışta bir kez ekrana dokunulması gerekir (tarayıcı ses kilidini açmak için).
- **iPad (giriş):** `/dataScreen.html` — form + müzik butonu.
- **Sıfırlama:** `/reset` (ADMIN_KEY tanımlıysa `/reset?key=...`).

## Çalıştırma
```bash
npm install
npm start            # PORT=3000 (varsayılan)
PORT=8080 npm start  # farklı port
```

## Public sunucuya alma
Socket.io kalıcı WebSocket bağlantısı kullandığı için **Vercel/Netlify gibi serverless platformlar uygun değildir.** Render, Railway, Fly.io veya bir VPS kullanın.

Örnek (Render/Railway):
- Start command: `npm start`
- Platform `PORT` değişkenini otomatik verir; kod onu okur.
- Ortam değişkeni olarak `ADMIN_KEY` ekleyin (reset'i korur).

VPS örneği:
```bash
npm install
ADMIN_KEY=gizliKey PORT=80 node server.js   # kalıcı için pm2 önerilir
```

### Laravel Forge ile (ÖNEMLİ)
Bu bir Node/Socket.io sunucusudur — **"static html" site tipi çalıştırmaz.** Forge'da şu iki parça gerekir:

1. **Kod**: Site dizinine (`/home/forge/<site>`) bu repoyu çek, sonra `npm install`.

2. **Daemon** (Forge → Server → Daemons) — node sürecini ayakta tutar:
   - Command: `node server.js`
   - Directory: `/home/forge/<site>`
   - Environment: `PORT=3000`, `ADMIN_KEY=gizliKey`

3. **Nginx** (Forge → Site → Edit Nginx Configuration) — `location /` bloğunu node'a yönlendir ve WebSocket upgrade header'larını ekle (Socket.io için şart):
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
   Sonra nginx'i reload edin. Forge'dan SSL (Let's Encrypt) ekleyin ki `https://` ve `wss://` çalışsın.

Adresler: büyük ekran `https://<site>/`, iPad `https://<site>/dataScreen.html`.

## Not (güvenlik)
Public adreste `dataScreen.html` ve müzik butonu herkese açık olur. Kontrollü etkinlik için iPad URL'sini paylaşmamaya dikkat edin; gerekirse forma basit bir şifre eklenebilir.
# gillette
