# Elementy Wspólne Aplikacji (Layout Frame)

Dokument opisuje komponenty globalne, które stanowią stałą ramę interfejsu użytkownika aplikacji i są widoczne niezależnie od aktualnie ładowanej ścieżki w module rozgrywki lub konfiguracji.

---

## 1. Nagłówek Aplikacji (Header)

Komponent nagłówka jest umieszczony na samej górze ekranu. Pełni funkcję wizerunkową oraz dostarcza globalną akcję ratunkową (reset/powrót).

### 2.1. Elementy Składowe (UI)
* **Logo Quizu:** Element identyfikacji wizualnej projektu (logotyp aplikacji).
* **Przycisk "Nowa Gra":** Globalny punkt kontrolny interfejsu.

### 2.2. Logika Biznesowa i Nawigacja
* Kliknięcie przycisku **"Nowa Gra"** inicjuje natychmiastowe przekierowanie użytkownika do ścieżki głównej aplikacji (`/` - `HomeComponent`).
* *Reguła biznesowa:* Przycisk ten służy jako szybki powrót do ekranu startowego w przypadku chęci przerwania bieżącej konfiguracji lub rozgrywki bez konieczności używania systemowego przycisku "Wstecz" w przeglądarce.

---

## 2. Stopka Aplikacji (Footer)

Komponent informacyjny umieszczony na samym dole ekranu, pełniący funkcję sekcji prawno-autorskiej oraz kontaktu technicznego.

### 2.1. Treść i Nota Prawna
Stopka zawiera statyczny ciąg tekstowy o ścisłej strukturze własnościowej:
> © 2026 Sebastian Buckibucus77@gmail.com

### 2.2. Cel Biznesowy
* **Identyfikacja Autorska:** Jednoznaczne wskazanie twórcy projektu oraz roku bieżącej edycji/wersji aplikacji (2026).
* **Kanał Wsparcia (Support):** Udostępnienie bezpośredniego adresu e-mail do administratora/twórcy w celu zgłaszania ewentualnych błędów działania aplikacji lub kwestii licencyjnych.
