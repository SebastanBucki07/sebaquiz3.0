# Dokumentacja Biznesowa: Photo (Kreator Pytania Foto)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość dodawania pytań opartych na plikach graficznych z elastycznym systemem podpowiedzi tekstowych i kar procentowych, aby gracze mogli rywalizować w rozpoznawaniu obiektów, budowli lub herbów na podstawie wyświetlonego zdjęcia.

---

## User Story
**Gdy** konfiguruję nowe pytanie w "Kreatorze Pytania Foto",  
**Chcę** mieć możliwość wyboru źródła pliku (dysk lokalny lub zewnętrzny odnośnik sieciowy), określenia nazwy obiektu oraz przypisania zestawu opcjonalnych wskazówek z suwakiem kar punktowych,  
**Aby** system automatycznie rozmieścił zasoby w odpowiednich kontenerach bazy danych (bucketach) i poprawnie przygotował logikę punktacji teleturniejowej.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Hybrydowe Zarządzanie Źródłem Grafiki (Media Source Selector)
* **Scenariusz: Wybór między wgrywaniem pliku a odnośnikiem URL**
  * **Wymóg:** System musi wspierać dwa niezależne sposoby dostarczania grafiki do pytania: tradycyjny upload z dysku oraz wklejenie bezpośredniego linku internetowego.
  * **Zachowanie systemu:** * **Plik z dysku (`file`):** System wyświetla strefę upuszczania/wyboru pliku (`upload-zone`). Kliknięcie w nią otwiera systemowe okno wyboru plików (akceptowane są wyłącznie pliki graficzne `image/*`). Po wskazaniu pliku system natychmiast generuje podgląd miniatury.
    * **Link URL (`url`):** Strefa uploadu zostaje ukryta, a w jej miejsce pojawia się standardowe pole tekstowe na adres URL (np. `https://...`). Wprowadzenie adresu natychmiast odświeża obraz w panelu bocznym.

### 2. Inteligentna Dystrybucja Plików (Contextual Storage Routing)
* **Scenariusz: Automatyczny wybór kontenera (bucketu) w Supabase**
  * **Wymóg:** System nie może wrzucać wszystkich plików graficznych do jednego miejsca. Nazwa wybranej kategorii musi dynamicznie determinować docelowy folder zapisu, aby utrzymać porządek na serwerze.
  * **Zachowanie systemu:** Podczas zatwierdzania formularza, jeśli wybrano źródło pliku z dysku, system analizuje nazwę wybranej kategorii:
    * Kategorie zawierające słowo "budowle" lub "budynek" kierują plik do magazynu `buildings`.
    * Kategorie zawierające słowo "klub" kierują plik do magazynu `footballCrestes`.
    * Kategorie zawierające słowo "seba" kierują plik do magazynu testowego `tests`.
    * Wszystkie pozostałe konfiguracje trafiają do domyślnego magazynu `general`.
    * Wygenerowany, unikalny link publiczny z wybranego bucketu jest automatycznie ustawiany jako treść pytania (`question`).

### 3. Moduł Podpowiedzi z Suwakiem Kar Punktowych (Graded Hints System)
* **Scenariusz: Konfiguracja wskazówek ułatwiających graczom zadanie**
  * **Wymóg:** Administrator może dodać nieskończenie wiele podpowiedzi tekstowych. Każda podpowiedź musi posiadać swój nagłówek, treść oraz precyzyjnie określoną karę za jej odkrycie podczas teleturnieju.
  * **Zachowanie systemu:** * Kliknięcie `+ DODAJ PODPOWIEDŹ` generuje nowy boks konfiguracyjny z domyślnie ustawioną wartością kary na 10%.
    * Administrator ustawia procentową wartość kary za pomocą suwaka (`mat-slider`) w zakresie od 0% do 50% ze skokiem co 5%.
    * Każda zmiana na suwaku dynamicznie aktualizuje licznik tekstowy (np. `-25%`) w formularzu oraz na podglądzie na żywo.
    * Każda podpowiedź posiada przycisk usuwania (ikonę kosza), który bezpowrotnie usuwa dany boks z formularza.

### 4. Podwójny Zapis Relacyjny (Cross-Table Synchronization)
* **Scenariusz: Zapisywanie pytań o architekturę i budowle**
  * **Wymóg:** W przypadku tworzenia pytań z kategorii budowlanych, system musi zarejestrować informację nie tylko w ogólnej bazie pytań, ale również zaktualizować dedykowany słownik architektoniczny (np. do późniejszego wykorzystania w podpowiedziach autocomplete innych modułów).
  * **Zachowanie systemu:** Po kliknięciu "ZAPISZ PYTANIE", dane są wysyłane do głównej tabeli `questions`. Dodatkowo, jeśli nazwa kategorii powiązana jest z "budowlami" lub "budynkiem", system w tle wykonuje drugi, niezależny zapis do tabeli `buildings`, przekazując tam ujednoliconą strukturę: nazwę obiektu (`name`) oraz wygenerowany link do zdjęcia (`file_name`).

### 5. Asynchroniczny Stan Oczekiwania i Czyszczenie Pamięci (Form Reset)
* **Scenariusz: Blokada przed wielokrotnym kliknięciem i przygotowanie do kolejnego wpisu**
  * **Wymóg:** Proces uploadu i zapisu na serwerze wymaga czasu. System musi uniemożliwić ponowne wysłanie formularza w trakcie trwania transakcji, a po sukcesie przywrócić stan wyjściowy.
  * **Zachowanie systemu:** * Podczas komunikacji z bazą przycisk zapisu zostaje zablokowany,
