# Vora - AI Wellness Coach Landing Page

An ultra-premium landing page for Vora, an AI wellness assistant app. Built with Next.js 14, TypeScript, Supabase, and cutting-edge animations.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** Supabase
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP, React Three Fiber
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel

## ✨ Features

- 🎨 World-class design with glassmorphism and gradient effects
- 🎬 Advanced animations and 3D elements
- 📱 Fully responsive mobile-first design
- 🔒 Privacy-focused with Supabase integration
- ⚡ Optimized performance (95+ Lighthouse score)
- 🎯 Waitlist system with real-time counter
- 🌙 Dark mode aesthetic

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd vora-landing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Supabase Setup

1. Create a new Supabase project
2. Run this SQL in the SQL editor:

```sql
-- Create waitlist table
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  referral_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  position INTEGER GENERATED ALWAYS AS IDENTITY
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for the public to join waitlist)
CREATE POLICY "Allow public to insert into waitlist" 
ON waitlist FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading count (optional, for displaying waitlist size)
CREATE POLICY "Allow public to read waitlist count" 
ON waitlist FOR SELECT 
USING (true);

-- Create an index for faster email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Create an index for position ordering
CREATE INDEX idx_waitlist_position ON waitlist(position);
```

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Environment Variables for Vercel

Add these environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🎨 Customization

### Colors
Edit the color scheme in `tailwind.config.ts` and `app/globals.css`

### Copy
Update the copy throughout the components in `/components/sections/`

### Animations
Modify animation settings in:
- `/lib/animations.ts` - Framer Motion variants
- `/components/ui/` - Individual component animations

## 📊 Performance Optimization

The site is optimized for:
- **Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score:** 95+ Performance
- **Accessibility:** WCAG 2.1 AA compliant
- **SEO:** Full meta tags and structured data

## 🔧 Troubleshooting

### Common Issues

1. **3D Components not loading:**
   - Ensure WebGL is enabled in your browser
   - Check console for Three.js errors

2. **Supabase connection issues:**
   - Verify your environment variables
   - Check Supabase project status

3. **Build errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## 📝 License

© 2024 Vora. All rights reserved.

## 🤝 Support

For issues or questions, please open an issue on GitHub or contact support@vora.ai
