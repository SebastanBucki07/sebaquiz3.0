# Dokumentacja Biznesowa: Music (Kategoria Muzyczna)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę dodawać zagadki muzyczne oparte na klipach z platformy YouTube, aby gracze podczas turnieju mogli rywalizować w rozpoznawaniu utworów po usłyszeniu fragmentu audio.

---

## User Story
**Gdy** tworzę pytanie muzyczne i wklejam link do utworu na YouTube,  
**Chcę**, aby system automatycznie rozpoznał wideo, wyświetlił jego podgląd oraz pomógł mi błyskawicznie podzielić tytuł filmu na pole "Autor" i "Tytuł",  
**Aby** eliminować pomyłki literowe i przyspieszyć pracę nad bazą muzyczną.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Dynamiczny Podgląd i Pobieranie Tytułu (YouTube oEmbed)
* **Scenariusz: Wklejenie odnośnika do filmu**
  * **Wymóg:** Po wklejeniu pełnego lub skróconego linku z YouTube, system musi automatycznie wyciągnąć 11-znakowy identyfikator filmu i pobrać jego oficjalną nazwę oraz miniaturkę.
  * **Zachowanie systemu:** W panelu pojawia się boks podglądu ("ROZPOZNANO UTWÓR") pokazujący grafikę filmu oraz jego oficjalny tytuł pobrany bezpośrednio z sieci.

### 2. Funkcja Inteligentnego Podziału (Magic Split)
* **Scenariusz: Automatyczne uzupełnianie pól Autora i Tytułu**
  * **Wymóg:** System udostępnia przycisk "MAGIC SPLIT", który analizuje oficjalną nazwę filmu z YouTube i samoczynnie uzupełnia formularz odpowiedzi.
  * **Zachowanie systemu:** Po kliknięciu przycisku system:
    * Oczyszcza tytuł ze zbędnych dopisków marketingowych w nawiasach, takich jak: `(Official Video)`, `[Lyrics]`, `4K`, `HQ` itp.
    * Szuka znaku podziału (np. myślnika ` - ` lub dwukropka ` : `).
    * Tekst przed myślnikiem wpisuje w pole "Autor", a tekst po myślniku w pole "Tytuł". Dotychczasowe pola odpowiedzi są automatycznie zastępowane tymi nowymi, czystymi danymi.

### 3. Kontrola Unikalności i Klucz Pytania
* **Scenariusz: Zabezpieczenie przed dodaniem tego samego utworu**
  * **Wymóg:** Unikalność pytania muzycznego jest weryfikowana na poziomie 11-znakowego kodu filmu YouTube, a nie treści tekstowej.
  * **Zachowanie systemu:** System nie pozwoli zapisać utworu, jeśli w bazie dla wybranej kategorii istnieje już ten sam identyfikator wideo. Chroni to bazę przed sytuacją, w której ktoś wklei ten sam utwór, ale np. z innego formatu linku (skróconego). Po poprawnym zapisie, formularz wraca do stanu domyślnego z dwoma pustymi polami: "Tytuł" i "Autor".
