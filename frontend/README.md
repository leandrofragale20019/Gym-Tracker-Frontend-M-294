# Gym-Tracker Frontend

Ein Angular-basiertes Frontend zur Verwaltung von Fitnessstudio-Daten mit einer Benutzeroberfläche für Mitglieder, Übungen, Trainer und Trainingspläne.

## Verwendete Technologien
- **Angular 21** – Standalone Components, Signals, Zoneless Change Detection
- **Node.js 24** – Laufzeitumgebung und Build-Toolchain
- **Angular Material** – UI-Komponentenbibliothek (Icons, Dialoge)
- **angular-oauth2-oidc** – OAuth2 Implicit Flow / Keycloak Integration
- **Keycloak** – Identity Provider, Realm `ILV`, Port 8080
- **@ngx-translate** – Internationalisierung (de_CH / en)
- **RxJS** – Reaktive HTTP-Kommunikation
- **TypeScript** – Strict Mode
- **ESLint** + **@angular-eslint** – Linting inkl. Template-Accessibility-Regeln
- **Vitest** – Unit-Test-Framework

## Projektstruktur
Die Anwendung ist modular aufgebaut und enthält zentrale UI- und Authentifizierungs-Komponenten:
- `src/app/components`: Wiederverwendbare UI-Komponenten wie Header, Login und Dialoge.
- `src/app/pages`: Seiten für Dashboard, Listen und Detailansichten.
- `src/app/service`: Services für Authentifizierung, Header-Handling und Datenzugriff (Mitglieder, Trainer, Übungen, Trainingspläne).
- `src/app/interceptor`: HTTP-Interceptor für Bearer-Token und CSRF-Schutz.
- `src/app/guard`: Authentifizierungs-Guard für geschützte Routen.
- `src/app/dataaccess`: Typdefinitionen für Datenobjekte.
- `src/environments`: Umgebungs-spezifische Konfigurationen für Entwicklung und Produktion.
- `proxy.conf.json`: Proxy-Konfiguration für die lokale Backend-Anbindung.

## Komponenten

### Shared / Shell
| Komponente | Pfad | Beschreibung |
|---|---|---|
| `AppComponent` | `app.component` | Root-Komponente; enthält Header und `<router-outlet>` |
| `AppHeaderComponent` | `components/app-header` | Sticky Navigationsleiste mit aktiven Links, Benutzer-Badge und Logout-Button; nur sichtbar wenn eingeloggt |
| `AppLoginComponent` | `components/app-login` | Login-Seite mit Logo und Keycloak-Redirect-Button |
| `CallbackComponent` | `pages/callback` | OAuth2-Callback-Handler; liest `access_token` aus dem URL-Fragment und speichert ihn in `sessionStorage` |
| `NoAccessComponent` | `pages/no-access` | Fehlerseite für fehlende Rollen; zeigt Login wenn kein Token vorhanden |

### Seiten
| Komponente | Pfad | Beschreibung |
|---|---|---|
| `DashboardComponent` | `pages/dashboard` | Übersichtsseite mit 4 Statistik-Widgets (Trainingspläne, Übungen, Trainer, Mitglieder); Mitglieder-Widget nur für Admins |
| `MemberListComponent` | `pages/member-list` | Tabelle aller Mitglieder mit Inline-Formular zum Erstellen und Bearbeiten; nur für `ROLE_UPDATE` |
| `ExerciseListComponent` | `pages/exercise-list` | Übungskatalog als Karten-Grid mit Echtzeit-Suche und Muskelgruppen-Filter; Bearbeiten/Löschen nur für Admins |
| `ExerciseDetailComponent` | `pages/exercise-detail` | Formularseite zum Erstellen oder Bearbeiten einer Übung (Name, Muskelgruppe, Beschreibung); nur für `ROLE_UPDATE` |
| `TrainerListComponent` | `pages/trainer-list` | Trainer-Cards mit Avatar, Spezialisierungsbadge und Suchfeld; Erstellen/Bearbeiten/Löschen nur für Admins |
| `WorkoutPlanListComponent` | `pages/workout-plan-list` | Trainingsplan-Tabelle links, Detailvorschau der Übungen rechts; Auswahl per Radio-Button oder Klick |
| `WorkoutPlanDetailComponent` | `pages/workout-plan-detail` | Formularseite mit Titel, Mitglied-Dropdown und dynamischer Übungs-Tabelle (Sätze/Wiederholungen); nur für `ROLE_UPDATE` |

## Voraussetzungen
Stellen Sie sicher, dass die folgenden Komponenten installiert und konfiguriert sind:
* **Node.js** (empfohlen aktuelle LTS-Version)
* **npm**
* **Angular CLI** (optional, falls nicht über `npm start` verwendet)
* **Keycloak** (Port 8080)
* **Backend** des Gym-Tracker, idealerweise lokal auf Port 8081

## Konfiguration
Die Anwendung ist standardmäßig auf Port **4200** konfiguriert.

Die wichtigsten Einstellungen finden Sie in:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/app/app.config.ts`
- `proxy.conf.json`

### Backend-Verbindung
- In der Entwicklungsumgebung wird das Backend über den Proxy auf `http://localhost:8081` angesprochen.
- `src/environments/environment.ts` setzt `backendBaseUrl` auf `/api/`.
- `src/environments/environment.prod.ts` verwendet `http://localhost:9090/api/`.

### API-Endpunkte (Entwicklung)
| Ressource | URL |
|---|---|
| Mitglieder | `http://localhost:8081/api/members` |
| Übungen | `http://localhost:8081/api/exercises` |
| Trainer | `http://localhost:8081/api/trainers` |
| Trainingspläne | `http://localhost:8081/api/workout-plans` |

### Datenbank
Das Backend verwendet eine PostgreSQL-Datenbank mit folgenden Standardeinstellungen:
- **Datenbankname:** `m-295-demo`
- **Port:** `5432`
- **Host:** `localhost`

### Keycloak Setup
* **Realm:** `ILV`
* **Issuer URI:** `http://localhost:8080/realms/ILV`
* **Client ID:** `gym-tracker-frontend`
* **Redirect URI:** `http://localhost:4200/callback`
* **Flow:** Implicit Flow (`response_type=token`)
* **Erforderliche Rollen:** Erstellen Sie im Keycloak die Rollen `READ` und `UPDATE` (als Client-Rollen unter `gym-tracker-frontend`).

## Starten der Anwendung
1. Navigieren Sie in das Frontend-Verzeichnis:
    ```bash
    cd frontend/frontend
    ```
2. Installieren Sie die Abhängigkeiten:
    ```bash
    npm install
    ```
3. Starten Sie die Anwendung:
    ```bash
    npm start
    ```
4. Öffnen Sie das Frontend im Browser unter:
    ```bash
    http://localhost:4200
    ```

## API Integration
Das Frontend kommuniziert mit dem Backend über den Pfad `/api/`.
In der Entwicklung wird diese Verbindung über `proxy.conf.json` zu `http://localhost:8081` weitergeleitet.

## Sicherheit & Rollen
Die UI ist mit OAuth2 / Keycloak abgesichert.
* **ROLE_READ:** Erlaubt den Lesezugriff auf Listen- und Detailseiten.
* **ROLE_UPDATE:** Erlaubt Aktionen zum Erstellen, Ändern und Löschen von Ressourcen.

### Rollenberechtigungen im Detail

| Seite | READ | UPDATE (Admin) |
|---|---|---|
| Dashboard | Eigene Pläne, Übungen, Trainer | + Mitglieder-Widget sichtbar |
| Übungskatalog | Alle Übungen ansehen, suchen, filtern | + Neue Übung erstellen, bearbeiten, löschen |
| Übung Detail | — | Erstellen / Bearbeiten |
| Trainer | Alle Trainer ansehen, suchen | + Neuen Trainer erfassen, bearbeiten, löschen |
| Trainingspläne | Eigene Pläne ansehen und auswählen | + Neuen Plan erstellen, bearbeiten, löschen; alle Mitglieder-Pläne sichtbar |
| Trainingsplan Detail | — | Erstellen / Bearbeiten mit Übungs-Editor |
| Mitglieder | Kein Zugriff | Vollständige CRUD-Verwaltung |

### Token-Verarbeitung
Der Access Token wird nach dem Keycloak-Login aus dem URL-Fragment (`#access_token=...`) gelesen, in `sessionStorage` gespeichert und über den `HttpBearerInterceptor` als `Authorization: Bearer`-Header an alle Backend-Requests angehängt. Rollen werden direkt aus dem JWT-Payload (`resource_access['gym-tracker-backend'].roles`) gelesen.

## Github 
 `https://github.com/leandrofragale20019/Gym-Tracker-Frontend-M-294
    `

## Autor: Leandro Fragale
Modul: 295
