# Dokumentacja Biznesowa: Writing (Generator Pytań Tekstowych)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość sprawnego dodawania, wyszukiwania oraz edytowania standardowych pytań tekstowych z dynamiczną listą prawidłowych odpowiedzi, aby zarządzać bazą wiedzy gry oraz modyfikować istniejące zasoby bez konieczności bezpośredniej ingerencji w bazę danych.

---

## User Story
**Gdy** zarządzam pulą pytań tekstowych w panelu administracyjnym,  
**Chcę** mieć zablokowaną możliwość edycji do momentu wskazania kategorii, a po jej wyborze móc masowo importować odpowiedzi oraz przeglądać i filtrować powiązane z nią pytania historyczne,  
**Aby** efektywnie rozbudowywać i aktualizować teleturniejową bazę pytań przy minimalnym nakładzie pracy.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Blokada Bezpieczeństwa Katedry (Category Context Guard)
* **Scenariusz: Próba interakcji z panelem bez wybranej kategorii**
  * **Wymóg:** Formularz tworzenia pytania oraz sekcja bazy pytań muszą pozostać nieaktywne, dopóki użytkownik jawnie nie wskaże kategorii rozgrywek.
  * **Zachowanie systemu:** * Pola "Pytanie", importer odpowiedzi oraz przycisk zapisu są zablokowane i wyszarzone.
    * Wyszukiwarka w bazie pytań jest nieaktywna i wyświetla komunikat informacyjny: *"Najpierw wybierz kategorię"*.
    * Po wybraniu kategorii system automatycznie odblokowuje cały formularz i ładuje z bazy danych listę pytań powiązanych wyłącznie z tym konkretnym tematem.

### 2. Szybkie Parsowanie i Ręczna Edycja Odpowiedzi
* **Scenariusz: Masowy import haseł ze schowka lub dopisywanie pojedynczych pozycji**
  * **Wymóg:** Administrator musi mieć możliwość błyskawicznego wstrzyknięcia wielu poprawnych odpowiedzi naraz, z zachowaniem opcji ręcznego sterowania wierszami.
  * **Zachowanie systemu:** * **Masowy import:** Wklejenie tekstu do pola zbiorczego automatycznie dzieli tekst przy użyciu przecinków lub znaków nowej linii jako separatorów. System czyści dotychczasową listę i generuje ponumerowane, pojedyncze pola dla każdego wykrytego hasła.
    * **Ręczna kontrola:** Przycisk `+ DODAJ RĘCZNIE` dopisuje nowe, puste pole na dole listy. Każdy wiersz posiada dedykowany przycisk usuwania (`✕` / ikona kosza), umożliwiający wybiórcze czyszczenie odpowiedzi.

### 3. Dwustronny Moduł Edycji i Przeglądu (Baza Pytań)
* **Scenariusz: Przełączanie między tworzeniem a modyfikacją pytania**
  * **Wymóg:** Panel musi działać w dwóch kontekstach: tworzenia nowego rekordu oraz aktualizacji istniejącego, z wyraźnym oznaczeniem wizualnym i informacją o autorach.
  * **Zachowanie systemu:** * Kliknięcie elementu na liście historycznej ładuje jego pełną strukturę (kategoria, treść, odpowiedzi) do lewej sekcji formularza oraz automatycznie przewija ekran do góry.
    * Nagłówek zmienia się na "Edytuj Pytanie", a wokół karty pojawia się charakterystyczna ramka trybu edycji.
    * W bazie pytań system wyświetla podgląd pytania, nazwę jego twórcy (`Autor`) oraz ewentualną informację o osobie korygującej (`Edycja`).
    * Zapisanie formularza w tym stanie aktualizuje istniejący rekord w bazie danych zamiast tworzyć nowy. Przycisk `ANULUJ` przerywa edycję i przywraca czysty formularz.

### 4. Lokalny Silnik Filtrowania i Inteligentny Reset
* **Scenariusz: Wyszukiwanie pytań oraz zachowanie płynności pracy**
  * **Wymóg:** Filtrowanie bazy musi odbywać się błyskawicznie na poziomie interfejsu, a po udanym zapisie system powinien ułatwić seryjne dodawanie pytań.
  * **Zachowanie systemu:** * Wyszukiwarka analizuje wprowadzany tekst w czasie rzeczywistym, przeszukując zarówno treść pytań, jak i powiązane odpowiedzi. Licznik nad listą dynamicznie wskazuje liczbę odfiltrowanych pozycji (np. `12 / 150`).
    * Po kliknięciu "ZAPISZ" i pomyślnej synchronizacji z bazą danych, formularz resetuje treść pytania i listę odpowiedzi do zera, **ale automatycznie zachowuje aktualnie wybraną kategorię**. Dzięki temu administrator może natychmiast wpisywać kolejne pytanie do tej samej sekcji bez ponownego wybierania jej z listy.
