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
import { getIsFirebaseConfigured, initializeRuntimeConfig } from "./firebaseClient";
import { fetchLoveData, saveLoveData } from "./firebaseService";
import { 
  Heart, 
  Globe, 
  Copy, 
  Share2, 
  LogOut, 
  Check, 
  Info, 
  Phone, 
  Calendar, 
  Clock, 
  Smile, 
  Cloud, 
  CloudOff, 
  Loader2, 
  Sparkles,
  Database,
  X
} from "lucide-react";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"album" | "declaration" | "history" | "plans">("album");
  const [shareUrl, setShareUrl] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPwaTip, setShowPwaTip] = useState(false);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const [isConfigured, setIsConfigured] = useState(getIsFirebaseConfigured());

  // States with localStorage support
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [plans, setPlans] = useState<FuturePlan[]>([]);
  const [declaration, setDeclaration] = useState("");

  // Firebase states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

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
    if (currentUrl.includes("#")) {
      currentUrl = currentUrl.split("#")[0];
    }
    setShareUrl(currentUrl);

    // Initial load and config fetch from Express server
    initializeRuntimeConfig().then((active) => {
      setIsConfigured(active);
    });
  }, []);

  // Fetch from Firebase on Unlock / Page Load if configured
  const syncWithFirebase = async (
    fallbackPhotos?: Photo[], 
    fallbackMilestones?: Milestone[], 
    fallbackPlans?: FuturePlan[], 
    fallbackDeclaration?: string
  ) => {
    if (!isConfigured) return;
    setIsSyncing(true);
    try {
      const dbPayload = await fetchLoveData();
      if (dbPayload) {
        setPhotos(dbPayload.photos);
        setMilestones(dbPayload.milestones);
        setPlans(dbPayload.plans);
        setDeclaration(dbPayload.declaration);

        localStorage.setItem("love_album_photos", JSON.stringify(dbPayload.photos));
        localStorage.setItem("love_album_milestones", JSON.stringify(dbPayload.milestones));
        localStorage.setItem("love_album_plans", JSON.stringify(dbPayload.plans));
        localStorage.setItem("love_album_declaration", dbPayload.declaration);
        setLastSyncTime(new Date().toLocaleTimeString());
        setSyncSuccess(true);
      } else {
        // First sync or collection empty: Push current local values to bootstrap the cloud database
        const pToSave = fallbackPhotos || photos.length ? photos : DEFAULT_PHOTOS;
        const mToSave = fallbackMilestones || milestones.length ? milestones : DEFAULT_MILESTONES;
        const plToSave = fallbackPlans || plans.length ? plans : DEFAULT_FUTURE_PLANS;
        const dToSave = fallbackDeclaration !== undefined ? fallbackDeclaration : (declaration || DEFAULT_DECLARATION);

        const success = await saveLoveData({
          photos: pToSave,
          milestones: mToSave,
          plans: plToSave,
          declaration: dToSave
        });
        if (success) {
          setLastSyncTime(new Date().toLocaleTimeString());
          setSyncSuccess(true);
        } else {
          setSyncSuccess(false);
        }
      }
    } catch (err) {
      console.warn("Error connecting with Firebase", err);
      setSyncSuccess(false);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncSuccess(null), 3500);
    }
  };

  useEffect(() => {
    if (isUnlocked && isConfigured) {
      const savedPhotos = localStorage.getItem("love_album_photos");
      const savedMilestones = localStorage.getItem("love_album_milestones");
      const savedPlans = localStorage.getItem("love_album_plans");
      const savedDecl = localStorage.getItem("love_album_declaration");

      const localPhotos = savedPhotos ? JSON.parse(savedPhotos) : DEFAULT_PHOTOS;
      const localMilestones = savedMilestones ? JSON.parse(savedMilestones) : DEFAULT_MILESTONES;
      const localPlans = savedPlans ? JSON.parse(savedPlans) : DEFAULT_FUTURE_PLANS;
      const localDecl = savedDecl !== null ? savedDecl : DEFAULT_DECLARATION;

      syncWithFirebase(localPhotos, localMilestones, localPlans, localDecl);
    }
  }, [isUnlocked, isConfigured]);

  // Sync states to localStorage and Supabase (write-through cache style)
  const handleUpdatePhotos = async (updated: Photo[]) => {
    setPhotos(updated);
    localStorage.setItem("love_album_photos", JSON.stringify(updated));
    if (isConfigured) {
      setIsSyncing(true);
      try {
        const success = await saveLoveData({
          photos: updated,
          milestones,
          plans,
          declaration
        });
        setSyncSuccess(success);
      } catch (err) {
        console.warn("Failed to update photos to Firebase", err);
        setSyncSuccess(false);
      } finally {
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString());
        setTimeout(() => setSyncSuccess(null), 3000);
      }
    }
  };

  const handleUpdateMilestones = async (updated: Milestone[]) => {
    setMilestones(updated);
    localStorage.setItem("love_album_milestones", JSON.stringify(updated));
    if (isConfigured) {
      setIsSyncing(true);
      try {
        const success = await saveLoveData({
          photos,
          milestones: updated,
          plans,
          declaration
        });
        setSyncSuccess(success);
      } catch (err) {
        console.warn("Failed to update milestones to Firebase", err);
        setSyncSuccess(false);
      } finally {
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString());
        setTimeout(() => setSyncSuccess(null), 3000);
      }
    }
  };

  const handleUpdatePlans = async (updated: FuturePlan[]) => {
    setPlans(updated);
    localStorage.setItem("love_album_plans", JSON.stringify(updated));
    if (isConfigured) {
      setIsSyncing(true);
      try {
        const success = await saveLoveData({
          photos,
          milestones,
          plans: updated,
          declaration
        });
        setSyncSuccess(success);
      } catch (err) {
        console.warn("Failed to update plans to Firebase", err);
        setSyncSuccess(false);
      } finally {
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString());
        setTimeout(() => setSyncSuccess(null), 3000);
      }
    }
  };

  const handleUpdateDeclaration = async (updated: string) => {
    setDeclaration(updated);
    localStorage.setItem("love_album_declaration", updated);
    if (isConfigured) {
      setIsSyncing(true);
      try {
        const success = await saveLoveData({
          photos,
          milestones,
          plans,
          declaration: updated
        });
        setSyncSuccess(success);
      } catch (err) {
        console.warn("Failed to update declaration to Firebase", err);
        setSyncSuccess(false);
      } finally {
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString());
        setTimeout(() => setSyncSuccess(null), 3000);
      }
    }
  };

  // 4. Real-time Love Count Up Clock
  // Dates parsed correctly: Dating starts 25/12/2025 00:00:00
  useEffect(() => {
    const anniversaryDate = new Date("2025-12-25T00:00:00");

    const calculateTime = () => {
      const now = new Date();
      const difference = now.getTime() - anniversaryDate.getTime();

      if (difference <= 0) {
        setTimePassed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

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

  const copyEnvSetup = () => {
    const exampleEnv = `VITE_FIREBASE_API_KEY="SUA_CHAVE_AQUI"
VITE_FIREBASE_PROJECT_ID="SEU_ID_DE_PROJETO"
VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGES_SENDER_ID="SEU_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"`;
    navigator.clipboard.writeText(exampleEnv);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
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

          {/* Sync status & settings controller */}
          <div className="flex items-center gap-2">
            
            {/* Firebase status display */}
            {isConfigured ? (
              <button
                onClick={() => syncWithFirebase()}
                disabled={isSyncing}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold select-none cursor-pointer border transition-colors ${
                  isSyncing
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : syncSuccess === true
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : syncSuccess === false
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-teal-50 hover:bg-teal-100/80 text-teal-700 border-teal-200"
                }`}
                title={isSyncing ? "Sincronizando com Firebase..." : "Conexão com Firebase Ativa. Clique para atualizar!"}
              >
                {isSyncing ? (
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                ) : syncSuccess === true ? (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
                ) : (
                  <Cloud className="w-3 h-3 text-teal-500 fill-teal-100/30" />
                )}
                <span>
                  {isSyncing ? "Sincronizando..." : syncSuccess === true ? "Nuvem Ativa" : syncSuccess === false ? "Erro ao salvar" : "Nuvem Ativa"}
                </span>
                {lastSyncTime && !isSyncing && (
                  <span className="text-[9px] opacity-70 hidden sm:inline">({lastSyncTime})</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowFirebaseGuide(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/50 rounded-full text-xs font-semibold text-rose-700 cursor-pointer transition-colors"
                title="Firebase inativo. Clique para ver instruções de conexão!"
              >
                <CloudOff className="w-3 h-3" />
                <span>Nuvem Inativa</span>
              </button>
            )}

            {/* Logout lock */}
            <button
              onClick={handleLock}
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              title="Bloquear Diário"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
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
        
        {/* Offline notice when Firebase is config but we have an error or offline state */}
        {isConfigured && syncSuccess === false && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-800 shadow-sm animate-fadeIn max-w-md mx-auto text-left">
            <span>⚠️</span>
            <div>
              <p className="font-bold">Modo Offline Ativado Temporariamente</p>
              <p className="opacity-90">Não foi possível conectar à sua nuvem Firebase. Suas alterações estão salvas no celular e sincronizarão assim que a rede voltar!</p>
            </div>
          </div>
        )}

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
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
                <button
                  onClick={() => setShowPwaTip(!showPwaTip)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer font-semibold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Salvar na tela do celular como App (Instruções)</span>
                </button>

                <span className="text-rose-200 hidden sm:inline">|</span>

                <button
                  onClick={() => setShowFirebaseGuide(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-teal-600 hover:text-teal-700 hover:underline cursor-pointer font-semibold transition animate-pulse-slow"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Configurar Sincronização em Nuvem (Firebase)</span>
                </button>
              </div>

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

      {/* Firebase connection guide custom Modal */}
      {showFirebaseGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn" onClick={() => setShowFirebaseGuide(false)}>
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="p-6 border-b border-rose-50 flex justify-between items-center bg-rose-50/30">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-teal-600 animate-pulse-slow" />
                <h3 className="font-serif text-lg font-bold text-rose-950">Conexão com Nuvem Firebase</h3>
              </div>
              <button onClick={() => setShowFirebaseGuide(false)} className="text-gray-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-gray-700 text-xs sm:text-sm text-left">
              <p className="leading-relaxed">
                Adicione sincronização automática em tempo real ao diário! Com o Firebase ativo, qualquer foto enviada ou texto editado no <strong>celular</strong> aparecerá imediatamente no <strong>computador</strong> (e vice-versa).
              </p>

              <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl space-y-2">
                <p className="font-bold text-teal-900 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Benefícios do Firebase Ativo:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-teal-950 text-xs font-medium">
                  <li>Sincronização imediata entre múltiplos telefones e computadores.</li>
                  <li>Dados sempre seguros na coleção <strong>universo_amor</strong> do Firestore de graça.</li>
                  <li>Início de namoro e diário totalmente compartilháveis.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-gray-950 font-serif">Onde configurar suas credenciais do Firebase:</p>
                <p className="text-xs text-gray-500">
                  Crie um projeto no <strong>Firebase Console</strong>, vá nas Configurações do Projeto, adicione um App Web e configure de uma das duas formas abaixo:
                </p>

                <div className="space-y-1 rounded-xl bg-gray-50 p-3.5 border border-rose-100 text-xs">
                  <p className="font-semibold text-rose-900">Opção A: No arquivo local de clientes</p>
                  <p className="text-gray-600">
                    Abra o arquivo <code>/src/firebaseClient.ts</code> no editor de código e cole os dados diretamente nos campos indicados na variável <code>firebaseConfig</code>!
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-rose-900">Opção B: Nas variáveis de ambiente (.env)</p>
                  <p className="text-gray-600">
                    Crie ou edite o arquivo <code>.env</code> na raiz do projeto (ou configure as variáveis na sua plataforma de hospedagem) e adicione as seguintes chaves:
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-3.5 rounded-xl font-mono text-[10px] overflow-x-auto leading-relaxed shadow-inner">
{`VITE_FIREBASE_API_KEY="SUA_API_KEY"
VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
VITE_FIREBASE_AUTH_DOMAIN="SUA_AUTH_DOMAIN"
VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGES_SENDER_ID="SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"`}
                    </pre>
                    <button
                      onClick={copyEnvSetup}
                      className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 text-white hover:text-rose-200 px-2.5 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition-all border border-white/10"
                    >
                      {copiedEnv ? "Copiado!" : "Copiar .env"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-xs text-amber-800 leading-relaxed font-light">
                <strong>💡 Nota:</strong> Se as credenciais estiverem vazias, o aplicativo funciona perfeitamente salvando todos os seus dados localmente no navegador (localStorage). Quando configuradas, ele migra e sincroniza automaticamente pela nuvem!
              </div>

            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-rose-50 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowFirebaseGuide(false)}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer shadow-md transition-colors"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
