# Dokumentacja Biznesowa: Hints (Pytania z podpowiedziami)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość dodawania pytań, które posiadają system stopniowalnych podpowiedzi obciążonych karami punktowymi, aby urozmaicić rozgrywkę i dać graczom szansę na ratunek kosztem części wyniku.

---

## User Story
**Gdy** konfiguruję pytanie w formacie "Kategoria z podpowiedziami",  
**Chcę** móc zdefiniować treść pytania, poprawne odpowiedzi oraz listę maksymalnie 5 podpowiedzi wraz z określeniem procentowej kary za ich użycie,  
**Aby** system gry mógł poprawnie odejmować punkty graczom, którzy zdecydują się skorzystać z pomocy podczas teleturnieju.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Zarządzanie Podpowiedziami i Kary Punktowe
* **Scenariusz: Dodawanie podpowiedzi i ustawianie wag kar**
  * **Wymóg:** System pozwala na dodanie maksymalnie **5** podpowiedzi. Każda podpowiedź musi mieć automatycznie przypisany numer, tekst pomocniczy oraz procentową wartość kary.
  * **Zachowanie systemu:** * Przy otwarciu formularza system automatycznie generuje pierwsze pole podpowiedzi.
    * Każda nowa podpowiedź automatycznie nazywa się kolejnym numerem (np. "Podpowiedź 1", "Podpowiedź 2") i otrzymuje techniczny identyfikator.
    * Administrator ustawia karę punktową za pomocą suwaka w zakresie od 0% do 100% (ze skokiem co 5%). Domyślna wartość to 0% (podpowiedź darmowa).
    * Po osiągnięciu 5 podpowiedzi przycisk dodawania kolejnych staje się nieaktywny.

### 2. Elastyczność bazy podpowiedzi
* **Scenariusz: Usuwanie wskazówek**
  * **Wymóg:** W przeciwieństwie do pól odpowiedzi (gdzie musi zostać minimum jedna), administrator może usunąć wszystkie pola podpowiedzi, jeśli uzna, że pytanie ostatecznie ma ich nie mieć.

### 3. Zabezpieczenie przed powtórzeniami (Duplicate Guard)
* **Scenariusz: Próba zapisu istniejącego pytania**
  * **Wymóg:** System blokuje zapis, jeśli w tej samej kategorii istnieje już identyczne pytanie tekstowe. Administrator otrzymuje wtedy wyraźne, żółte ostrzeżenie na ekranie przez 5 sekund.
