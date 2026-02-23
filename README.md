# REQBOX 🚀

**REQBOX**, mobil cihazlar için özel olarak tasarlanmış, çevrimdışı (offline-first) öncelikli çalışan, hızlı ve kullanıcı dostu bir Postman benzeri HTTP istemcisi (API test) uygulamasıdır.

Bu proje, mobil geliştiricilerin ve test mühendislerinin API isteklerini doğrudan akıllı telefonlarından veya tabletlerinden kolayca oluşturmalarını, test etmelerini ve yönetmelerini sağlar.

---

## 🌟 Öne Çıkan Özellikler

- **HTTP İstek Oluşturucu:** GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD gibi farklı HTTP metodlarıyla kolayca istek oluşturabilme.
- **Detaylı Yanıt Görüntüleyici:** Dönen API yanıtlarını (JSON, XML, HTML, düz metin) okunaklı ve renklendirilmiş bir şekilde inceleyebilme. Yanıt süresi, durum kodu ve boyut bilgilerini görebilme.
- **Yerel İstek Geçmişi (History):** Yapılan her isteği cihazda yerel olarak saklar. Önceki isteklere hızla erişip tekrar çalıştırabilme.
- **Çevrimdışı Çalışma (Offline-First):** Veriler tamamen cihazınızda güvenli bir şekilde saklanır. İnternet bağlantısı olmasa bile geçmiş istekleri inceleyebilirsiniz.
- **cURL İçe Aktarma (Import):** Var olan cURL komutlarınızı doğrudan uygulamaya yapıştırarak anında çalıştırılabilir bir isteğe dönüştürme.
- **Hız ve Gizlilik:** Sunucu bağımlılığı yoktur, verileriniz hiçbir zaman üçüncü bir sunucuya gönderilmez*. (*Sadece test ettiğiniz API sunucusuna gider.)

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

Bu proje, modern mobil geliştirme standartlarına uygun olarak en güncel araçlarla inşa edilmiştir:

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **State Yönetimi:** [Zustand](https://github.com/pmndrs/zustand)
- **Navigasyon:** [React Navigation (Native Stack & Bottom Tabs)](https://reactnavigation.org/)
- **Ağ İstekleri:** [Axios](https://axios-http.com/) / Fetch API
- **Yerel Depolama:** Async Storage
- **İkonlar:** Expo Vector Icons / Lucide

---

## 📂 Proje Dizin Yapısı

```text
reqbox/
├── assets/                 # Resimler, ikonlar, fontlar ve splash screen
├── src/                    # Ana kaynak kod dizini
│   ├── api/                # API ve ağ isteği yapılandırmaları
│   ├── components/         # Tekrar kullanılabilir UI bileşenleri (Butonlar, Inputlar vb.)
│   ├── screens/            # Uygulama ekranları (Request Builder, History vb.)
│   ├── store/              # Zustand global state yönetimi dosyaları
│   ├── theme/              # Renk paletleri, tipografi ve stil sabitleri
│   └── utils/              # Yardımcı fonksiyonlar, formatlayıcılar
├── App.tsx                 # Uygulamanın giriş noktası (Entry Point)
├── app.json                # Expo yapılandırma dosyası
├── package.json            # Bağımlılıklar ve scriptler
└── tsconfig.json           # TypeScript ayarları
```

---

## 🚀 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

### 1. Gereksinimler
- [Node.js](https://nodejs.org/) (tercihen v18 veya v20+)
- [Git](https://git-scm.com/)
- Expo Go uygulaması (iOS veya Android cihazınıza marketten indirebilirsiniz)

### 2. Projeyi Klonlayın ve Bağımlılıkları Yükleyin

```bash
# Proje dizinine girin
cd reqbox

# Bağımlılıkları yükleyin (npm kullanarak)
npm install
```

### 3. Uygulamayı Başlatın

```bash
# Uygulamayı geliştirme modunda başlatın
npm start
# veya
npx expo start
```

Terminalde bir QR kod belirecektir:
- **iOS için:** Cihazınızın kamerasını açın ve QR kodu okutarak Expo Go üzerinden açın.
- **Android için:** Expo Go uygulamasını açın ve "Scan QR Code" seçeneği ile okutun.

Ayrıca `a` tuşuna basarak (kuruluysa) Android Emulator'de, `i` tuşuna basarak iOS Simulator'de başlatabilirsiniz.

---

## 📦 Build ve Yayınlama (EAS)

Uygulamanın çalıştırılabilir (.apk, .aab veya .ipa) çıktılarını almak için Expo EAS (Expo Application Services) kullanılır:

```bash
# EAS CLI yüklü değilse yükleyin
npm install -g eas-cli

# EAS'a giriş yapın
eas login

# Android build almak için (Örn: APK)
eas build -p android --profile preview

# iOS build almak için
eas build -p ios
```

---

## 📜 Lisans

Bu proje **REQBOX** tarafından geliştirilmektedir. Tüm hakları saklıdır.
