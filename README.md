# 🏥 MedTech – Professional Healthcare Website

A modern, multi-page HTML/CSS/JavaScript website for a healthcare platform featuring AI-powered medical report analysis, intelligent chat assistance, and doctor location services.

## 🚀 Features

### 📄 Multi-Page Structure

* **index.html** – Homepage with hero section and features
* **login.html** – Authentication page with social login options
* **upload.html** – Medical report upload interface (supports 5 report types)
* **chat.html** – GARUN.ai chat interface
* **doctors.html** – Doctor search and booking page

### 🎨 Professional Design

* Modern purple gradient theme
* Glassmorphism effects
* Smooth animations and transitions
* Fully responsive design for all devices
* Professional healthcare-inspired user interface

### ⚡ Interactive Features

* Drag-and-drop file upload
* Real-time chat simulation
* Doctor search with advanced filters
* Geolocation integration
* Form validation and notifications

## 📁 Project Structure

```text
SIH_frontend/
├── index.html              # Homepage
├── login.html              # Login page
├── upload.html             # Report upload page
├── chat.html               # Chat interface
├── doctors.html            # Doctor search page
├── css/
│   ├── style.css           # Main stylesheet
│   ├── login.css           # Login page styles
│   ├── upload.css          # Upload page styles
│   ├── chat.css            # Chat page styles
│   └── doctors.css         # Doctors page styles
├── js/
│   ├── main.js             # Common functionality
│   ├── login.js            # Login page logic
│   ├── upload.js           # Upload functionality
│   ├── chat.js             # Chat interface logic
│   └── doctors.js          # Doctor search logic
└── README.md               # Project documentation
```

## 🛠️ Technologies Used

* **HTML5** – Semantic markup
* **CSS3** – Modern styling with animations
* **JavaScript (ES6+)** – Interactive functionality
* **Font Awesome** – Icons
* **Google Fonts** – Inter font family

## 🚀 How to Run

### **Option 1: Open Directly**

1. Open `index.html` in your preferred web browser.
2. Navigate through the website using the navigation menu.

### **Option 2: Run on a Local Server (Recommended)**

#### Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js

```bash
npx http-server
```

#### Using VS Code Live Server

* Install the **Live Server** extension.
* Right-click on `index.html`.
* Select **Open with Live Server**.

#### Open in Browser

```
http://localhost:8000
```

## 📱 Pages Overview

### 🏠 Homepage (`index.html`)

* Hero section with animated background
* Feature showcase cards
* Statistics section
* Call-to-action buttons

### 🔐 Login Page (`login.html`)

* Two-column layout
* Form validation
* Social login options (Google & Facebook)
* Welcome section with healthcare icons

### 📄 Upload Page (`upload.html`)

Supports uploading:

* Blood Reports
* Kidney Reports
* Liver Reports
* Diabetes Reports
* X-Ray Reports

Features include:

* Drag-and-drop upload
* Progress indicators
* File validation
* File preview

### 🤖 Chat Page (`chat.html`)

* Real-time AI chat interface
* Voice recording simulation
* Quick action buttons
* Chat history sidebar

### 🏥 Doctors Page (`doctors.html`)

* Geolocation-based doctor search
* Advanced filtering options
* Doctor profiles with ratings
* Booking and contact options

## 🎨 Design Features

* Professional purple gradient theme
* Glassmorphism UI effects
* Smooth animations and transitions
* Fully responsive design
* Interactive hover effects and user feedback

## 📋 No Dependencies Required

This project is built using **pure HTML, CSS, and JavaScript**, so no build process or package manager is required.

* ✅ No npm or yarn
* ✅ No React, Vue, or Angular
* ✅ No Webpack or build tools
* ✅ No external dependencies to install
* ✅ Runs directly in any modern web browser

## 🔧 Customization

### Change Theme Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-purple: #8B5CF6;
    --secondary-purple: #A78BFA;
    --accent-green: #10B981;
    --accent-blue: #3B82F6;
}
```

### Modify Content

* Update text directly in the HTML files.
* Replace image URLs as needed.
* Customize animations within the CSS files.

## 🚀 Deployment

### Static Hosting

Deploy easily on platforms such as:

* Netlify
* Vercel
* GitHub Pages
* Firebase Hosting

### Web Servers

The project can also be hosted on:

* Apache
* Nginx
* IIS
* Any standard web hosting provider

## 🔮 Backend Integration

The frontend is ready to integrate with backend services, including:

* File upload APIs
* AI chatbot services
* Medical report analysis
* Doctor database integration
* User authentication
* Geolocation services

## 📞 Support

This is a complete, professional healthcare website that can be used directly or customized according to your project requirements.

---

**MedTech Frontend** – A professional healthcare website built using modern web technologies. 🏥✨
