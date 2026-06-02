# Strona Główna (Home Page)

Dokument opisuje główny ekran startowy aplikacji (reprezentowany przez `HomeComponent`). Jest to centralny punkt nawigacyjny, z którego użytkownik rozpoczyna interakcję z systemem.

---

## 1. Układ Interfejsu (UI Layout)

Ekran startowy cechuje się minimalistyczną, wycentrowaną kompozycją, która skupia uwagę użytkownika na identyfikacji wizualnej oraz kluczowych akcjach:

1. **Logo Quizu:** Umieszczone w samym centrum ekranu (centralny punkt fokalny).
2. **Nazwa Quizu:** Znajduje się bezpośrednio pod logotypem, jednoznacznie identyfikując projekt.
3. **Panel Akcji:** Dynamiczny blok trzech pionowo zorientowanych przycisków menu głównego, których widoczność zależy od stanu sesji użytkownika.

---

## 2. Logika Stanu Autoryzacji (Dynamiczny Widok)

Interfejs strony głównej reaguje na stan zalogowania użytkownika (status administratora). System stosuje mechanizm renderowania warunkowego dla drugiego przycisku w panelu akcji:

* **Status: Niezalogowany (Gość):** System wyświetla przycisk **ZALOGUJ**.
* **Status: Zalogowany (Administrator):** System ukrywa przycisk "ZALOGUJ", a w jego miejsce wstrzykuje przycisk **KONFIGURUJ**.

---

## 3. Funkcje Biznesowe i Ścieżki Nawigacji (Buttons Flow)

Każdy z przycisków na stronie głównej odpowiada za uruchomienie dedykowanego procesu biznesowego:

### 3.1. Przycisk "NOWA GRA"
* **Cel biznesowy:** Inicjalizacja nowej sesji rozgrywki.
* **Skutek akcji:** Przekierowuje użytkownika do fazy przygotowawczej (`/pregame`).
* **Opis procesu:** Uruchamia ustrukturyzowany proces, w którym prowadzący lub gracze będą mogli skonfigurować drużyny (`choose-team`), wybrać koszyk kategorii (`choose-category`) i wystartować właściwy mecz.

### 3.2. Przycisk "ZALOGUJ" (Widoczny dla gości)
* **Cel biznesowy:** Autoryzacja użytkownika i uzyskanie uprawnień administracyjnych.
* **Skutek akcji:** Przekierowuje do ekranu logowania lub otwiera formularz uwierzytelniający.
* **Opis procesu:** Pozwala na zweryfikowanie tożsamości prowadzącego. Jest to krok niezbędny do zabezpieczenia sekcji zarządzania pytaniami przed nieautoryzowanym dostępem uczestników gry.

### 3.3. Przycisk "KONFIGURUJ" (Widoczny dla zalogowanych)
* **Cel biznesowy:** Przejście do zarządzania zawartością i bazą danych aplikacji (CMS).
* **Skutek akcji:** Przekierowuje użytkownika do panelu konfiguracyjnego (`/configure`).
* **Opis procesu:** Daje zalogowanemu administratorowi bezpośredni dostęp do narzędzi kreatora, umożliwiając dodawanie nowych kategorii, pytań, a także zarządzanie bazami multimedialnymi (zdjęciami klubów, budynków itp.).

### 3.4. Przycisk "WYNIKI"
* **Cel biznesowy:** Prezentacja historycznych osiągnięć i statystyk.
* **Skutek akcji:** Przekierowuje do modułu tabeli wszech czasów lub podsumowań poprzednich gier.
* **Opis procesu:** Umożliwia wgląd w zapisane archiwalne wyniki rozgrywek, co buduje zaangażowanie społeczności wokół teleturnieju i pozwala na weryfikację najlepszych zespołów.
