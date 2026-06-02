# Dokumentacja Biznesowa: Player History (Generator Kariery Zawodników)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość tworzenia pytań z kategorii "Historia Kariery Piłkarza", w których gracz odgaduje imię i nazwisko zawodnika na podstawie chronologicznej osi czasu klubów, w których grał, reprezentowanych przez ich oficjalne herby.

---

## User Story
**Gdy** konfiguruję pytanie w panelu "Kody krajów + Autocomplete klubów",  
**Chcę** móc przypisać zawodnikowi jego narodowość (reprezentowaną przez flagę) oraz w elastyczny, chronologiczny sposób układać ścieżkę jego kariery z automatycznym podpowiadaniem klubów oraz ich herbów,  
**Aby** system gry mógł generować zagadki oparte na stopniowo odsłanianych klubach, w których dany zawodnik występował.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Kontekst Narodowości z Autouzupełnianiem (Country Selector & Badge)
* **Scenariusz: Wybór kraju pochodzenia zawodnika**
  * **Wymóg:** System musi ułatwiać wprowadzanie narodowości poprzez listę podpowiedzi, a po wyborze natychmiastowo mapować ją na dwu- lub trzyliterowy kod międzynarodowy (np. `PL`, `ESP`).
  * **Zachowanie systemu:** * Administrator wyszukuje kraj, wpisując jego nazwę (np. "Polska").
    * Wybór z listy podpowiedzi (`mat-autocomplete`) automatycznie podmienia pełną nazwę na techniczny kod kraju.
    * Obok pola wejściowego oraz w module podglądu na żywo (`Live Preview`) system renderuje okrągłą miniaturkę flagi powiązaną z wybranym krajem, dając natychmiastową informację zwrotną twórcy treści.

### 2. Inteligentna Oś Czasu Kariery (Dynamic Career Path Editor)
* **Scenariusz: Zarządzanie listą klubów i ich kolejnością**
  * **Wymóg:** Kariera piłkarza musi odzwierciedlać chronologię. Administrator musi mieć możliwość dodawania klubów na koniec, usuwania ich, a także wstrzykiwania pominiętego klubu w środek istniejącej historii.
  * **Zachowanie systemu:** * **Wyszukiwanie klubu:** Każdy wiersz klubu posiada pole z autouzupełnianiem połączone ze słownikiem bazy danych. Wybór klubu automatycznie przypisuje do wiersza nazwę oraz nazwę pliku graficznego z herbem (`file_name`). Jeśli klub nie posiada przypisanego herbu, system zabezpiecza payload, ustawiając domyślny plik rezerwowy `no-image.png`.
    * **Wstawianie pomiędzy (Insert Between):** Nad każdym istniejącym wierszem klubu znajduje się przycisk `Wstaw tutaj`. Jego kliknięcie powoduje wstrzyknięcie nowego, czystego pola dokładnie w tym miejscu, przesuwając dotychczasowe kluby w dół osi czasu.
    * **Przebudowa filtrów (Rebuild Filters):** Każda zmiana kolejności wierszy (dodanie, usunięcie, wstawienie) automatycznie przelicza indeksy i resetuje selektory podpowiedzi, aby wpisywanie tekstu aktywowało właściwą listę podpowiedzi dla danego wiersza.

### 3. Zapobieganie Duplikatom w Obrębie Kategorii (Real-time Duplicate Guard)
* **Scenariusz: Próba dodania tego samego piłkarza**
  * **Wymóg:** System w tle (z opóźnieniem 500ms od zakończenia pisania) sprawdza, czy zawodnik o takim imieniu i nazwisku nie został już dodany do wybranej kategorii.
  * **Zachowanie systemu:** Jeśli system wykryje duplikat, pod polem "Imię i Nazwisko" pojawia się czerwony komunikat ostrzegawczy z ikoną: `⚠️ Ten piłkarz już istnieje!`. Blokada działa wyłącznie w trybie tworzenia nowego rekordu – w trybie edycji istniejącego wpisu jest nieaktywna, aby nie generować fałszywych alarmów przy modyfikacji danych zawodnika.

### 4. Moduł Podglądu na Żywo (Live Pitch & Career Preview)
* **Scenariusz: Wizualna weryfikacja wprowadzonych danych**
  * **Wymóg:** Po prawej stronie ekranu administrator musi widzieć dokładną wizualizację tego, co zobaczy gracz.
  * **Zachowanie systemu:** Karta `writing-preview-card` reaguje na każdą zmianę w formularzu bez konieczności zapisu:
    * Wyświetla wpisane nazwisko, flagę oraz dynamiczną linię poziomą złożoną z herbów klubowych ułożonych od lewej do prawej strony (zgodnie z kolejnością na liście).
    * Brak klubów generuje czytelny stan pusty: *"Dodaj kluby, aby zobaczyć podgląd"*.

### 5. Zaawansowane Filtrowanie i Bezpieczny Zapis (Payload Validation)
* **Scenariusz: Zapisywanie i zarządzanie bazą w kontekście kategorii**
  * **Wymóg:** Dane muszą trafiać do bazy w ujednoliconym formacie quizowym (z podziałem na pytanie, odpowiedzi i wskazówki), a wyszukiwarka po prawej stronie musi wspierać lokalne, zaawansowane filtrowanie.
  * **Zachowanie systemu:** * **Struktura Zapisu:** Zapisywany obiekt mapuje kod kraju jako `question`, nazwisko jako tablicę jednoelementową `answers: [{ value: '...' }]`, a całą chronologiczną listę klubów jako tablicę podpowiedzi `hints`.
    * **Wyszukiwarka bazy:** Pozwala na natychmiastowe odnalezienie zawodnika. Filtr nie bazuje na prostym tekście – jest inteligentny i przeszukuje listę po nazwisku (również ignorując polskie znaki diakrytyczne) oraz po kodzie państwa (np. wpisanie "FR" lub "Francja" przefiltruje odpowiednio bazę).
    * **Płynność pracy:** Po udanym zapisie formularz czyści sekcję zawodnika i całą listę klubów, lecz podobnie jak w innych modułach – **utrzymuje aktywną kategorię**, pozwalając administratorowi na masowe wprowadzanie kolejnych piłkarzy do tego samego turnieju.
