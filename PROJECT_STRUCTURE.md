# Kumbhar Bazar - Project Structure Documentation

This document provides a comprehensive overview of the organized project structure for the Kumbhar Bazar pottery marketplace.

## Directory Organization

```
Kumbhar_Bzar/
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Pages deployment workflow
├── src/                        # Source code directory
│   ├── assets/                 # Static assets
│   │   ├── css/                # Stylesheets
│   │   │   └── styles.css      # Main stylesheet with pottery-themed design
│   │   └── images/             # All image assets for products and UI
│   ├── components/             # Reusable UI components (future expansion)
│   ├── pages/                  # Individual page files
│   │   ├── dashboard.html      # User dashboard for order tracking
│   │   ├── form.html           # Contact form page
│   │   └── payment.html        # Payment processing page
│   └── services/               # Backend and JavaScript services
│       └── js/                 # JavaScript files
│           ├── script.js       # Main client-side JavaScript for interactivity
│           ├── server.js       # Express server for handling form submissions
│           └── simple-server.js# Simple HTTP server for development
├── .dockerignore               # Docker ignore file
├── .gitignore                  # Git ignore file
├── index.html                  # Main landing page
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── start_server.bat            # Windows batch file to start server
├── README.md                   # Project documentation
├── dependencies.md             # Detailed dependency documentation
└── LICENSE                     # MIT License file
```

## File Organization Summary

### Core HTML Files
- **index.html**: Main landing page containing all primary sections
- **src/pages/dashboard.html**: User dashboard for viewing order history
- **src/pages/form.html**: Contact form page
- **src/pages/payment.html**: Secure payment processing page

### Styling
- **src/assets/css/styles.css**: Comprehensive stylesheet with pottery-themed design, animations, and responsive layouts

### JavaScript Services
- **src/services/js/script.js**: Main client-side JavaScript handling interactivity, theme switching, cart functionality, and UI animations
- **src/services/js/server.js**: Express.js backend server for form processing and email notifications
- **src/services/js/simple-server.js**: Lightweight HTTP server for development purposes

### Assets
- **src/assets/images/**: Complete collection of product images, UI elements, and brand assets

### Configuration Files
- **package.json**: Project metadata, dependencies, and npm scripts
- **.gitignore**: Git ignore patterns for version control
- **.dockerignore**: Docker ignore patterns
- **start_server.bat**: Windows batch script for easy server startup

### Documentation
- **README.md**: Comprehensive project documentation with flowchart and usage instructions
- **dependencies.md**: Detailed breakdown of project dependencies
- **LICENSE**: MIT License file

## Key Improvements Made

1. **Structured Directory Organization**: Files organized into logical directories (assets, pages, services) for better maintainability
2. **Updated File References**: All HTML files updated with correct relative paths to reflect new directory structure
3. **Comprehensive Documentation**: Detailed README with flowchart, project overview, and usage instructions
4. **Complete Project Structure Documentation**: Separate PROJECT_STRUCTURE.md file for detailed directory information
5. **License File**: Added MIT License for proper open-source licensing

## Path References Updated

All internal file references have been updated to maintain proper linking:
- CSS references updated from `css/styles.css` to `src/assets/css/styles.css`
- JavaScript references updated from `js/script.js` to `src/services/js/script.js`
- Image references updated to use `src/assets/images/` paths
- Navigation links updated to maintain proper page-to-page linking

This organization improves code maintainability, makes the project structure more intuitive for new developers, and ensures all file references are correctly maintained.