---
type: decision
tags: [ui, design, mobile]
source: [[sources/legacy_docs]]
date: 2026-04-27
status: stable
---

# Decision: iOS Öncelikli Test Süreci

## Konteks
Kullanıcıların (Eray ailesi) uygulamayı %90 oranında iPhone üzerinden kullanması nedeniyle, web odaklı geliştirmeler mobilde deneyim sorunlarına yol açıyordu.

## Karar
Her yeni özellik ve UI değişikliği, öncelikle **iOS (iPhone)** platformunda kusursuz çalışacak şekilde test edilmeden yayına alınamaz.

## Uygulama
- CSS Flex/Grid yapıları Safari mobil uyumluluğu gözetilerek yazılır.
- "Add to Home Screen" (PWA) özellikleri desteklenir.
- Buton boyutları ve tıklama alanları parmakla kullanıma (touch-friendly) uygun optimize edilir.
