# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## 📱 iPhone 15 Pro Simülatörü

Uygulamayı iPhone 15 Pro ekranında (Dynamic Island ve Safe Area kurallarıyla) test etmek için:
1. Uygulamayı başlatın: `npm run dev`
2. Tarayıcıda şu adresi açın: `http://localhost:5173/iphone15.html`

Bu araç, mobil geliştirmeler sırasında tasarımın iPhone standartlarına uygunluğunu denetlemek için kullanılır.

## 💎 Tasarım & Güvenlik İlkeleri

Uygulama genelinde premium kullanıcı deneyimini korumak için:
- **ConfirmModal**: Standart tarayıcı onay pencereleri (`confirm`) yerine her zaman `src/components/ConfirmModal.jsx` kullanılır.
- **Micro-interactions**: Her silme, ekleme ve güncelleme işlemi kullanıcıya görsel geri bildirim (toast, animation) vermelidir.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
