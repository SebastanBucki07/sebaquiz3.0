# Dokumentacja Biznesowa i Funkcjonalna Projektu Quiz App (sebaquiz3.0)

Witamy w centralnym rejestrze dokumentacji projektu **sebaquiz3.0**. Jest to zaawansowana aplikacja quizowa oparta na frameworku Angular, wykorzystująca system turowy, dynamiczne zarządzanie rankingiem drużyn w czasie rzeczywistym oraz architekturę chmurową Supabase do autoryzacji i zarządzania bazą danych.

Dokumentacja została podzielona na niezależne, wyspecjalizowane moduły (pliki `.md`), co pozwala na łatwe zarządzanie wiedzą o projekcie i śledzenie reguł biznesowych.

---

## 📌 Spis Treści (Struktura Dokumentacji)

### Rozdział 1: Rama Wizualna Interfejsu
* [Elementy Wspólne (Header & Footer)](wspolne-komponenty.md) – Opis globalnych, niezmiennych elementów aplikacji: logotypu, nawigacji ratunkowej („Nowa Gra”) oraz stopki autorsko-kontaktowej.

### Rozdział 2: Nawigacja i Stan Startowy
* [Strona Główna (Home Page)](strona-glowna.md) – Centralny punkt wejścia do aplikacji. Opis panelu akcji oraz logiki warunkowej widoku (zamiana przycisku ZALOGUJ na KONFIGURUJ w zależności od stanu autoryzacji).

### Rozdział 3: Bezpieczeństwo i Dostęp do Danych
* [Ekran Logowania i Autoryzacji](ekran-logowania.md) – Opis mechanizmu uwierzytelniania profilu administratora (prowadzącego) w oparciu o integrację z **Supabase Service**. Szczegółowe reguły walidacji pól, obsługi błędów oraz procedury wylogowania.

---

## 🚀 Sekcje w Przygotowaniu (Kolejne Kroki)

Poniższe moduły zostaną udokumentowane w miarę rozwoju projektu i analizy kolejnych komponentów kodu źródłowego:

### Rozdział 4: Faza Przygotowania Rozgrywki (`/pregame`)
* *Zarządzanie Drużynami i Koszykiem Kategorii* – Proces rejestracji zespołów, przydzielania awatarów oraz wyboru zestawów pytań przed meczem.

### Rozdział 5: Panel Administracyjny i CMS (`/configure`)
* *Zarządzanie Zawartością* – Kreator dodawania pytań (wielokrotnego wyboru, otwartych) oraz baza multimedialna (kluby piłkarskie, budynki).

### Rozdział 6: Mechaniki Rozgrywki (Formaty Gier)
* *Szczegółowe reguły biznesowe i punktacja dla formatów:* ABCD, Familiada, Kółko i Krzyżyk (TicTacToe), Kategoria Muzyczna, Podpowiedzi graficzne oraz Zgadywanie Państwa.

---
*Ostatnia aktualizacja spisu treści: Maj 2026*
