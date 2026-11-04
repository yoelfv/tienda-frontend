Cubaclick – Online Store

A full-stack e-commerce application built with Astro, React, TypeScript, and Strapi. The platform provides a product catalog, shopping cart, checkout workflow, and WhatsApp-based order submission.

Project Overview

Cubaclick is an online store designed to provide customers with a straightforward shopping experience while allowing the business to manage its products, categories, orders, and related information through a centralized backend.

The frontend communicates with a Strapi API shared with a separate business management application.

Key Features

    Product Catalog: Displays products organized into categories.

    Category Navigation: Browse and filter products by category.

    Product Images: Safe image rendering and image preview functionality.

    Shopping Cart: Add products, update quantities, remove items, and manage cart contents.

    Persistent Cart: Shopping cart data is stored locally in the browser.

    Checkout Workflow: Collects sender information and delivery details.

    Order Summary: Displays the order information before submission.

    Cart Validation: Checks cart information during checkout.

    WhatsApp Integration: Generates a formatted order message and opens WhatsApp so the customer can send the order to the seller.

    Responsive Interface: Designed to provide a consistent shopping experience across different screen sizes.

Technology Stack

Frontend

    Astro 6

    React 19

    TypeScript 6

    HTML5 and CSS3

Development Tools

    Node.js 22.12 or later

    npm

    ESLint

    Prettier

Backend Integration

    Strapi

    REST API

    Cloudinary for product image storage

Architecture

The application uses a component-based architecture, separating the main responsibilities into reusable components, hooks, services, utilities, and TypeScript types.

The frontend connects to a centralized Strapi backend that also supports a separate business management application.

Related repository:

tienda-backend – Strapi Backend

Project Structure

src/
├── components/
│ ├── checkout/
│ ├── shop/
│ └── ui/
├── constants/
├── hooks/
├── layouts/
├── pages/
├── services/
├── store/
├── styles/
├── types/
└── utils/

Getting Started

Prerequisites

    Node.js 22.12 or later

    npm

    Access to a running Strapi backend

Installation

Clone the repository:

git clone https://github.com/yoelfv/tienda-frontend.git
cd tienda-frontend

Install dependencies:

npm install

Configure the frontend API connection using the appropriate environment variables.

Start the development server:

npm run dev

Build the production version:

npm run build

Preview the production build locally:

npm run preview

Deployment

The frontend is deployed using Cloudflare Pages, while the Strapi backend runs on Railway.

Developer

Designed and developed as a full-stack web application, demonstrating practical experience in frontend development, API integration, component architecture, database-backed applications, and e-commerce workflows.
