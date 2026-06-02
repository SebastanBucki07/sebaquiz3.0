# Rozdział 5: Panel Administracyjny i Zarządzanie Treścią (CMS Configuration)

Dokument opisuje centralny moduł zarządzania zawartością aplikacji (reprezentowany przez grupę komponentów w ścieżce `/configure`). Panel ten pełni funkcję systemu CMS (Content Management System), umożliwiając dynamiczne rozbudowywanie bazy wiedzy gry bez konieczności modyfikacji kodu źródłowego aplikacji.

---

## 1. Warunki Wstępne i Ścieżka Dostępu (Access Flow)

Dostęp do tego modułu jest ściśle restrykcyjny i uwarunkowany stanem autoryzacji użytkownika.

### 1.1. Warunki Wstępne (Preconditions)
* **Status użytkownika:** Wymagany status Administratora / Prowadzącego.
* **Stan sesji:** Aktywna, zweryfikowana sesja w usłudze Supabase Service.

### 1.2. Ścieżka wejścia (User Flow)
1. Użytkownik uwierzytelnia się za pomocą adresu Email oraz Hasła na ekranie logowania.
2. Po pomyślnej weryfikacji przez Supabase, system zmienia flagę widoku na Stronie Głównej.
3. Użytkownik klika nowo odblokowany przycisk **"KONFIGURUJ"** w menu głównym.
4. System wykonuje bezpieczne przekierowanie na adres URL: `/configure`.

### 1.3. Reguła Bezpieczeństwa (Routing Guard Logic)
* *Reguła biznesowa:* Bezpośrednia próba wpisania adresu `/configure` w pasek przeglądarki przez niezalogowanego użytkownika musi zostać zablokowana przez system, uniemożliwiając wgląd w formularze edycyjne i bazę pytań.

---

## 2. Układ Interfejsu i Nawigacja CMS (Layout Architecture)

Komponent główny panelu (`ConfigureWindowComponent`) wdraża dwudzielną strukturę interfejsu (Wrapper-Content), która pozwala administratorowi na płynną zmianę kontekstu pracy bez przeładowywania całej strony.

### 2.1. Pasek Nawigacyjny (`navigation-bar`)
Górny lub boczny panel sterowania wyposażony w dedykowane przyciski typu `mat-flat-button`. Każda akcja posiada unikalny identyfikator wizualny (ikonę):

* **Dodaj kategorię (`routerLink="add-category"`):** Oznaczony ikoną `category`. Odpowiada za przejście do zarządzania tematami gry.
* **Dodaj klub (`routerLink="add-club"`):** Oznaczony ikoną tarczy (`shield`). Prowadzi do zarządzania bazą drużyn piłkarskich.
* **Dodaj budynek (`routerLink="add-building"`):** Oznaczony ikoną panoramy miejskiej (`location_city`). Służy do konfiguracji obiektów architektonicznych i geograficznych.
* **Dodaj pytanie (`routerLink="add-question"`):** Oznaczony ikoną plusa (`add_circle`). Centralny punkt dodawania treści quizowych.

### 2.2. Logika Wizualna Aktywnego Stanu (`routerLinkActive`)
* *Reguła biznesowa:* System automatycznie wykrywa, w której sekcji konfiguracji znajduje się użytkownik i nadaje odpowiedniemu przyciskowi klasę `active-btn`. Dzięki temu administrator zawsze ma jednoznaczną informację zwrotną, jaki formularz jest obecnie edytowany.

### 2.3. Dynamiczny Obszar Treści (`content-area`)
* Kontener wyposażony w znacznik `<router-outlet>`. To tutaj system wstrzykuje i renderuje wybrany formularz administracyjny w zależności od klikniętego przycisku w nawigacji.

---

## 3. Spis Podsekcji Konfiguracyjnych (Szczegółowe Formularze)

Szczegółowe zasady działania, pola formularzy oraz reguły biznesowe zapisu danych dla poszczególnych sekcji CMS zostały opisane w dedykowanych poddokumentach:

* [Kreator Struktur Tematycznych (Dodaj kategorię)](konfiguracja/formularz-kategorii.md)
* [Repozytorium Multimedialne (Kluby i Budynki)](konfiguracja/formularze-multimediów.md)
* [Kreator Treści Quizowych (Dodaj pytanie)](konfiguracja/formularz-pytan.md)
