# Dokumentacja Biznesowa: Football (Generator Składów)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość szybkiego generowania i mapowania pełnych składów piłkarskich dla dwóch rywalizujących drużyn, aby gracze mogli brać udział w quizach sportowych wymagających odgadywania nazwisk zawodników na wirtualnym boisku.

---

## User Story
**Gdy** konfiguruję pytanie w module "Generator Składów",  
**Chcę** móc zdefiniować nagłówek meczu, wybrać formacje taktyczne obu zespołów oraz masowo wkleić lub ręcznie edytować listy zawodników wyjściowych i rezerwowych wraz z ich narodowościami,  
**Aby** system automatycznie wygenerował graficzny podgląd taktyczny meczu i zapisał strukturę gotową do interaktywnej rozgrywki.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Masowy Import i Automatyczne Wykrywanie Flag (Fast Text-to-Team Engine)
* **Scenariusz: Wklejanie surowej listy zawodników ze schowka**
  * **Wymóg:** System musi umożliwiać jednoczesne wczytanie całego składu z bloku tekstu, automatycznie rozpoznając nazwisko zawodnika oraz jego narodowość zapisaną w nawiasie.
  * **Zachowanie systemu:** Użytkownik ma do dyspozycji dwa osobne pola tekstowe (dla Gospodarzy i Gości). Po wklejeniu tekstu (gdzie każdy zawodnik znajduje się w nowej linii), system:
    * Pierwsze 11 linii przypisuje jako Skład Wyjściowy (pozycje od 1 do 11).
    * Wszystkie kolejne linie przypisuje jako Ławkę Rezerwowych (domyślny start pozycji od numeru 15).
    * Wykrywa nawiasy okrągłe – tekst wewnątrz nich (np. `(BR)` lub `(ESP)`) traktuje jako dwuliterowy kod kraju do miniatury flagi. Jeśli brak nawiasu, domyślnie ustawia kod `PL`.
    * Automatycznie usuwa białe znaki i oczyszcza nazwisko.

### 2. Szablony Taktyczne i Dynamiczny Podgląd Boiska
* **Scenariusz: Wybór formacji meczowej i weryfikacja wizualna**
  * **Wymóg:** Administrator musi mieć wpływ na to, jak zawodnicy zostaną rozmieszczeni na wirtualnej murawie, wybierając jedną z popularnych formacji (np. `1-4-4-2`, `1-4-2-3-1`, `1-3-5-2`).
  * **Zachowanie systemu:** Po prawej stronie formularza system generuje podgląd boiska w czasie rzeczywistym.
    * Zmiana formacji w polu wyboru natychmiast przegrupowuje linie zawodników na podglądzie (bramkarz, obrona, pomoc, atak).
    * Zawodnik z pozycją numer 1 automatycznie otrzymuje specjalne wyróżnienie jako bramkarz (`is-gk`).
    * Dla zachowania realizmu transmisyjnego, Drużyna 1 (Gospodarze) jest renderowana tradycyjnie od góry do środka, natomiast Drużyna 2 (Goście) w lustrzanym odbiciu (od dołu do środka boiska).
    * Tło ikony każdego zawodnika dynamicznie ładuje grafikę odpowiedniej flagi państwowej na podstawie wpisanego kodu.

### 3. Walidacja Struktury Drużyny Wyjściowej
* **Scenariusz: Próba usunięcia lub niewpisania pełnego składu wyjściowego**
  * **Wymóg:** Mecz piłkarski wymaga pełnej jedenastki w składzie podstawowym.
  * **Zachowanie systemu:** System pilnuje, aby każda z drużyn posiadała dokładnie **11** zawodników w sekcji składów wyjściowych. Jeśli administrator wklei mniej nazwisk, system automatycznie wygeneruje puste szablony zawodników, by dopełnić strukturę do wymaganej liczby 11.
  * Sekcja rezerwowych (Ławka) jest w pełni dynamiczna – administrator może dowolnie dodawać nowych rezerwowych przyciskiem `+ DODAJ REZERWOWEGO` lub usuwać istniejących znakiem `✕`.

### 4. Format Struktury Payload (Zapis do Supabase)
* **Scenariusz: Pomyślny zapis danych meczowych**
  * **Wymóg:** Dane muszą zostać zapisane jako ustrukturyzowany dokument bazy danych pozwalający na późniejsze odgadywanie haseł.
  * **Zachowanie systemu:** Po kliknięciu "ZAPISZ SKŁADY", system weryfikuje poprawność (wymagane są: kategoria, nagłówek meczu oraz pełna walidacja pól). Dane są przesyłane w formacie, gdzie klucz pytania stanowi pełny opis meczu (np. `Piast 1-1 Jagiellonia (13.09.2025)`), natomiast odpowiedzi zawierają oczyszczoną nazwę do dopasowania w quizie oraz pełne drzewo konfiguracji obu drużyn (`firstTeam` i `secondTeam`) wraz z formacjami, nazwiskami, pozycjami i flagami.
