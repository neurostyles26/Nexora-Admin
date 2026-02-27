# Nexora Admin

**"El núcleo inteligente que conecta tu negocio en tiempo real."**

Nexora Admin is a high-performance, multi-tenant SaaS platform designed for professional business management. From retail to clinics, Nexora provides real-time analytics, inventory control, and seamless integrations.

## 🚀 Vision
Nexora stems from *Nexus* (connection) + *Ora* (now). It represents a central hub for intelligent business operations.

## 🛠 Tech Stack
- **Frontend:** Vue 3 (Composition API), Vite, PWA, Tailwind CSS, Pinia.
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, RLS).
- **Integrations:** Google Sheets Sync (Edge Functions), Microsoft Power BI.

## 🏗 Architecture
- **Multi-tenant isolation:** enforced at the database level via PostgreSQL Row Level Security (RLS).
- **Responsive design:** Mobile-first PWA with elegant glassmorphism aesthetics.
- **Scalability:** Modular folder structure for views, stores, and services.

## 📂 Folder Structure
```
/src
  /assets         # Styles, images
  /components     # Reusable UI components
  /composables    # Shared logic
  /layouts        # Page layouts (Glassmorphism)
  /router         # Navigation
  /services       # Supabase/API clients
  /stores         # Pinia state
  /views          # Page components
/supabase
  /migrations     # SQL Schema & RLS
  /functions      # Edge Functions (Google Sheets sync)
```

## 📊 Integrations
### Power BI
Nexora connects to Supabase PostgreSQL for live reporting. Use the direct connection string in Power BI Desktop to build custom dashboards.

### Google Sheets
Sync data automatically using our built-in OAuth2 flow and Supabase Edge Functions.

---
*Created with Nexora Core. All rights reserved.*
