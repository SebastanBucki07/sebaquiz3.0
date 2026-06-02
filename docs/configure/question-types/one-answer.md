# Dokumentacja Biznesowa: One-Answer (Standardowy Quiz)

## Rola i cel biznesowy
Jako **Administrator Systemu (Twórca Treści)** chcę mieć możliwość dodawania standardowych pytań jednokrotnego wyboru do bazy danych, aby gracze mogli na nie odpowiadać podczas klasycznych rozgrywek quizowych.

---

## User Story
**Gdy** znajduję się w panelu zarządzania pytaniami i wybieram format "Standardowy Quiz",  
**Chcę** móc przypisać pytanie do konkretnej kategorii, wpisać treść pytania oraz zdefiniować zestaw potencjalnych odpowiedzi,  
**Aby** pytanie było kompletne, poprawne merytorycznie i gotowe do wyświetlenia w aplikacji klienckiej.

---

## Kryteria Akceptacji (Acceptance Criteria)

### 1. Walidacja i Limity Pól Odpowiedzi
* **Scenariusz: Minimalna i maksymalna liczba odpowiedzi**
  * **Wymóg:** System musi wymusić dodanie przynajmniej **1** odpowiedzi i pozwalać na maksymalnie **5** odpowiedzi dla jednego pytania.
  * **Zachowanie systemu:** * Przy otwarciu formularza system automatycznie przygotowuje jedno czyste pole na odpowiedź.
    * Jeśli w formularzu znajduje się tylko jedna odpowiedź, przycisk usuwania wiersza jest całkowicie zablokowany.
    * Przycisk "Dodaj odpowiedź" wyświetla aktualny licznik (np. `2/5`). Po dodaniu piątej odpowiedzi przycisk ten staje się nieaktywny.

### 2. Blokada Duplikatów (Duplicate Guard)
* **Scenariusz: Próba dodania istniejącego pytania**
  * **Wymóg:** System nie może pozwolić na zapisanie dwóch identycznych pytań w obrębie tej samej kategorii, aby uniknąć powtarzania się pytań podczas gry.
  * **Zachowanie systemu:** Przed zapisaniem system sprawdza treść pytania i wybraną kategorię. Jeśli takie pytanie już istnieje, proces zapisu zostaje przerwany, a użytkownik widzi ostrzeżenie: *"To pytanie już istnieje w wybranej kategorii!"* przez 5 sekund.

### 3. Logika Przechowywania Podpowiedzi
* **Scenariusz: Brak podpowiedzi w tym formacie**
  * **Wymóg:** Standardowy format pytania z założenia nie obsługuje systemu podpowiedzi.
  * **Zachowanie systemu:** System automatycznie zapisuje to pytanie z jawnie pustą listą podpowiedzi, aby struktura danych była spójna z wymaganiami bazy danych.

### 4. Komfort Pracy (Automatyczne Resetowanie)
* **Scenariusz: Dodawanie wielu pytań pod rząd**
  * **Wymóg:** Po udanym zapisaniu pytania administrator musi mieć możliwość natychmiastowego wprowadzania kolejnego, bez konieczności ręcznego odświeżania strony.
  * **Zachowanie systemu:** Po kliknięciu "Zapisz" i otrzymaniu potwierdzenia sukcesu, system automatycznie:
    * Czyści treść pytania i resetuje wybór kategorii.
    * Usuwa wszystkie nadmiarowe pola odpowiedzi, pozostawiając dokładnie jedno czyste pole startowe gotowe do edycji.
