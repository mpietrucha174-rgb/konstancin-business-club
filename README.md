# Konstancin Business Club — pełny eksport gry

Stan gry: 3 października 2026 r. Ostatnio opublikowana oprawa 3D: stała kamera, 40 pól, budynki i postacie w kolorach graczy oraz panele w narożnikach.

Paczka zawiera pełny kod, grafikę, wszystkie aktualne karty, boty, aukcje, handel, hipoteki, zapisy i tryb online. Wersja w głównym folderze działa niezależnie od ChatGPT i Cloudflare: frontend React/Vite oraz serwer Node.js z bazą SQLite. Gotowy frontend jest już zbudowany w folderze `dist`.

## 1. Najprostsze uruchomienie na Windows

1. Zainstaluj **Node.js 24 LTS** z https://nodejs.org/en/download (instalator Windows, standardowe ustawienia).
2. Rozpakuj cały ZIP. Nie uruchamiaj plików bezpośrednio z archiwum.
3. Otwórz folder gry i dwukrotnie kliknij **URUCHOM-WINDOWS.bat**.
4. Pozostaw otwarte okno serwera i wejdź w przeglądarce na **http://localhost:3000**.

Do pierwszego grania nie musisz wykonywać `npm install`: gotowa strona jest w paczce, a serwer używa modułów wbudowanych w Node.js.

Na macOS/Linux uruchom w folderze gry `sh uruchom.sh` albo `node server.mjs`. Zatrzymanie serwera: Ctrl+C. Ostrzeżenie Node.js o eksperymentalnym module SQLite, jeżeli wystąpi, samo w sobie nie oznacza błędu gry.

## 2. Gra ze znajomymi w tej samej sieci Wi-Fi/LAN

1. Jedna osoba uruchamia serwer jak powyżej.
2. Na Windows wpisz w terminalu `ipconfig` i znajdź adres IPv4 aktywnego połączenia, np. `192.168.1.50`.
3. Znajomi otwierają **http://192.168.1.50:3000** na telefonach lub komputerach w tej samej sieci. Podmień przykład na rzeczywisty adres gospodarza.
4. Jeżeli Zapora Windows zapyta o Node.js, zezwól na połączenia w waszej sieci prywatnej.
5. Gospodarz wybiera tworzenie pokoju online. Znajomi wybierają dołączenie i wpisują kod pokoju; następnie gospodarz rozpoczyna grę. Wolne miejsca mogą grać jako boty.

`localhost` oznacza komputer osoby, która otwiera adres. Znajomym podaj adres IP gospodarza, a nie `localhost`. Komputer z serwerem musi pozostać włączony. Sieć gościnna routera może blokować komunikację między urządzeniami.

## 3. Gra z różnych miejsc przez internet

Potrzebny jest jeden wspólnie dostępny serwer Node.js 24 albo serwer z Dockerem. Ten ZIP zawiera kod i gotową stronę; sam plik ZIP nie tworzy publicznego adresu.

Na hostingu obsługującym długotrwale działający proces Node.js:

- Wgraj główny folder gry. Folder `original-sites` jest kopią źródłową i nie jest potrzebny do uruchomienia wersji niezależnej.
- Komenda startowa: **`node server.mjs`** (również działa `npm start`).
- Serwer domyślnie nasłuchuje na `0.0.0.0:3000`. Zmienna `PORT` może określić port przydzielony przez hosting.
- Zapewnij stały, zapisywalny katalog dla bazy. Zmienną `DATA_DIR` ustaw np. na `/var/lib/konstancin`; katalog musi być zachowany pomiędzy restartami/wdrożeniami.
- Przy publicznym adresie HTTPS ustaw **`PUBLIC_ORIGIN=https://twoja-domena.pl`**, bez ścieżki. Musi to być ten sam adres, z którego gracze korzystają w przeglądarce. Jest to potrzebne przy reverse proxy, aby żądania pokoju przechodziły sprawdzenie źródła.
- Uruchamiaj **jedną instancję** aplikacji i jedną wspólną bazę. Hosting wyłącznie statyczny nie zapewni pokojów online.
- Wyślij znajomym adres strony i kod pokoju. ChatGPT ani jego konto nie są potrzebne w tej wersji.

Przykład na Linux (po rozpakowaniu w folderze gry):

```sh
PORT=3000 DATA_DIR=/var/lib/konstancin PUBLIC_ORIGIN=https://twoja-domena.pl node server.mjs
```

Własną domenę/HTTPS i automatyczny restart procesu konfigurujesz na wybranym serwerze. Nie kopiuj domeny przykładowej bez podmiany.

### Alternatywa: Docker

```sh
docker build -t konstancin-game .
docker run -d --name konstancin-game --restart unless-stopped -p 3000:3000 -v konstancin-data:/data konstancin-game
```

Za reverse proxy HTTPS dodaj do `docker run` parametr `-e PUBLIC_ORIGIN=https://twoja-domena.pl`. Dołączony Dockerfile korzysta z gotowego `dist`, więc po zmianach kodu najpierw zbuduj frontend ponownie. Plik Dockerfile został przygotowany, ale obrazu Docker nie uruchamiano podczas przygotowania eksportu.

## 4. Gdzie zmieniać grę

| Plik/folder | Zawartość |
| --- | --- |
| `game/engine.mjs` | Pola planszy (`BOARD`), karty (`EVENTS`), ceny, czynsze i zasady gry, boty |
| `game/rooms.mjs` | Pokoje online, ruchy, synchronizacja i uprawnienia graczy |
| `game/board-layout.mjs` | Rozmieszczenie pól na planszy |
| `app/game.jsx` | Interfejs gry, pionki, okna i obsługa graczy |
| `app/globals.css`, `app/tour.css`, `app/tabletop.css` | Wygląd strony, planszy i paneli |
| `app/board-scene.mjs`, `game/scene-models.mjs` | Plansza, modele 3D i animacje |
| `game/board-camera.mjs` | Stały kadr kamery |
| `app/board-3d.jsx` | Widok planszy i wybieranie pól |
| `public/pawns-3d.png` | Grafika czterech pionków |
| `public/town.png` | Grafika środka planszy |
| `server.mjs` | Niezależny serwer HTTP i adapter SQLite |
| `original-sites/` | Pełny kod pierwotnej wersji Sites, z jej konfiguracją i plikiem blokady zależności |

Po zmianie interfejsu, grafiki lub reguł (reguły są także częścią kodu w przeglądarce):

```sh
npm ci
npm run build
npm start
```

Na Windows, jeśli PowerShell blokuje `npm.ps1`, użyj `npm.cmd ci`, `npm.cmd run build` i `npm.cmd start`, albo terminala CMD. Otwórz terminal w głównym folderze gry, gdzie znajduje się `package.json`.

Do pracy nad interfejsem: w jednym terminalu `node server.mjs`, w drugim `npm run dev`. Otwórz adres Vite wyświetlony w drugim terminalu. Żądania `/api` są przekazywane do serwera na porcie 3000.

## 5. Zapisy i kopie bezpieczeństwa

- Baza pokojów znajduje się domyślnie w `data/konstancin.sqlite`. Serwer tworzy ją sam przy pierwszym uruchomieniu.
- Aby wykonać prostą kopię, zatrzymaj serwer, skopiuj cały folder `data`, a następnie uruchom go ponownie.
- Tokeny do ponownego wejścia do pokoju są zapisane w przeglądarce danego gracza. Wróć z tej samej przeglądarki i pod tym samym adresem strony.
- Lokalne rozgrywki są zapisane w pamięci przeglądarki. Są przypisane do adresu strony; zapis ze strony ChatGPT nie przenosi się automatycznie na nowy adres.
- ZIP nie zawiera aktywnych pokojów, zapisów użytkowników, tokenów sesji ani danych z dotychczasowego hostingu. Nowy serwer zaczyna z pustą bazą.

## 6. Zawartość i sprawdzenie eksportu

Zachowano wszystkie aktualne reguły, nazwy, ceny i karty z wersji źródłowej. Dostosowano sposób uruchamiania strony i zastąpiono Cloudflare D1 lokalnym SQLite. W `original-sites/.openai/hosting.json` usunięto identyfikator istniejącej publikacji, aby eksport nie wskazywał na dotychczasową stronę.

Testy: `npm test`. Sprawdzają m.in. 150 pełnych rozgrywek botów, migrację planszy, zdarzenia, handel, pokoje online oraz nowy serwer HTTP: dwóch graczy, zgodność stanów, brak zgody na cudzy ruch, odrzucenie konfliktu i przywrócenie po restarcie. Sprawdzono także budowanie frontendowego `dist`. Wersji niezależnej nie sprawdzano ręcznie w przeglądarce ani przez publiczny hosting; testy HTTP nie zastępują takiej kontroli wyglądu.

Biblioteki mają własne licencje — zachowano dołączone pliki licencyjne oraz dodano `THIRD-PARTY-NOTICES.txt`. Kod gry można dalej edytować; przy używaniu bibliotek należy zachować ich warunki.

Dokumentacja techniczna: https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html oraz https://vite.dev/guide/build .

## 7. Jak przekazać grę znajomemu do edycji

Wyślij cały ZIP. Znajomy rozpakowuje go i otwiera główny folder w edytorze lub jako projekt w swoim narzędziu AI. Wszystkie aktualne źródła są w paczce; historia rozmowy nie jest potrzebna. Wspólną wersję kodu możecie przechowywać w prywatnym repozytorium GitHub i dodawać siebie jako współpracowników.

Zmiany w tej kopii nie aktualizują automatycznie gry opublikowanej w ChatGPT. Folder `original-sites` zawiera pełne źródła ostatniej publikacji; główny folder zawiera te same zasady i oprawę z serwerem działającym niezależnie od ChatGPT.
