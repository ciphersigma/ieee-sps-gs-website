# IEEE Signal Processing Society Gujarat Chapter Website

A modern, responsive website for the IEEE Signal Processing Society Gujarat Chapter built with React, Vite, Tailwind CSS, and Supabase.

## � Features

- **Modern Design**: Clean, professional UI with dark/light mode
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Built with Vite for lightning-fast development
- **Backend**: Supabase integration for data management
- **SEO Optimized**: Meta tags and structured data
- **Contact Forms**: Working contact forms with email integration

## �️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Email**: EmailJS
- **Animations**: Framer Motion

## � Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## � Environment Setup

Copy `.env.local` and add your credentials:

```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_EMAILJS_SERVICE_ID=your-emailjs-service-id
```

## �️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── pages/          # Page-specific components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
├── utils/              # Utility functions
└── config/             # Configuration files
```

## � Deployment

This project can be deployed to:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

## � License

MIT License - see LICENSE file for details.

## � Contributing

Contributions are welcome! Please read our contributing guidelines.

---

Built with ❤️ by IEEE SPS Gujarat Chapter
