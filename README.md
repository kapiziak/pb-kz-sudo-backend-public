# Opis

Back-end aplikacji SUDO stworzonej w ramach pracy inżynierskiej.

UWAGA: Komendy mogą działać nieprawidłowo w Powershellu. Zaleca się używanie CMD na Windowsie.

## Uruchamianie projektu

0. Skopiuj zmienne środowiskowe .env.example do pliku .env
1. Zainstaluj biblioteki `yarn` / `npm install`.
2. Wykonaj migracje `npx prisma migrate dev`.
3. Uruchom projekt `yarn run dev` / `npm run dev`.

## Zmiany w modelach ORM

Po jakichkolwiek zmianach w modelach bazodanowych należy wykonać migrację danych.
Można to wykonać poleceniem: `npx prisma migrate dev`.

## Uruchamianie testów jednostkowych w specjalnym środowisku (wymagany Docker & docker-compose)

1. Wykonaj polecenie `yarn run docker-test-db:up`.
2. Wykonaj polecenie `yarn run test` - testy podłączą się pod środowisko kontenera Dockera.

## Prisma Studio

Prisma ORM dostarcza wbudowane narzędzie do przeglądania bazy danych. Aby je uruchomić należy wykonać polecenie `npx prisma studio`.

## Tworzenie pierwszego użytkownika.

1. Wejdź do Prisma Studio `npx prisma studio`.
2. Wejdź do tabeli User.
3. Dodaj nowy rekord.
4. Wprowadź `email`.
5. Komendą `npm run utils:hash-password haslo` zahashuj sekretne hasło.
6. Wprowadź do pola `password` hash z kroku 5.
7. Zapisz zmiany.
8. Możesz się już zalogować.
