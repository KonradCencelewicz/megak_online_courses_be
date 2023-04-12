<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Opis

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

Aby zainstalować aplikację po jej pobraniu z repozytorium wykonaj poniższy skrypt.
```bash
$ npm install
```

## Set up
Przekopiuj zawartość .env.megak.example i uzupełnij ją swoimi danymi.
Wykorzystywana baza danych to mysql.
Pierwsza sekcja tyczy się danych bazy danych. Uzupełnij ją swoimi danymi.
DATA_DATABASE tutaj podaj nazwę tabeli wcześniej utworzonej ręcznie w mysql.

Kolejnie stwórz folder w głównym folderze (nie src tylko jeden level wyżej)
folder o nazwie uploads a w nim dwa foldery files oraz temp.
UPLOAD_TEMP_DIR= ściezka do pliku temp
UPLOAD_PATH= ścieżka do pliki files
MAX_FILE_SIZE= tutaj ustawiamy maksymalny rozmiar uplodowanego pliku

ALLOWED_ORIGIN= na końcu ustawaimy origin który może wysyłać do nas zapytania (nasz FE)

## Uruchomienie aplikacji

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Po pierwszym uruchomieniu aplikacji

Wejdź do bazy dancyh i ręcznie dodaj rekordy:
tabela **category** [dodaj kategorie które chcesz obsługiwać w aplikacji np. id=1, name=Matematyka]
tabela **role** dodaj następujące role id=1, role=ADMIN, id=2, role=INSTRUCTOR, id=3, role=STUDENT

Następnie ponownie uruchom aplikację.
Zarejestruj się przy użyciu formularza.
Kolejnie wróc do bazy danych i w tabeli **users_roles_roles** dodaj rekordy łączące Cie z rolami 1, 2 (role 3 dostajesz automatycznie przy rejestracji)

Od teraz twoje konto ma uprawnienia admina, instruktora

## Rozwój na przyszłość
1. Obieranie obrazków i wideo do lekcji
2. Napisanie seedera pozwalającego automatyczne stworzyć dane setupowe przy pierwszym uruchomieniu.
3. Dodanie możliwość aby student zapisywał się na kursy (a nie tak jak teraz miał do nich z automatu dostęp)
4. Zadania administratora (banowanie kont itp)

