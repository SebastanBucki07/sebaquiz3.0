# Rozdział 3: Ekran Logowania i Autoryzacji (Authentication Page)

Dokument opisuje proces zarządzania dostępem do uprawnień administracyjnych aplikacji (reprezentowany przez `AuthComponent`). Moduł ten stanowi kluczową barierę bezpieczeństwa, zabezpieczając system zarządzania bazą danych i konfiguracją quizów (`sebaquiz3.0`) przed nieautoryzowaną ingerencją uczestników zabawy.

---

## 1. Architektura Interfejsu i Logika Warunkowa (UI Rendering)

Komponent autoryzacji dynamicznie adaptuje swój wygląd w zależności od bieżącego stanu sesji użytkownika (`*ngIf="!user"` oraz `*ngIf="user"`). Interfejs obsługuje dwa kluczowe stany biznesowe:

### 1.1. Stan A: Niezalogowany (Karta Logowania)
Gdy w systemie brak aktywnej sesji administratora, prezentowana jest zamknięta karta logowania (`.auth-card`) zawierająca:
* **Nagłówek sekcji:** „Panel Logowania” z komunikatem pomocniczym: *„Zaloguj się, aby zarządzać bazą danych”*.
* **Pole wprowadzania danych (Email):** Kontrolka tekstowa z walidacją formatu poczty elektronicznej (placeholder: `twoj@email.pl`).
* **Pole wprowadzania danych (Hasło):** Kontrolka z zamaskowanym wprowadzaniem znaków (`type="password"`).
* **Przycisk akcji:** Podświetlony przycisk „ZALOGUJ SIĘ” uruchamiający procedurę weryfikacji.

### 1.2. Stan B: Zalogowany (Panel Informacyjny Profilu)
W przypadku wykrycia aktywnej sesji, formularz zostaje całkowicie ukryty, a w jego miejsce system wstrzykuje panel podglądu użytkownika (`.user-info`):
* **Identyfikator wizualny:** Ikona profilu (`account_circle`).
* **Informacja o sesji:** Komunikat tekstowy jednoznacznie wskazujący zalogowanego administratora: *„Zalogowany jako: [Adres_Email]”*.
* **Przycisk akcji "WYLOGUJ":** Ostrzegawczy przycisk (kolor typu `warn`) przerywający sesję.

---

## 2. Integracja z Supabase i Reguły Biznesowe

Proces uwierzytelniania opiera się na integracji z zewnętrznym dostawcą usług tożsamości **Supabase (BaaS)** za pośrednictwem dedykowanego serwisu `SupabaseService`.

### 2.1. Automatyczna Weryfikacja Stanu (Inicjalizacja)
Podczas inicjalizacji komponentu (`ngOnInit`), system asynchronicznie odpytuje serwis Supabase (`getCurrentUser()`) w celu sprawdzenia, czy token sesji użytkownika jest nadal ważny. Dzięki temu, jeśli administrator nie wylogował się ręcznie, aplikacja automatycznie podtrzymuje stan zalogowania przy ponownym otwarciu podstrony.

### 2.2. Walidacja Pól Formularza (Frontend Guards)
Przed wysłaniem zapytania do dostawcy tożsamości, system dokonuje wstępnej weryfikacji kompletności danych.
* **Reguła biznesowa:** Jeśli pole Email lub Hasło pozostanie puste, proces logowania zostaje przerwany.
* **Komunikacja UI:** System wyświetla systemowe powiadomienie (SnackBar) z tekstem: *„Wypełnij wszystkie pola!”* o czasie trwania 3 sekund.

### 2.3. Autentykacja i Obsługa Błędów (Sign-In Process)
Po pomyślnej wstępnej walidacji, wywoływana jest metoda `supabase.signIn(loginEmail, loginPass)`:
* **Przypadek błędu (Error handling):** Jeśli Supabase zwróci błąd (np. niepoprawne hasło, brak użytkownika w bazie), system wyświetla komunikat ostrzegawczy z dokładnym powodem (`Błąd logowania: [Treść błędu]`) na dole ekranu przez 3 sekundy. Stan sesji pozostaje niezmieniony.
* **Przypadek sukcesu:** Jeśli dane są poprawne, obiekt użytkownika zostaje przypisany do stanu lokalnego (`user = data.user`), wyzwalany jest komunikat sukcesu *„Zalogowano pomyślnie!”*, a aplikacja odblokowuje dynamiczne menu główne.

---

## 3. Proces Wylogowania (Sign-Out Flow)

Wywołanie funkcji `logout()` przez administratora aktywuje procedurę bezpiecznego zamknięcia sesji:
1. **Unieważnienie tokenu:** System wysyła żądanie do Supabase (`signOut()`), unieważniając token autoryzacyjny po stronie serwera.
2. **Czyszczenie stanu lokalnego:** Zmienna `user` zostaje zresetowana do wartości `null`.
3. **Komunikacja UI:** Wyświetlany jest komunikat informacyjny *„Wylogowano”*.
4. **Skutek biznesowy:** Interfejs automatycznie powraca do wyświetlania formularza logowania (Stan A), a Strona Główna przywraca przycisk "ZALOGUJ" zamiast opcji konfiguracji.
