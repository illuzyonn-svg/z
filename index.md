# 🛡️ Güvenli Giriş Paneli

Bu sayfa üzerinden bana hızlıca mesaj gönderebilirsiniz.

<div style="background: #f4f4f4; padding: 20px; border-radius: 15px; border: 1px solid #ddd; max-width: 400px;">
    <h3 style="margin-top: 0;">Giriş Yap / Mesaj Gönder</h3>
    <input type="text" id="name" placeholder="Adınız" style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc;"><br>
    <textarea id="message" placeholder="Mesajınız..." style="width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc; height: 100px;"></textarea><br>
    <button onclick="sendToTelegram()" style="width: 100%; background: #0088cc; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        Telegram ile Gönder
    </button>
    <p id="status" style="margin-top: 10px; font-size: 14px; color: green;"></p>
</div>

<script>
function sendToTelegram() {
    const token = "token"; // BotFather'dan aldığın token
    const chat_id = "id"; // userinfobot'tan aldığın ID
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    const status = document.getElementById('status');

    const text = `🚀 **Yeni Mesaj!**\n\n👤 Gönderen: ${name}\n📝 Mesaj: ${message}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}&parse_mode=Markdown`;

    status.innerText = "Gönderiliyor...";

    fetch(url)
        .then(response => {
            if (response.ok) {
                status.style.color = "green";
                status.innerText = "✅ Mesaj başarıyla Telegram'a iletildi!";
                document.getElementById('name').value = "";
                document.getElementById('message').value = "";
            } else {
                status.style.color = "red";
                status.innerText = "❌ Hata: Bilgileri kontrol et.";
            }
        })
        .catch(err => {
            status.style.color = "red";
            status.innerText = "❌ Bağlantı hatası.";
        });
}
</script>

---

### 📋 Kullanım Kılavuzu
1. Yukarıdaki formda bilgileri doldurun.
2. "Gönder" butonuna basın.
3. Mesaj anında Telegram hesabıma düşecektir.

