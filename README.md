# HBBDB - Breach Detection & Tracking Platform

A comprehensive web application for detecting, tracking and managing potential security breaches and compromised credentials. Built with Gadget.dev, this platform provides real-time monitoring and enrichment of breach data.

![Gadget](https://img.shields.io/badge/gadget-1.3.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-61dafb)
![Node](https://img.shields.io/badge/node-v20-green)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🔐 **User Authentication System**
  - Email/password authentication with email verification
  - Role-based access control
  - Session management
  - Password reset functionality

- 🔍 **Breach Record Management**
  - Track URLs, credentials, and domain information
  - Monitor accessibility and resolution status
  - Tag and categorize breaches
  - Track login form details and security measures

- 🤖 **Automated Enrichment**
  - Background processing of breach records
  - Domain and IP analysis
  - Automated status updates
  - Bulk data processing

- 📤 **File Upload Support**
  - Secure file upload functionality
  - Process uploaded breach data
  - Support for bulk imports


## Tech Stack

- **Backend Framework**: [Gadget.dev](https://gadget.dev) - Serverless TypeScript/JavaScript platform
- **Frontend**: React 18 with hooks-based components
- **API**: Auto-generated GraphQL API with TypeScript client
- **Database**: Managed PostgreSQL (provided by Gadget)
- **Authentication**: Built-in Gadget user authentication system
- **Hosting**: Automatic deployment via Gadget platform
