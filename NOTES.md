# Gillette Skor Tablosu — Notlar

Selam 👋 Eline sağlık, projenin iskeleti gayet sağlamdı; akış doğruydu. Aşağıya
canlıya alırken düzelttiğimiz noktaları dostça not düştüm — hepsi tecrübeyle
oturan şeyler, bir dahakine kendin yakalarsın. Kod içine de açıklayıcı yorumlar
ekledim, okuyunca mantığı net görürsün.

## Düzelttiğimiz şeyler

1. **HTML'de `//` yorum değildir.** `dataScreen.html`'de `<script>` etiketinin
   *dışına* `//bu ses kaydını...` yazılmıştı; bu sayfada düz metin olarak
   görünüyordu. `//` sadece JavaScript içinde geçerli. HTML yorumu: `<!-- ... -->`.

2. **Asset yollarının başına `/` koy.** Bir yerde `socket.io/...`, başka yerde
   `/socket.io/...` vardı. Baştaki `/` olmazsa yol bulunduğun sayfaya göre çözülür
   ve alt yola taşınınca kırılır. Hep mutlak yol kullan, tutarlı ol.

3. **Tarayıcı autoplay kuralı.** Ses büyük ekrandan bir olayla çalacaktı ama
   kullanıcı etkileşimi olmadan `audio.play()` engellenir. O yüzden ekrana
   "bir kez dokun" katmanı koyduk; ilk dokunuştan sonra ses serbest kalıyor.

4. **"Ses nerede çalacak?" sorusunu sor.** Ses iPad'de çalıyordu, oysa büyük
   ekrandan istenmişti. Çözüm: iPad sunucuya `playSound` yollar, sunucu da büyük
   ekrana iletir. Çıktı doğru cihazda olmalı.

5. **Sunucuda gelen veriyi doğrula.** `score` alanına metin gelirse sıralama
   bozulurdu (`NaN`). Backend client'a güvenmez; tip/uzunluk kontrolü ekledik.

6. **Her event'in iki tarafı da olmalı.** Client `getTop5` yolluyordu ama
   sunucuda karşılığı yoktu (şans eseri çalışıyordu). Artık handler'ı var.

7. **Port'u sabit yazma.** `3000` hardcode'du; deploy ortamı portu kendi atıyor.
   `process.env.PORT || 3000` yazdık (canlıda 3300'de çalışıyor).

8. **Yıkıcı endpoint'i koru.** `/reset` herkese açıktı. `ADMIN_KEY` ile koruduk:
   `/reset?key=...`.

9. **Hedef cihaza göre tasarla.** Skor tablosu küçük bir karttı; 43" TV için tam
   ekran, büyük font, lacivert zemin olacak şekilde yeniden düzenledik.

10. **Logo zeminle uyumlu olmalı.** Lacivert zeminde lacivert logo kaybolur;
    büyük ekranda beyaz logoya (`white_txt.png`) geçtik.

11. **Gereksinimi birebir uygula.** Ekranda sadece **isim ve puan** isteniyordu;
    soyisim iPad'de giriliyor ama tabloda gösterilmiyor. (Son düzeltme bu oldu.)

## Aklında kalsın
Kod akışı doğruydu; eksikler daha çok **uç durumlar + platform kuralları +
gereksinim disiplini** tarafındaydı. Bunlar zamanla oturur, iyi gidiyorsun. 👍
