# CRM System with Quotation Management

A Vue.js-based CRM system for managing clients, items, quotations, and company information.

## Features

- Client Management
- Item Catalog
- Quotation Generation and Management
- Company Information Management
- PDF Generation for Quotations
- Firebase Integration for Data Storage

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Firebase Account

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/gauravitis/CRMV2.git
   cd CRMV2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your Firebase credentials

4. Firebase Configuration:
   - Create a new project in Firebase Console
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to the `.env` file

5. Start the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

## Project Structure

- `/src/components/` - Vue components
- `/src/services/` - Firebase and other service integrations
- `/src/store/` - Vuex store modules
- `/src/assets/` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 