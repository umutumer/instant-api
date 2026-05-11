# instant-api

Yapay zeka kullanarak, ön uç geliştiricilerin projelerinde kullanabilecekleri Supabase'e bağlı API uç noktalarını anında oluşturan bir proje.

## Özet
- Next.js (App Router)
- Supabase entegrasyonu (tarayıcı ve server side)
- Hazır kimlik doğrulama sayfaları ve API route'ları

## Hızlı Başlangıç

Gereksinimler: `node` ve tercih ettiğiniz paket yöneticisi (`npm`, `pnpm`, `yarn`).

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Ortam değişkenlerini ayarlayın (örnek):

- OPENAI_API_KEY=""
- NEXT_PUBLIC_SUPABASE_URL=""
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
- NEXT_PUBLIC_BASE_URL=http://localhost:3000

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresini açın.

## Proje Yapısı (önemli dosyalar)
- `app/` — Uygulama sayfaları ve API route'ları.
	- [app/api/generate/route.ts](app/api/generate/route.ts) — üretim/işlem API örneği
	- [app/api/v1/[slug]/route.ts](app/api/v1/[slug]/route.ts) — dinamik API route örneği
	- [app/login/page.tsx](app/login/page.tsx) — giriş sayfası
	- [app/register/page.tsx](app/register/page.tsx) — kayıt sayfası
	- [app/my-apis/page.tsx](app/my-apis/page.tsx) — kullanıcıya özel API listesi
- `lib/` — Supabase helperları ve yardımcı fonksiyonlar
- `components/` — UI bileşenleri (Header, PromptForm, ResultCard vb.)
- `public/` ve `system prompt/` — statik varlıklar ve sistem prompt dosyası

## Kimlik Doğrulama ve Supabase
Projede Supabase kullanılıyor. Tarayıcı ve sunucu için ayrı yapılandırma dosyaları: [lib/supabase-browser.ts](lib/supabase-browser.ts) ve [lib/supabase-server.ts](lib/supabase-server.ts).

Ortam değişkenlerini doğru şekilde ayarladıktan sonra uygulama Supabase ile oturum açma/kayıt akışlarını kullanır.

## Çalışma ve Üretim
- Geliştirme: `npm run dev`
- Üretim için build: `npm run build`
- Üretimi başlat: `npm start` veya platforma göre (`vercel`, `netlify` vb.) dağıtım
