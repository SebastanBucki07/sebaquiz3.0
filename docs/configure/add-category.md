# Formularz Kreatora Struktur Tematycznych (Dodaj kategorię)

Dokument opisuje wymagania biznesowe, reguły walidacji oraz zachowanie interfejsu dla formularza tworzenia nowych kategorii pytań (reprezentowanego przez `AddCategoryComponent`). Moduł ten pozwala na dynamiczne rozbudowywanie obszarów rozgrywki w aplikacji `sebaquiz3.0`.

---

## 1. Model Danych i Pola Formularza (Data Structure)

Formularz zbiera i mapuje dane do relacyjnej bazy danych Supabase. Struktura encji kategorii składa się z następujących parametrów biznesowych:

| Nazwa Pola | Typ Kontrolki | Wartość Domyślna | Cel Biznesowy |
| :--- | :--- | :--- | :--- |
| `name` | Tekstowe (Input) | Puste | Unikalna nazwa kategorii wyświetlana graczom (np. "Fizyka Jądrowa"). |
| `type_id` | Lista wyboru (Select) | `null` | Powiązanie relacyjne z typem mechaniki (np. `abcd`, `familiada`, `music`). |
| `base_points` | Liczbowe (Input number) | `10` | Domyślna stawka punktowa przypisywana do pytań w tej kategorii. |
| `color` | Wybór koloru (Color picker) | `#3b82f6` | Kolorystyka przewodnia kafelka i efektu poświaty (Glow) w UI. |
| `icon` | Lista wyboru ikon (Select) | `'quiz'` | Identyfikator wizualny kategorii z biblioteki Google Material Icons. |
| `is_active` | Pole wyboru (Checkbox) | `true` | Flaga widoczności – decyduje, czy kategoria jest dostępna do losowania w pre-game. |

---

## 2. Reguły Walidacji i Obsługa Błędów (Validation Rules)

Przycisk zapisu danych jest zablokowany (`disabled`) dopóki formularz nie spełni wszystkich kryteriów integralności danych. System weryfikuje następujące reguły:

1. **Nazwa Kategorii (`name`):**
  * *Wymagalność:* Pole obowiązkowe. Błąd: `"Nazwa jest wymagana"`.
  * *Długość:* Minimum 3 znaki. Błąd: `"Minimum 3 znaki"`.
  * **[TODO] Unikalność nazwy:** Wprowadzona nazwa kategorii musi być unikalna w skali całej bazy danych. System powinien walidować, czy kategoria o identycznej nazwie już istnieje przed wysłaniem formularza lub obsługiwać błąd naruszenia klucza unikalnego (Unique Constraint) z Supabase.
  * *Powiązane zgłoszenie Git:* [GitHub Issue #135](http://github.com/SebastanBucki07/sebaquiz3.0/issues/135)
2. **Typ Kategorii (`type_id`):**
  * *Wymagalność:* Pole obowiązkowe (musi wskazywać istniejący klucz obcy z bazy). Błąd: `"Wybierz typ z listy"`.
3. **Punkty Bazowe (`base_points`):**
  * *Wymagalność:* Pole obowiązkowe.
  * *Zakres wartości:* Od `1` do `99` (weryfikowane przez `Validators.min` / `max`).
4. **Ikona Material (`icon`):**
  * *Wymagalność:* Pole obowiązkowe. Błąd: `"Wybierz ikonę"`.

---

## 3. Funkcje Interfejsu i Doświadczenie Użytkownika (UX Features)

### 3.1. Asynchroniczne Ładowanie Typów (Supabase Lifecycle)
Podczas inicjalizacji ekranu (`ngOnInit`), aplikacja wysyła zapytanie do Supabase (`getCategoryTypes()`), pobierając aktualne rekordy mechanik gier. Zapobiega to zakodowaniu typów "na sztywno" w kodzie i pozwala na dodawanie nowych formatów quizów w przyszłości.

### 3.2. Podgląd na Żywo (WYSIWYG Live Preview)
Formularz wdrożył asynchroniczny podgląd kafelka gry (`aside.preview-column`) w czasie rzeczywistym:
* Kolor pobrany z selektora (`f['color'].value`) natychmiast aplikuje się jako barwa lewej krawędzi makiety (`border-left-color`) oraz jako tło rozmytej poświaty `.card-glow`.
* Ikona oraz tekst nagłówka zmieniają się dynamicznie w miarę pisania lub wybierania opcji przez administratora.

### 3.3. Bezpieczne Czyszczenie Formularza (Reset State)
* Kliknięcie przycisku **"Wyczyść formularz"** przywraca aplikację do bezpiecznego stanu początkowego gry, zamiast całkowitego wyzerowania pól. Formularz nadpisuje wartości do bezpiecznego stanu standardowego (`#3b82f6`, `10 PKT`, `is_active: true`, ikonę `'quiz'`).

---

## 4. Transakcyjność i Cykl Zapisywania (Form Submission)

Po kliknięciu przycisku **"DODAJ KATEGORIĘ"** uruchamiany jest asynchroniczny potok zapisu danych (`onSubmit()`). Przebieg tego procesu oraz obsługa stanów Loading prezentuje się następująco:

```text
[ Kliknięcie ]
      │
      ▼
[ Inicjalizacja: isLoading = true ] ➔ Podmiana ikony na spinner, blokada przycisku
      │
      ▼
[ Zapytanie Supabase: addCategory() ]
      │
      ├─────────────────────────────────────────┐
      ▼ (Sukces)                                ▼ (Błąd / Catch)
[ Komunikat: Sukces! ]                    [ Komunikat: Błąd zapisu ]
      │                                         │
      ▼                                         ▼
[ Reset formularza do domyślnych ]        [ Wyłączenie blokad: isLoading = false ]
      │
      ▼
[ Wyłączenie blokad: isLoading = false ]

```

1. **Blokada Wielokrotnego Zapisu:** Stan `isLoading = true` podmienia ikonę zapisu na kręcący się znacznik oczekiwania (`mat-spinner`) oraz dezaktywuje przycisk, co zapobiega dublowaniu rekordów przy wolniejszym połączeniu internetowym.
2. **Utrwalenie Danych:** Obiekt `categoryForm.value` przesyłany jest bezpośrednio do metody `supabase.addCategory()`.
3. **Powrót do Stanu Czystego:** Po udanej transakcji system wyświetla powiadomien
