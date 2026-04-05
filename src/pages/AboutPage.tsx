import { Mail, Info, ArrowLeft, Heart, Coffee } from "lucide-react";
import googlePayQR from "../assets/GooglePay_QR.jpg";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-4">
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Info size={14} />
            About the Project
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          creditwise.ly
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          A sleek offline-first tool designed to help you manage your credit cards, track expenses, 
          and hit your AMC waiver limits with confidence!
        </p>
      </header>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-bold text-white">The Purpose</h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            Credit cards often have different billing cycles and varying AMC waiver logic. By centralizing
            all your expenses into a completely offline, fast dashboard, you can maximize limit usage and never miss a payment.
          </p>
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white">Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Dynamic Limit Dashboard",
                "AMC Waiver Tracking",
                "Expense & Payment Logs",
                "IndexedDB Offline Storage"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </section>

      <section className="text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Meet the Creator</h2>
          <p className="text-slate-400">Crafted with passion and precision.</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-white">SG</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-red-500 shadow-lg">
              <Heart size={14} fill="currentColor" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">Sahasrangshu Guha</h3>
            <p className="text-blue-400 font-medium">Software Engineer & Enthusiast</p>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/sguha-work" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all group"
            >
              GitHub
            </a>
            <a 
              href="mailto:sguha1988.life@gmail.com"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all group"
            >
              <Mail size={20} className="group-hover:text-white" />
              Email
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 rounded-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest">
            <Coffee size={14} />
            Support the Project
          </div>
          <h2 className="text-2xl font-bold text-white">Buy Me a Coffee ☕</h2>
          <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
            If you find creditwise.ly useful and want to support my work, consider buying me a cup of hot filter coffee!
            Scan the QR code to pay via UPI.
          </p>

          <a
            href="upi://pay?pa=sguha1988.life@okicici&pn=sahasrangshuguha&am=15&cu=INR"
            className="inline-block"
          >
            <div className="relative mx-auto w-fit group">
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl p-3 shadow-2xl">
                <img
                  src={googlePayQR}
                  alt="Google Pay QR Code – UPI ID: sguha1988.life@okicici"
                  className="w-52 h-52 object-contain rounded-xl"
                />
              </div>
            </div>
          </a>
        </div>
      </section>

      <div className="pt-8 text-center pb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
