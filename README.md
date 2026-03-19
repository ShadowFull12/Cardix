<div align="center">

# ✨ Cardix

### Your Digital Identity, Reimagined

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Cardix** is a premium digital business card platform that lets you create, customize, and share your professional identity through a beautiful QR-enabled card. Built with modern web technologies and a stunning glassmorphic dark UI.

---

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Environment Variables](#-environment-variables)

</div>

---

## 🚀 Features

### Core
| Feature | Description |
|---------|-------------|
| 🎨 **Card Builder** | Drag-and-drop editor with live preview. Customize layout order, accent colors, and card background |
| 📇 **Horizontal Business Card** | Wide, modern card layout with avatar, contact pills, and social links |
| 🔐 **Privacy Controls** | Toggle email, phone, and location visibility from Settings |
| 📱 **QR Code Identity** | Colorful branded QR codes via [quickchart.io](https://quickchart.io) that auto-match your card theme |
| 🔗 **Smart Sharing** | Share your card as Full Profile, Minimal, or Contact Only — each with unique filtered views |
| ⏳ **Temporary Links** | Create time-limited share links that auto-expire (15, 30, or 60 min) |

### Vault & Notes
| Feature | Description |
|---------|-------------|
| 📁 **Personal Vault** | Cloud file storage via Cloudinary with 500 MB free tier limit |
| 📊 **Usage Tracker** | Visual progress bar showing storage consumption against limits |
| 📝 **Rich Notes Editor** | Google Keep-style notes with bold, italic, headings, checklists, inline images, and color-coding |
| 🔄 **Cross-Device Sync** | Notes and files sync across all logged-in devices via Firestore |

### Premium & Monetization
| Feature | Description |
|---------|-------------|
| 💎 **Tiered Plans** | Free, Pro ($5/mo), and Business ($15/mo) with progressive feature unlocks |
| 🔒 **Analytics Paywall** | Detailed analytics behind a Pro paywall with blurred preview for free users |
| ⭐ **Pro Badge** | Golden badge on profile avatar and sidebar for paid subscribers |
| ⚙️ **Tier Management** | Current plan display in Settings with one-click upgrade flow |

### User Experience
| Feature | Description |
|---------|-------------|
| 🧭 **Guided Onboarding** | 5-step wizard: Welcome → Template → Customize → Profile → Preview |
| 📸 **QR Scanner** | Built-in camera scanner to scan other Cardix QR codes |
| 🌐 **Responsive Design** | Desktop sidebar + mobile bottom nav with animated active indicators |
| 🎭 **8 Card Templates** | Modern, Business, Creator, Developer, Minimal, Sunset, Ocean, Neon |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Styling** | Tailwind CSS 4 + Glassmorphism |
| **Auth** | Firebase Authentication (Google + Email/Password) |
| **Database** | Cloud Firestore |
| **File Storage** | Cloudinary (unsigned uploads) |
| **QR Generation** | [quickchart.io](https://quickchart.io) API |
| **Animations** | Framer Motion |
| **Drag & Drop** | @dnd-kit |
| **Icons** | React Icons (Feather) |
| **QR Scanner** | html5-qrcode |
| **Notifications** | React Hot Toast |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Firebase](https://console.firebase.google.com) project with Auth + Firestore enabled
- A [Cloudinary](https://cloudinary.com) account with an unsigned upload preset

### Installation

```bash
# Clone the repository
git clone https://github.com/ShadowFull12/Cardix.git
cd Cardix

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're ready to go!

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

> ⚠️ **Never commit your `.env.local` file.** It's already in `.gitignore`.

---

## 📁 Project Structure

```
Cardix/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (app)/               # Authenticated layout group
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── vault/           # Personal vault (files + notes)
│   │   │   ├── card/preview/    # Card builder (drag & drop + design)
│   │   │   ├── analytics/       # Analytics (Pro paywall)
│   │   │   ├── pro/             # Pricing & upgrade page
│   │   │   ├── scan/            # QR code scanner
│   │   │   ├── profile/         # Profile editor
│   │   │   ├── network/         # Saved contacts network
│   │   │   └── settings/        # Account & privacy settings
│   │   ├── card/[username]/     # Public card route (dynamic)
│   │   ├── share/[shareId]/     # Temporary share links
│   │   ├── onboarding/          # Guided onboarding wizard
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── components/
│   │   ├── card/                # PublicCard component
│   │   ├── dashboard/           # AnalyticsCard, QRDisplay
│   │   ├── layout/              # Sidebar, MobileNav
│   │   ├── profile/             # ShareDialog
│   │   ├── qr/                  # BrandedQR (quickchart.io)
│   │   ├── ui/                  # GlassCard, Skeletons
│   │   └── vault/               # PersonalVault, NotesEditor
│   ├── contexts/                # AuthContext (Firebase)
│   └── lib/                     # Firebase, Firestore, Cloudinary, Sharing utils
├── public/                      # Static assets & manifest
├── .env.local                   # Environment variables (not committed)
└── package.json
```

---

## 🎨 Card Customization

Cardix cards are fully customizable through the onboarding flow and the **Card Editor**:

| Option | Choices |
|--------|---------|
| **Templates** | Modern, Business, Creator, Developer, Minimal, Sunset, Ocean, Neon |
| **Accent Colors** | 12 presets + custom color picker |
| **Card Background** | 6 dark-mode backgrounds |
| **Layout Order** | Drag and drop: Header, Contact, Socials |

---

## 📊 Pricing Tiers

| Feature | Free | Pro ($5/mo) | Business ($15/mo) |
|---------|:----:|:-----------:|:------------------:|
| Digital Card | ✅ | ✅ | ✅ |
| QR Code | ✅ | ✅ | ✅ |
| Card Themes | ✅ | ✅ | ✅ |
| Vault Storage | 500 MB | 10 GB | 100 GB |
| Rich Notes | ✅ | ✅ | ✅ |
| Smart Sharing | ✅ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Custom Domain | ❌ | ❌ | ✅ |
| Team Management | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy — auto-builds on every push

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- **Netlify** — with `@netlify/plugin-nextjs`
- **Railway** / **Render** — via Docker or `npm run build && npm start`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using Next.js, Firebase, and Cloudinary**

[⬆ Back to Top](#-cardix)

</div>
