# NyxBank Frontend

![NyxBank](https://img.shields.io/badge/NyxBank-Cyberpunk%20Banking-7A00FF)
![Next.js](https://img.shields.io/badge/Next.js-13.x-black)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

A dystopian banking interface built with Next.js, featuring cyberpunk aesthetics, glitch animations, and a dark financial narrative.

## Overview

NyxBank's frontend simulates a futuristic banking system where cryptocurrency, biometric collateral, and AI assistants are commonplace. The UI features neon accents, glassmorphism, and subtle glitch effects to create an unsettling cyberpunk atmosphere.

![NyxBank Screenshot](https://via.placeholder.com/800x400/121020/7A00FF?text=NyxBank+Interface)

## Features

- **Cyberpunk UI**: Glassmorphism cards, neon text effects, and glitch animations
- **Banking Dashboard**: View balances across multiple cryptocurrencies
- **Transaction System**: Send money, view history, and exchange currencies
- **R.E.M. AI Assistant**: Chat with an AI that occasionally reveals disturbing information
- **User Profiles**: Manage account settings and biometric collateral
- **Responsive Design**: Fully functional on mobile and desktop devices

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nyxbank.git
   cd nyxbank/nyxbank-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Mode

The application includes a demo mode that allows you to toggle between logged-in and logged-out states without implementing a full authentication system:

1. When running in development mode, look for the small emoji button (👤/👥) next to the NyxBank logo
2. Click this button to toggle between logged-in and logged-out states
3. The navbar will update to show the appropriate navigation options

This makes it easy to test both states of the application during development.

## Key Pages

- **Home** (`/`): Landing page with service overview
- **Dashboard** (`/dashboard`): Main user interface showing account balances
- **Transactions** (`/transactions`): View and filter transaction history
- **Send Money** (`/send-money`): Transfer funds to other users
- **Exchange** (`/exchange`): Trade between different cryptocurrencies
- **R.E.M. Assistant** (`/ai`): Chat with the AI banking assistant
- **Profile** (`/profile`): Manage account settings and biometric data

## Technologies

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **CSS Modules**: Scoped styling for components
- **ShadCN UI**: Component library with cyberpunk customizations
- **Local Storage**: For demo authentication state persistence

## Project Structure

```
nyxbank-frontend/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── layout/   # Layout components (Navbar, Footer)
│   │   └── ui/       # UI components (Button, Card, Input)
│   ├── pages/        # Next.js pages
│   │   ├── api/      # API routes
│   │   ├── auth/     # Authentication pages
│   │   └── ...       # Other application pages
│   └── styles/       # Global styles and CSS modules
├── .eslintrc.js      # ESLint configuration
├── next.config.js    # Next.js configuration
└── tsconfig.json     # TypeScript configuration
```

## Hidden Features

The application contains several hidden features and easter eggs that hint at the dystopian narrative:

- Glitched messages in the AI assistant
- Redacted transactions in the transaction history
- References to biometric collateral and debt enforcement
- The mysterious "Damnatio Memoriae" protocol (accessible at `/damnatio-memoriae` with the access code `ADMIN-DAMNATIO-9382`)

## Learn More

For more information about the complete NyxBank project, including the backend API and database schema, refer to the main project README.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
