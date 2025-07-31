import './globals.css';
import { Inter } from 'next/font/google';
import { Jomhuria } from 'next/font/google';
import AuthProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jomhuria = Jomhuria({ weight: '400', subsets: ['latin'], variable: '--font-jomhuria' });

export const metadata = {
  title: 'GitWise',
  description: 'Decode GitHub faster',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jomhuria.variable}`}>
      <body className="bg-[#080810] font-sans text-white relative overflow-x-hidden">

        {/* 🔹 Scrollable Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/Group 2.svg"
            alt="Background"
            className="w-full h-full object-cover opacity-100 saturate-[1.6] contrast-[1.3] brightness-[1.15] mt-[-150px]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* ✅ Wrap Navbar + main content inside AuthProvider */}
        <AuthProvider>
          {/* 🔸 Navbar */}
          <Navbar />

          {/* 🔸 Page Content */}
          <main className="relative z-10 min-h-[80vh]">
            {children}
          </main>
        </AuthProvider>

        {/* 🔸 Footer stays outside, no session needed */}
        <Footer />
        
      </body>
    </html>
  );
}
