# FIFA WM 2026 – Informationsportal

## Projektbeschreibung

Dieses Projekt entstand im Rahmen des Moduls **132 WEB - Webentwicklung** an der Hochschule Worms.

Die Anwendung stellt ein modernes Informationsportal zur **FIFA Fußball-Weltmeisterschaft 2026** bereit. Besucher können aktuelle Nachrichten lesen, den vollständigen Spielplan einsehen, Live-Spielstände verfolgen und eigene Ergebnistipps für kommende Spiele abgeben.

Die Webseite wurde mit **HTML5**, **CSS3** und **JavaScript (ES6 Modules)** entwickelt und nutzt externe APIs zur dynamischen Bereitstellung von Turnierdaten.

---

## Funktionen

### Startseite

* Übersicht zur FIFA WM 2026
* Countdown bis zum Finale
* Anzeige aktueller Nachrichten
* Übersicht der Gastgeberländer USA, Kanada und Mexiko
* Darstellung der Gruppenphase
* Turnierstatistiken

### Spielplan

* Dynamisch geladene Spielinformationen

* Unterteilung in:
  
  * Live-Spiele
  * Bevorstehende Spiele
  * Beendete Spiele

* Anzeige von:
  
  * Teams
  * Spielständen
  * Austragungsorten
  * Anstoßzeiten

* Persönliches Tippsystem mit Speicherung im Browser (LocalStorage)

### News

* Abruf aktueller WM-Nachrichten über die ESPN API
* Dynamische Generierung von News-Karten
* SEO-optimierte Unterseite für Nachrichten

### Liveticker

* Automatische Aktualisierung alle 15 Sekunden
* Anzeige laufender und kürzlich beendeter Spiele
* Kompakte Live-Übersicht der wichtigsten Spielereignisse

### Responsive Design

* Optimiert für Desktop, Tablet und Smartphone
* Umsetzung mit CSS Grid und Flexbox
* Moderne Benutzeroberfläche mit Fokus auf Benutzerfreundlichkeit

---

## Verwendete Technologien

* HTML5
* CSS3
* JavaScript (ES6)
* CSS Grid
* Flexbox
* Font Awesome
* LocalStorage
* REST APIs

---

## Verwendete APIs

### ESPN News API

Liefert aktuelle Nachrichten rund um die FIFA Weltmeisterschaft.

### World Cup 2026 API

Wird verwendet für:

* Teams
* Spielplan
* Stadien
* Live-Spielinformationen

---

## Projektstruktur

```text
project/
│
├── index.html
│
├── src/
│   ├── assets/
│   │   ├── banner.png
│   │   ├── favicon.png
│   │   ├── usnyc-banner.png
│   │   ├── mxmex-banner.png
│   │   └── cator-banner.png
│   │
│   ├── css/
│   │   ├── stylesheet.css
│   │   └── spielplan.css
│   │
│   ├── html/
│   │   ├── spielplan.html
│   │   ├── newsPage.html
│   │   └── liveticker.html
│   │
│   └── js/
│       ├── main/
│       │   ├── app.js
│       │   └── liveticker.js
│       │
│       └── lib/
│           └── utility/
│               └── constants.js
```

---

## Installation

### Repository klonen

```bash
git clone https://github.com/ToniF03/webdev-projektarbeit-fifawm-26.git
```

### Projektverzeichnis öffnen

```bash
cd webdev-projektarbeit-fifawm-26
```

### Lokalen Webserver starten

Mit VS Code:

```text
Open with Live Server
```

oder mit Python:

```bash
python -m http.server 8000
```

### Anwendung öffnen

```text
http://localhost:8000
```

---

## Lernziele des Projekts

Dieses Projekt demonstriert die praktische Anwendung von:

* Semantischem HTML5
* Modernem CSS mit Grid und Flexbox
* Dynamischer DOM-Manipulation
* API-Anbindung mittels Fetch API
* Modularer JavaScript-Entwicklung
* Responsive Webdesign
* Suchmaschinenoptimierung (SEO)
* Clientseitiger Datenspeicherung mit LocalStorage

---

## Autoren

* Toni Fey
* [Finn Konrad](https://www.google.com)

---

## Lizenz

Dieses Projekt wurde ausschließlich zu Lehr- und Demonstrationszwecken im Rahmen eines Hochschulprojekts erstellt.

Externe Datenquellen und Inhalte unterliegen den jeweiligen Nutzungsbedingungen der verwendeten APIs.
