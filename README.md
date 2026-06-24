# FIFA World Cup 2026 – Information Portal

🇩🇪 German version available [here](README_de.md)

## Project Description

This project was developed as part of the **132 WEB – Web Development** course at Worms University of Applied Sciences.

The application provides a modern information portal for the **2026 FIFA World Cup**. Visitors can read the latest news, view the complete match schedule, follow live match updates, and submit their own predictions for upcoming matches.

The website was built using **HTML5**, **CSS3**, and **JavaScript (ES6 Modules)** and integrates external APIs to dynamically provide tournament data.

---

## Features

### Home Page

- Overview of the 2026 FIFA World Cup

- Countdown to the Final

- Latest news section

- Overview of the host countries: United States, Canada, and Mexico

- Group stage overview

- Tournament statistics

### Match Schedule

- Dynamically loaded match information

- Categorized into:
  
  - Live Matches
  
  - Upcoming Matches
  
  - Finished Matches

- Displays:
  
  - Teams
  
  - Match scores
  
  - Venues
  
  - Kick-off times

- Personal prediction system with browser-based storage using LocalStorage

### News

- Retrieves the latest World Cup news through the ESPN API

- Dynamic generation of news cards

- SEO-optimized news page

### Live Ticker

- Automatic updates every 15 seconds

- Displays ongoing and recently finished matches

- Compact overview of the most important live match events

### Responsive Design

- Optimized for desktop, tablet, and mobile devices

- Implemented using CSS Grid and Flexbox

- Modern user interface focused on usability and accessibility

---

## Technologies Used

- HTML5

- CSS3

- JavaScript (ES6)

- CSS Grid

- Flexbox

- Font Awesome

- LocalStorage

- REST APIs

---

## APIs Used

### ESPN News API

Provides the latest news related to the FIFA World Cup.

### World Cup 2026 API

Used for:

- Teams

- Match Schedule

- Stadiums

- Live Match Information

---

## Project Structure

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

### Clone the Repository

```bash
git clone https://github.com/ToniF03/webdev-projektarbeit-fifawm-26.git
```

### Open the Project Directory

```bash
cd webdev-projektarbeit-fifawm-26
```

### Start a Local Web Server

Using VS Code:

```text
Open with Live Server
```

or with Python:

```bash
python -m http.server 8000
```

### Open the Application

```text
http://localhost:8000
```

---

## Learning Objectives

This project demonstrates the practical application of:

- Semantic HTML5

- Modern CSS with Grid and Flexbox

- Dynamic DOM manipulation

- API integration using the Fetch API

- Modular JavaScript development

- Responsive web design

- Search Engine Optimization (SEO)

- Client-side data persistence using LocalStorage

---

## Authors

- Toni Fey

---

## License

This project was created exclusively for educational and demonstration purposes as part of a university course project.

External data sources and content remain subject to the respective terms and conditions of the APIs used.
