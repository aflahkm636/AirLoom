 AirLoom - Field Operations Management System

AirLoom is a comprehensive management platform designed to streamline field operations, service tasks, and customer complaints. Built with a modern tech stack, it provides a robust solution for managing technicians, inventory, subscriptions, and billing.

## 🚀 Key Features

- **Role-Based Access Control**: Secure modules for Admin, Staff, Technicians, and Customers.
- **Task & Complaint Management**: End-to-end workflow for tracking field tasks and resolving customer issues.
- **Inventory Management**: Real-time tracking of products, materials, and usage.
- **Subscription & Billing**: Automated billing engine with discount support and customer portals.
- **Clean Architecture**: Backend following decoupled, maintainable standards.
- **Responsive UI**: Modern dashboard built with Ant Design and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **UI Components**: Ant Design (v6)
- **State Management**: Redux Toolkit
- **Notifications**: SweetAlert2
- **Authentication**: JWT (Redux-persisted)

### Backend
- **Framework**: .NET 8 Web API
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Database**: SQL Server + Entity Framework Core
- **Cloud Integration**: Cloudinary (Image Management)
- **Services**: SMTP Email Integration, JWT Authentication

## 📂 Project Structure

- `Fiels_Ops/`: .NET Clean Architecture backend source code.
- `airloom-frontend/`: React/Vite frontend source code.

## ⚙️ Quick Setup

### Prerequisites
- .NET 8 SDK
- SQL Server

### Backend Setup
1. Navigate to `Fiels_Ops/`.
2. Update `appsettings.json` with your Connection String and Cloudinary keys.
3. Run migrations and start the server:
   ```bash
   dotnet run --project Field_Ops.WebApi
   ```

### Frontend Setup
1. Navigate to `airloom-frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---
*Created for portfolio display and organizational management.*
