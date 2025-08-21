# WebCraft AI - React Frontend Code Generator

## Overview

WebCraft AI is a full-stack web application that helps developers generate React components and code from design inputs. Users can upload design mockups, provide descriptions, and get AI-generated React components with Tailwind CSS styling. The application features a modern dashboard interface with real-time chat functionality, design input management, and code preview capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18** using **TypeScript** and **Vite** as the build tool. The architecture follows a component-based design with:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers

The frontend uses a modern design system with support for both light and dark themes, implementing a comprehensive set of UI components including forms, dialogs, navigation menus, and data visualization components.

### Backend Architecture
The backend is built with **Express.js** and **TypeScript**, following a RESTful API design:

- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Uploads**: Multer middleware for handling multipart/form-data
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: Hot reload with Vite integration in development mode

The server implements a clean separation of concerns with dedicated modules for routing, storage abstraction, and external service integration.

### Database Schema Design
The application uses **PostgreSQL** with the following core entities:

- **Users**: Authentication and user management
- **Projects**: Container for user's development projects with framework selection and progress tracking
- **Conversations**: Chat history and AI interactions per project
- **Design Inputs**: Storage for design descriptions, Figma links, screenshots, and target components

The schema supports JSON storage for flexible data like chat messages, codebase representations, and component metadata.

### AI Integration Architecture
The application integrates with **OpenAI's GPT-4** API for multiple AI-powered features:

- **Code Analysis**: Analyze existing codebases to extract component information
- **Code Generation**: Generate React components from design descriptions and visual inputs
- **Conversational AI**: Interactive chat interface for development guidance
- **Design Analysis**: Process uploaded images and Figma links to understand design requirements

The AI service layer abstracts OpenAI API calls and provides structured responses for different use cases.

### Storage Abstraction Layer
The application implements a storage interface pattern that allows for different storage backends:

- **Development**: In-memory storage with sample data for rapid development
- **Production**: Full PostgreSQL integration via Drizzle ORM
- **Interface Design**: Clean separation allows easy switching between storage implementations

This approach enables development without database dependencies while maintaining production data persistence.

### Development Workflow
The project uses a monorepo structure with shared TypeScript types and schemas:

- **Shared Schema**: Drizzle schemas and Zod validation shared between frontend and backend
- **Type Safety**: End-to-end TypeScript with strict compilation settings
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development Server**: Integrated development experience with HMR and API proxy

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with excellent TypeScript integration
- **@tanstack/react-query**: Powerful data fetching and caching library for React applications

### UI and Design Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives (20+ components)
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Modern icon library with consistent design language

### Development and Build Tools
- **vite**: Next-generation frontend build tool with HMR and optimized bundling
- **typescript**: Static type checking and enhanced developer experience
- **esbuild**: Fast JavaScript/TypeScript bundler for backend compilation

### AI and External Services
- **OpenAI API**: GPT-4 integration for code generation, analysis, and conversational features
- **Figma API**: Integration capability for processing design links and extracting design tokens

### Form and Data Handling
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Resolvers for various validation libraries
- **zod**: TypeScript-first schema validation library
- **multer**: File upload handling middleware for Express

### Session and Security
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session management middleware with persistent storage