# Formularze Repozytorium Multimedialnego (Kluby i Budynki)

Dokument opisuje wymagania biznesowe, reguły przetwarzania plików oraz logikę transakcyjną dla modułów dodawania zasobów wizualnych (reprezentowanych przez `ClubPhotoFormComponent` oraz `BuildingPhotoFormComponent`). Moduły te zasilają bazy danych komponentów tematycznych i geograficznych (np. quiz piłkarski `footballGame` oraz moduły rozpoznawania budynków).

---

## 1. Architektura Interfejsu i Obsługa Plików (UI & Upload Zone)

Oba formularze wdrażają spójny, intuicyjny interfejs użytkownika, dzieląc przestrzeń na interaktywną strefę plikową oraz strefę danych tekstowych.

### 1.1. Dynamiczna Strefa Podglądu (`image-preview-zone`)
* **Ukryty Selektor:** Tradycyjne elementy `<input type="file">` są programowo ukryte przed użytkownikiem. Wywołanie systemowego okna wyboru plików następuje po kliknięciu w obszar całego kontenera podglądu (`fileInput.click()` lub `fileIn.click()`).
* **Logika Renderowania Stanu Podglądu:**
  * *Brak pliku (`!previewUrl`):* Wyświetla stan zastępczy (Placeholder) z ikoną aparatu (`add_a_photo`) oraz etykietą tekstową (*"Wybierz grafikę"* dla klubów / *"FOTO"* dla budynków).
  * *Plik załadowany (`previewUrl`):* System ukrywa placeholder i renderuje fizyczny obraz `<img [src]="previewUrl" />`.

### 1.2. Lokalna Konwersja Podglądu (`FileReader`)
* Przetwarzanie wybranego pliku w obu komponentach odbywa się asynchronicznie za pomocą obiektu `FileReader`. Plik jest transformowany do formatu ciągu tekstowego Base64 (`readAsDataURL(file)`), co umożliwia natychmiastową weryfikację poprawności grafiki przez administratora przed fizycznym obciążeniem łącza internetowego.

---

## 2. Specyfikacja Encji i Reguły Walidacji (Data Guard & Validation)

Zapis do bazy danych opiera się na unikalnym powiązaniu pliku binarnego z atrybutem tekstowym identyfikującym obiekt w bazie danych.

### 2.1. Charakterystyka Struktur Danych

| Komponent | Model Tekstowy (`[(ngModel)]`) | Repozytorium Supabase Storage | Metoda Relacyjna DB |
| :--- | :--- | :--- | :--- |
| **Herby Klubów** | `newClubName` (np. Real Madrid CF) | `supabase.uploadCrest()` | `supabase.addNewClub()` |
| **Obiekty i Budynki** | `name` (np. Krzywa Wieża w Pizie) | `supabase.uploadBuilding()` | `supabase.addNewBuilding()` |

### 2.2. Walidacja Blokady Przycisków (Frontend Guards)
Przycisk zapisu w obu formularzach zostaje automatycznie wyłączony (`disabled`), jeśli nie zostanie spełniony choćby jeden z poniższych warunków biznesowych:
1. Pole nazwy (klubu lub obiektu) jest puste.
2. Użytkownik nie wybrał żadnego pliku graficznego z dysku.
3. Trwa aktualnie asynchroniczny proces wysyłania danych do chmury (`isUploading = true`).

### 2.3. Wskaźniki Stanu Oczekiwania (UX Progress)
* **Kluby:** Wdrożono dolny pasek postępu wizualnego `<mat-progress-bar mode="indeterminate">`.
* **Budynki:** Stan ładowania reprezentowany jest bezpośrednio na przycisku poprzez zmianę etykiety na *"PRZESYŁANIE..."*.

---

## 3. Złożony Potok Transakcyjny i Obsługa Błędów (Submission Flow)

Proces zapisu danych w obu przypadkach jest operacją dwuetapową, wymagającą zachowania integralności między plikiem w Storage a rekordem w bazie danych:

```text
[ Kliknięcie ZAPISZ ]
          │
          ▼
[ Aktywacja blokad: isUploading = true ]
          │
          ▼
[ Krok 1: Supabase Storage ] ➔ Wysyłanie pliku binarnego do dedykowanego Bucket-u
          │
          ▼ Pobranie wygenerowanej ścieżki: storagePath
          │
[ Krok 2: Supabase Database ] ➔ Zapis rekordu relacyjnego (Nazwa + Ścieżka pliku)
          │
          ├─────────────────────────────────────────────┐
          ▼ (Sukces)                                    ▼ (Błąd / Naruszenie Zasad)
[ Komunikat: Dodano pomyślnie! ]               [ Przechwycenie błędu: err.message ]
          │                                             │
          ▼                                             ▼
[ Wyczyszczenie stanu: reset() ]               [ Komunikat SnackBar: Wyświetlany przez 5s ]
          │                                             │
          ▼                                             ▼
[ Zwolnienie blokad: isUploading = false ]     [ Zwolnienie blokad: isUploading = false ]
```
