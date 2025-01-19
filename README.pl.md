# Kana Typer 
> Aplikacja webowa do nauki pisowni i czytania pisma japonskiego. \
> README po angielsku [tutaj](README.md)

## Spis treści
- [Informacje Ogólne](#informacje-ogólne)
- [Wykorzystane technologie](#wykorzystane-technologie)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja](#konfiguracja)
- [Użycie](#użycie)
    - [Development](#development)
    - [Budowanie](#budowanie)
    - [Wdrożenie](#wdrożenie)
- [Debugowanie](#debugowanie)
- [Testowanie](#testowanie)
    - [Jednostkowe](#jednostkowe)
    - [Integracyjne](#integracyjne)
    - [Pokrycie](#pokrycie)
- [Wsparcie](#wsparcie)
- [Kontrybucje](#kontrybucje)
- [Autorzy](#autorzy)
- [Status projektu](#status-projektu)

## Informacje Ogólne

Kana Typer to aplikacja do nauki pisania i czytania w języku japońskim. 
Język składa się z hiragany, katakany i kanji, które są zawarte w aplikacji.
Aplikacja umożliwia monitorowanie postępów i dostosowuje pomoc w czytaniu (zwaną furiganą) na podstawie osiągnięć.

Jest to kod źródłowy aplikacji i jest hostowany w usłudze Firebase [tutaj](https://kana-typer.web.app/).

Kod źródłowy jest publikowany jako open-source na podstawie [licencji MIT](LICENSE).

## Wykorzystane Technologie

- HTML5, CSS3 and JS (ECMAScript 2020)
- Node v20.18
- Vite v5.2
- Vitest v1.6
- Eslint v8.57
- React v18.2
- React Router v6.25
- Firebase v10.11
- i18n v23.12
- FontAwesome v6.7

## Struktura Projektu

Katalog główny projektu składa się z plików przepływu pracy w `.github/` i definicji debugera w `.vscode/` do debugowania za pomocą VSCode.

Inne pliki w katalogu głównym projektu dotyczą konfiguracji eslint (`.eslint.rc`), vite (`vite.config.js`) i vitest (`vitest.config.js`), a także konfiguracji specyficznej dla Firebase, czyli ogólnej konfiguracji w `.firebaserc` i wdrożenia/emulacji w `firebase.json`.

Projekt używa zmiennych środowiskowych do przechowywania kluczy API Firebase.

Folder `public/` zawiera ikonę favicon i pliki językowe bilbioteki i18n. Obsługiwane języki to angielski i polski.

Folder źródłowy (`src/`) zawiera cały kod projektu.

Warte uwagi podfoldery źródłowe:
- `components/` - niestandardowe globalne komponenty JSX
- `config/` - pliki konfiguracyjne projketu dla Firebase i i18n
- `context/` - niestandardowe komponenty kontekstu React
- `hooks/` - niestandardowe pliki React Hooks
- `pages/` - struktura stron dla projektu
- `utils/` - lokalne pakiety pomocnicze

## Konfiguracja

Aby skonfigurować i ustawić środowisko, należy najpierw pobrać wszystkie wymagane zależności.

```bash
npm i
```

Następnie należy utworzyć plik `.env`, w którym przechowywane będą klucze API Firebase. Struktura tego pliku powinna wyglądać następująco:

```bash
FIREBASE_API_KEY='<...>'
FIREBASE_AUTH_DOMAIN='<...>'
FIREBASE_PROJECT_ID='<...>'
FIREBASE_STORAGE_BUCKET='<...>'
FIREBASE_MESSAGING_SENDER_ID='<...>'
FIREBASE_APP_ID='<...>'
FIREBASE_MEASUREMENT_ID='<...>'
```

Jeśli nie masz dostępu do zmiennych środowiskowych zespołu Kana Typer, nie będziesz mógł połączyć się z usługami Firebase, a tym samym nie będziesz mógł poprawnie uruchomić aplikacji. W takim przypadku proponuje się utworzenie własnego projektu Firebase i skopiowanie całego wymaganego kodu, ponieważ klucze API tego projektu nie będą nikomu udostępniane.

## Użycie

### Development

Aby uruchomić wersję dev kodu, uruchom poniższe polecenie.

```bash
npm run dev
```

Powinno to uruchomić serwer z aplikacją internetową na `http://localhost:5173`. Przejdź do tego adresu URL, aby potwierdzić, że wszystko działa poprawnie. Aby uzyskać dostęp do niektórych funkcji projektu, musisz zalogować się przy użyciu swojego konta Google, które zostanie zapisane w usłudze Firebase Authentication powiązanej z tym projektem.

### Budowanie

Aby skompilować aplikację do wdrożenia produkcyjnego, uruchom poniższe polecenie.

```bash
npm run build
```

Spowoduje to utworzenie wszystkich plików i spakowanie ich do folderu `dist/`, gdzie będą gotowe do wdrożenia.

### Wdrożenie

Automatyczne wdrażanie jest zintegrowane z procesem Github Actions polegającym na zatwierdzaniu kodu w gałęzi głównej, tj. gałęzi produkcyjnej.

Aby przeprowadzić wdrożenie bez zintegrowanego przepływu pracy Firebase, najpierw sprawdź, czy kod wdrożenia działa poprawnie po skompilowaniu.

```bash
npm ci
npm run build
firebase hosting:channel:deploy
```

Spowoduje to utworzenie kanału podglądu (Preview Channel) w celu zweryfikowania wszelkich zmian, które zostaną wprowadzone. Gdy wszystko będzie wyglądać dobrze, uruchom poniższe polecenie, aby wdrożyć kod do usługi Firebase Hosting.

```bash
firebase deploy
```

## Debugowanie

Aby debugować aplikację, możesz uruchomić skrypty debugera konfiguracji w VSCode. Przejdź do zakładki debugowania w VSCode lub naciśnij `CTRL+SHIFT+D`, wybierz przeglądarkę, w której chcesz debugować (obecnie obsługiwane są Firefox i Chrome) i naciśnij `Uruchom` lub `F5`.

Spowoduje to utworzenie nowego, prywatnego okna debugera. Jeśli jest puste, upewnij się, że możesz przejść do właściwego adresu URL projektu, który został utworzony.

## Testowanie

### Jednostkowe

Aby uruchomić testy jednostkowe wystarczy uruchomić poniższy kod.

```bash
npm run test
```

Spowoduje to uruchomienie modułu vitest i podczas wprowadzania zmian w grupach kontrolnych moduł zostanie ponownie załadowany.

### Integracyjne

Testy integracyjne nie zostały w pełni zaimplementowane, lecz możesz użyć tego, co jest dostępne i bazować na tym rozbudowę własnego kodu wedle własnych wymagań

Najpierw należy uruchomić poniższy kod, aby zainicjować emulator Firestore.

```bash
firebase emulators:start --only firestore
```

Następnie wyedytuj plik testowy firestore spośród wykluczonych plików vitest.

```js
...
exclude: [
    ...configDefaults.exclude,
    'src/tests/firestore.test.js',
],
```

Na koniec otwórz nowy terminal i uruchom poniższy kod.

```bash
npm run test:integration
```

Powinny zostać wyświetlone pozytywne testy dostępu do bazy danych emulatora Firestore.

### Pokrycie

Aby wygenerować pokrycie testowe, uruchom poniższe polecenie.

```bash
npm run coverage
```

Spowoduje to wygenerowanie tabeli pokrycia w konsoli przy użyciu `v8`.

Zostanie utworzony folder `coverage/`, w którym znajduje się strona pokrycia HTML wygenerowana przy użyciu `istanbul`.

## Wsparcie

Jeśli masz jakiekolwiek problemy dotyczące kodu, skontaktuj się z naszym zespołem, wysyłając wiadomość na adresy e-mail podane w sekcji [Autorzy] (#autorzy) lub dodając nowe zgłoszenie w Github Issues.

## Kontrybucje

Na chwilę obecną nie akceptujemy żadnych kontrybucji, ale może się to zmienić w przyszłości.

W przypadku jakichkolwiek problemów, błędów lub propozycji, prosimy o skorzystanie z Github Issues.

## Autorzy

| Imię i nazwisko  | Indeks uniwersytetu | Kontaktowy adres email |
|:-----------------|:--------------------|------------------------|
| Cezary Ciślak    | s25429              | s25429@pjwstk.edu.pl   |
| Weronika Szydlik | s24301              | s24301@pjwstk.edu.pl   |
| Alicja Wieloch   | s24274              | s24274@pjwstk.edu.pl   |

## Status Projektu

Projekt nie jest uważany za w pełni ukończony w wyznaczonym terminie, ale autorzy będą nad nim powoli pracować w wolnym czasie, chociaż wsparcie i aktualizacje nie będą pojawiać się często.
