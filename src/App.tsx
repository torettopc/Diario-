/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import AccessScreen from "./components/AccessScreen";
import PhotoAlbumSection from "./components/PhotoAlbumSection";
import DeclarationSection from "./components/DeclarationSection";
import TimelineSection from "./components/TimelineSection";
import PlansSection from "./components/PlansSection";
import { Photo, Milestone, FuturePlan } from "./types";
import { 
  DEFAULT_PHOTOS, 
  DEFAULT_MILESTONES, 
  DEFAULT_FUTURE_PLANS, 
  DEFAULT_DECLARATION 
} from "./data";
import { Heart, Globe, Copy, Share2, LogOut, Check, Info, Phone, Calendar, Clock, Smile } from "lucide-react";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"album" | "declaration" | "history" | "plans">("album");
  const [shareUrl, setShareUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPwaTip, setShowPwaTip] = useState(false);

  // States with localStorage support
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [plans, setPlans] = useState<FuturePlan[]>([]);
  const [declaration, setDeclaration] = useState("");

  // Counter clock states
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 1. Check if already unlocked locally
    const savedUnlock = localStorage.getItem("isLoveUnlocked");
    if (savedUnlock === "true") {
      setIsUnlocked(true);
    }

    // 2. Load custom data from localStorage or default
    const savedPhotos = localStorage.getItem("love_album_photos");
    const savedMilestones = localStorage.getItem("love_album_milestones");
    const savedPlans = localStorage.getItem("love_album_plans");
    const savedDecl = localStorage.getItem("love_album_declaration");

    const loadedPhotos: Photo[] = savedPhotos ? JSON.parse(savedPhotos) : DEFAULT_PHOTOS;
    const migratedPhotos = loadedPhotos.map((p) => {
      if (p.id === "photo_1" && p.title === "Amor com o Manto Sagrado ❤️🖤") {
        return { ...p, title: "Nossa primeira foto juntos ❤️" };
      }
      if (p.id === "photo_3" && p.title === "Beijo Sob a Água 💦") {
        return { ...p, title: "Amor que vai além do beijo ❤️" };
      }
      return p;
    });
    setPhotos(migratedPhotos);
    if (savedPhotos) {
      const hasOldPhoto1 = JSON.parse(savedPhotos).some((p: any) => p.id === "photo_1" && p.title === "Amor com o Manto Sagrado ❤️🖤");
      const hasOldPhoto3 = JSON.parse(savedPhotos).some((p: any) => p.id === "photo_3" && p.title === "Beijo Sob a Água 💦");
      if (hasOldPhoto1 || hasOldPhoto3) {
        localStorage.setItem("love_album_photos", JSON.stringify(migratedPhotos));
      }
    }
    setMilestones(savedMilestones ? JSON.parse(savedMilestones) : DEFAULT_MILESTONES);
    setPlans(savedPlans ? JSON.parse(savedPlans) : DEFAULT_FUTURE_PLANS);
    setDeclaration(savedDecl !== null ? savedDecl : DEFAULT_DECLARATION);

    // 3. Set up sharing link
    let currentUrl = window.location.href;
    // Strip hashtags or routes if needed
    if (currentUrl.includes("#")) {
      currentUrl = currentUrl.split("#")[0];
    }
    setShareUrl(currentUrl);
  }, []);

  // Sync states to localStorage
  const handleUpdatePhotos = (updated: Photo[]) => {
    setPhotos(updated);
    localStorage.setItem("love_album_photos", JSON.stringify(updated));
  };

  const handleUpdateMilestones = (updated: Milestone[]) => {
    setMilestones(updated);
    localStorage.setItem("love_album_milestones", JSON.stringify(updated));
  };

  const handleUpdatePlans = (updated: FuturePlan[]) => {
    setPlans(updated);
    localStorage.setItem("love_album_plans", JSON.stringify(updated));
  };

  const handleUpdateDeclaration = (updated: string) => {
    setDeclaration(updated);
    localStorage.setItem("love_album_declaration", updated);
  };

  // 4. Real-time Love Count Up Clock
  // Dates parsed correctly: Dating starts 25/12/2025 00:00:00
  useEffect(() => {
    const anniversaryDate = new Date("2025-12-25T00:00:00");

    const calculateTime = () => {
      const now = new Date();
      const difference = now.getTime() - anniversaryDate.getTime();

      if (difference <= 0) {
        // Fallback for dates before start time or error
        setTimePassed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Exact mathematical calculation
      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      setTimePassed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("isLoveUnlocked", "true");
  };

  const handleLock = () => {
    if (confirm("Deseja sair do diário particular por agora? ❤️")) {
      setIsUnlocked(false);
      localStorage.removeItem("isLoveUnlocked");
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isUnlocked) {
    return <AccessScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col justify-between font-sans selection:bg-rose-200">
      
      {/* 1. TOP HEADER BRAND AND TIME COUNT */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 py-4 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 text-rose-500 p-2.5 rounded-full animate-pulse-slow">
              <Heart className="w-5 h-5 fill-rose-400 stroke-none" />
            </div>
            <div className="text-left">
              <h1 className="font-serif text-lg font-bold text-rose-900 leading-tight">Nosso Universo</h1>
              <p className="font-handwritten text-lg text-rose-500 leading-none">Desde 25/12/2025</p>
            </div>
          </div>

          {/* Time Counter display */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-rose-50 to-rose-100/80 px-4 py-2 rounded-2xl border border-rose-100/70 shadow-sm max-w-full">
            <Clock className="w-4 h-4 text-rose-500 animate-spin-[spin_10s_linear_infinite] flex-shrink-0" />
            
            <div className="flex items-center space-x-1.5 text-rose-950 font-bold font-mono text-xs sm:text-sm">
              <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{timePassed.days}d</span>
              <span className="text-rose-400 font-sans font-normal text-[10px]">e</span>
              <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{timePassed.hours}h</span>
              <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{timePassed.minutes}m</span>
              <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded border border-rose-100">{timePassed.seconds}s</span>
              <span className="text-rose-700 font-sans font-semibold text-[10px] ml-1 uppercase animate-pulse">juntos</span>
            </div>
          </div>

          {/* Logout lock */}
          <button
            onClick={handleLock}
            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer self-end md:self-auto"
            title="Bloquear Diário"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. TAB MENU BAR (Fully Mobile responsive view tabs) */}
      <nav id="viewport-nav" className="bg-white border-b border-rose-50 py-2 sm:py-3 px-4 shadow-sm sticky top-[73px] md:top-[69px] z-30">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          
          <button
            onClick={() => setActiveTab("album")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "album"
                ? "bg-rose-50 text-rose-600 font-bold scale-105"
                : "text-gray-500 hover:text-rose-500 hover:bg-rose-50/20"
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1 filter drop-shadow-sm">📸</span>
            <span className="text-[10px] sm:text-xs tracking-tight font-medium">Álbum</span>
          </button>

          <button
            onClick={() => setActiveTab("declaration")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "declaration"
                ? "bg-rose-50 text-rose-600 font-bold scale-105"
                : "text-gray-500 hover:text-rose-500 hover:bg-rose-50/20"
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1 filter drop-shadow-sm">💌</span>
            <span className="text-[10px] sm:text-xs tracking-tight font-medium">Declaração</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "history"
                ? "bg-rose-50 text-rose-600 font-bold scale-105"
                : "text-gray-500 hover:text-rose-500 hover:bg-rose-50/20"
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1 filter drop-shadow-sm">📖</span>
            <span className="text-[10px] sm:text-xs tracking-tight font-medium">História</span>
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
              activeTab === "plans"
                ? "bg-rose-50 text-rose-600 font-bold scale-105"
                : "text-gray-500 hover:text-rose-500 hover:bg-rose-50/20"
            }`}
          >
            <span className="text-xl sm:text-2xl mb-1 filter drop-shadow-sm">✨</span>
            <span className="text-[10px] sm:text-xs tracking-tight font-medium">Planos</span>
          </button>

        </div>
      </nav>

      {/* 3. DYNAMIC CONTENT CANVAS */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {activeTab === "album" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-2 mb-4">
              <h2 className="font-serif text-3xl font-bold text-rose-950">Nosso Álbum de Recordações</h2>
              <p className="text-gray-600 text-sm italic max-w-lg mx-auto">
                Espaço dedicado para momentos especiais que contam nossa história!
              </p>
            </div>
            
            <PhotoAlbumSection 
              photos={photos} 
              onUpdatePhoto={handleUpdatePhotos} 
            />
          </div>
        )}

        {activeTab === "declaration" && (
          <div className="animate-fadeIn">
            <DeclarationSection 
              declarationText={declaration} 
              onSave={handleUpdateDeclaration} 
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="animate-fadeIn">
            <TimelineSection 
              milestones={milestones} 
              onUpdateMilestones={handleUpdateMilestones} 
            />
          </div>
        )}

        {activeTab === "plans" && (
          <div className="animate-fadeIn">
            <PlansSection 
              plans={plans} 
              onUpdatePlans={handleUpdatePlans} 
            />
          </div>
        )}
      </main>

      {/* 4. FOOTER: QR CODE, SHARING TOOLS AND DEVICE ADAPTATION */}
      <footer className="bg-white border-t border-rose-100 py-10 px-6 mt-12 shadow-inner text-center">
        <div className="max-w-xl mx-auto space-y-8">
          
          {/* Main Sharing and QR Code panel */}
          <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100/80 flex flex-col items-center gap-6 shadow-sm">
            
            <div className="space-y-1 text-center">
              <h3 className="font-serif font-bold text-rose-950 text-base flex items-center justify-center gap-1.5">
                <Share2 className="w-4 h-4 text-rose-500" />
                Compartilhe Nosso Cantinho
              </h3>
              <p className="text-gray-500 text-xs">
                Escaneie o QR Code abaixo para abrir diretamente do celular!
              </p>
            </div>

            {/* Live QR Code Generator via online QR API */}
            {shareUrl && (
              <div className="bg-white p-3.5 rounded-2xl shadow-md border border-rose-100 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=9F1239&bgcolor=FFFFFF&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code do Aplicativo"
                  className="w-40 h-40 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Explicit link and click to Copy tool */}
            <div className="w-full max-w-sm space-y-2">
              <div className="flex bg-white border border-rose-200 rounded-xl overflow-hidden shadow-inner pl-3">
                <span className="text-xs text-gray-400 select-all truncate flex-1 leading-10 pr-2">
                  {shareUrl}
                </span>
                
                <button
                  onClick={copyShareLink}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 leading-10 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mobile app install shortcut button trigger */}
              <button
                onClick={() => setShowPwaTip(!showPwaTip)}
                className="inline-flex items-center gap-1.5 text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Salvar na tela do celular como App (Instruções)</span>
              </button>

              {/* Install PWA Tutorial */}
              {showPwaTip && (
                <div className="p-4 bg-white rounded-2xl border border-rose-100 text-left text-xs text-gray-600 space-y-2.5 mt-2 shadow-inner animate-fadeIn">
                  <p className="font-bold text-rose-900 border-b border-rose-50 pb-1.5 flex items-center gap-1">
                    <Smile className="w-4 h-4 text-rose-500" />
                    Como adicionar este app na tela inicial do celular:
                  </p>
                  
                  <div className="space-y-1.5 pl-1">
                    <p>
                      <strong>No Safari do iPhone (iOS):</strong> toque no ícone de <strong className="text-rose-700">Compartilhar</strong> (ícone do quadradinho com seta para cima) e selecione <strong className="text-rose-700">"Adicionar à Tela de Início"</strong>.
                    </p>
                    <p>
                      <strong>No Chrome do Android:</strong> toque nos <strong className="text-rose-700">três pontinhos</strong> no canto superior direito e selecione <strong className="text-rose-700">"Adicionar à tela inicial"</strong> ou <strong className="text-rose-700">"Instalar aplicativo"</strong>.
                    </p>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 italic">
                    Ao fazer isso, ele ganha um ícone próprio e abre em tela cheia idêntico a um aplicativo instalado de loja!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Simple instructions metadata on Hosting */}
          <div className="space-y-2 border-t border-rose-100/80 pt-6">
            <h4 className="text-xs font-bold text-rose-900 flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-rose-500" />
              Guia Rápido de Acesso e Hospedagem
            </h4>
            <div className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
              <p>Este aplicativo é totalmente estático e autônomo na nuvem.</p>
              <p className="mt-1">
                <strong>Para Hospedar:</strong> Você pode exportar este código ou fazer deploy para qualquer plataforma estática rápida (como Vercel, Netlify ou GitHub Pages) de forma 100% gratuita!
              </p>
            </div>
            
            <p className="text-[10px] text-rose-400 font-medium">
              Feito com todo o carinho do mundo para eternizar cada sorriso de vocês. ❤️
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
