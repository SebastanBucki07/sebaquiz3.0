# Dokumentacja Biznesowa: Familiada (Moduł teleturniejowy)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę w prosty i szybki sposób wprowadzać pytania tablicowe o strukturze znanej z teleturnieju "Familiada", aby móc realizować rozgrywki drużynowe oparte na odgadywaniu najpopularniejszych odpowiedzi na zadane pytanie.

---

## User Story
**Gdy** wybieram moduł "Generator Familiady",  
**Chcę** móc wpisać pytanie, a następnie wkleić lub wpisać listę odpowiedzi, którym system automatycznie przypisze malejącą punktację teleturniejową,  
**Aby** proces tworzenia pytań z wieloma odpowiedziami trwał zaledwie kilka sekund.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Sztywny Rozkład Punktów (Dystrybucja Teleturniejowa)
* **Scenariusz: Automatyczne przypisywanie punktów do pozycji**
  * **Wymóg:** Odpowiedzi muszą być wprowadzane od najwyżej punktowanej (najpopularniejszej) do najniższej. System automatycznie narzuca im stałe wartości punktowe:
    * 1. miejsce = 35 pkt, 2. miejsce = 25 pkt, 3. miejsce = 15 pkt, 4. miejsce = 10 pkt, 5. miejsce = 8 pkt, 6. miejsce = 7 pkt.
  * **Zachowanie systemu:** Formularz na starcie wyświetla dokładnie 6 gotowych pól. Jeśli administrator doda ręcznie 7. lub kolejne pole, otrzyma ono domyślną, minimalną wartość 5 punktów.

### 2. Szybkie Wklejanie ze Schowka (Quick Paste Engine)
* **Scenariusz: Masowe wprowadzanie odpowiedzi z zewnętrznego pliku**
  * **Wymóg:** Użytkownik nie musi wpisywać każdej odpowiedzi oddzielnie – może wkleić listę słów do jednego pola tekstowego.
  * **Zachowanie systemu:** Po wklejeniu tekstu (gdzie każda odpowiedź jest w nowej linii), system automatycznie oczyszcza tekst z pustych linii, czyści dotychczasowe pola i rozdziela wklejone słowa po kolei do pól "Odpowiedź 1", "Odpowiedź 2" itd.

### 3. Walidacja Pustych Wierszy i Zapis Stanu Gry
* **Scenariusz: Wysyłka formularza z niewypełnionymi polami**
  * **Wymóg:** Administrator nie musi wypełniać wszystkich 6 domyślnych pól. System musi odrzucić puste wiersze przed zapisem do bazy danych.
  * **Zachowanie systemu:** Podczas zapisu system ignoruje puste pola. Warunkiem koniecznym jest wpisanie minimum 1 poprawnej odpowiedzi. Do bazy danych wysyłana jest także pusta struktura "odsłoniętych odpowiedzi" (`revealed_answers`), która w trakcie rzeczywistej gry będzie przechowywać informację o tym, które pola drużyny już zgadły.
