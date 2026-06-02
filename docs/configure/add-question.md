# Formularz Kreatora Treści Quizowych (Dodaj pytanie)

Dokument opisuje wymagania funkcjonalne oraz architekturę huba zarządzania formularzami pytań (reprezentowanego przez `AddQuestionComponent`). Moduł ten pełni rolę fabryki (Dispatcher), która dystrybuuje proces tworzenia treści w zależności od wybranego formatu gry w aplikacji `sebaquiz3.0`.

---

## 1. Architektura Interfejsu i Sterowanie Widokiem (UI & Controls)

Komponent stosuje architekturę podziału na sekcję wyboru (Toolbar) oraz dynamiczną przestrzeń roboczą (Form Container). Całość osadzona jest w kontenerze z podwyższoną estetyką warstwy (`mat-elevation-z4`).

### 1.1. Pasek Wyboru Formatów (`mat-button-toggle-group`)

Do przełączania typów pytań wykorzystano komponent grupy przycisków stanowych. Każdy format posiada unikalną etykietę oraz ikonę Material Design:

* **One-Answer (Quiz standardowy):** Wartość `one-answer`, ikona `quiz`.
* **Hint (Kategoria z podpowiedziami):** Wartość `hint`, ikona `help_outline`.
* **Muzyczne:** Wartość `music`, ikona `music_note`.
* **Familiada (Moduł teleturniejowy):** Wartość `familiada`, ikona `subject`.
* **Piłka nożna (Dedykowany moduł sportowy):** Wartość `football`, ikona `subject`.
* **Writing question (Pytania otwarte/wpisywane):** Wartość `writting`, ikona `assignment`.
* **Player history question (Kariera zawodnika):** Wartość `photo-hints`, ikona `camera`.
* **Photo question (Pytanie z grafiką):** Wartość `photos`, ikona `camera`.

### 1.2. Logika Wyboru Stanu Aktywnego (`activeForm`)

Przełączanie formularzy odbywa się poprzez zdarzenie `(change)="setForm(FormType)"`. System przypisuje unikalny identyfikator formatu do zmiennej stanowej `activeForm`. Każdy przycisk na bieżąco weryfikuje swój stan poprzez wiązanie `[checked]="activeForm === '...'"` w celu zachowania spójności wizualnej.

---

## 2. Dynamiczne Renderowanie Podkomponentów (Form Factory)

Przestrzeń robocza (`.form-container`) wykorzystuje nowoczesne bloki sterujące Angulara (`@if` / `@else if` / `@else`) do leniwego lub warunkowego wstrzykiwania dedykowanych formularzy. Zapobiega to ładowaniu i walidowaniu ukrytych formularzy w tle.

Główny panel administracyjny zarządza renderowaniem odpowiedniego formularza na podstawie wartości pola `activeForm` (powiązanego z wybranym typem lub kategorią gry). Poniższa tabela przedstawia pełną architekturę modułów kreatorów, powiązane pliki szczegółowych specyfikacji biznesowych oraz komponenty odpowiedzialne za ich obsługę w aplikacji `sebaquiz3.0`:

| Wartość `activeForm` | Dokumentacja Szczegółowa                                | Odpowiedzialny Komponent |
|:---------------------|:--------------------------------------------------------|:-------------------------|
| `one-answer`         | [Specyfikacja One-Answer](question-types/one-answer.md) | `OneAnswerFormComponent` |
| `hint`               | [Specyfikacja Hints](question-types/hints.md)           | `HintsFormComponent`     |
| `familiada`          | [Specyfikacja Familiada](question-types/familiada.md)   | `FamiliadaFormComponent` |
| `football`           | [Specyfikacja Football](question-types/football.md)     | `FootballFormComponent`  |
| `music`              | [Specyfikacja Music](question-types/music.md)           | `MusicFormComponent`     |
| `photo`              | [Specyfikacja Photo](question-types/photo.md)           | `PhotoQuestionFormComponent` |
| `player-history`     | [Specyfikacja Player History](question-types/player-history.md) | `PlayerHistoryFormComponent` |
| `writing`            | [Specyfikacja Writing](question-types/writtings.md)     | `WrittingFormComponent`  |

---

### 2.2. Efekty Wizualne Przejść (UX Animation)

* Każdy kontener formularza został otoczony klasą `.fade-in`.
* *Reguła biznesowa:* Przełączanie formatów pytań nie może następować gwałtownie. Zastosowanie animacji płynnego pojawiania się (Fade In) niweluje efekt skakania interfejsu przy zmianie wielkości formularza.

### 2.3. Stan Pusty / Początkowy (Placeholder State)

* Gdy wartość `activeForm` wynosi `null` (stan bezpośrednio po wejściu do sekcji), system ukrywa obszary formularzy i generuje widok informacyjny (`.placeholder-content`) z nieaktywną ikoną `quiz` oraz komunikatem biznesowym: *"Wybierz typ pytania powyżej, aby rozpocząć tworzenie."*

---

## 3. Uwagi Deweloperskie i Refaktoryzacja (Developer Notes)

* **Detekcja Niezgodności Atrybutu:** W sekcji wyboru formatów przycisk dla pola `photos` (Dodaj photo question) posiada w strukturze HTML wpisaną wartość `value="photo-hints"`. Pomimo że wywołanie metody `setForm('photos')` przekazuje prawidłowy stan, zaleca się ujednolicenie atrybutu `value` do postaci `value="photos"`, aby zapewnić pełną spójność mechanizmu wiązania dwukierunkowego oraz prawidłowe podświetlanie aktywnego przycisku.
