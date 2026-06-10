/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, Heart, ToggleLeft } from "lucide-react";

interface AccessScreenProps {
  onUnlock: () => void;
}

export default function AccessScreen({ onUnlock }: AccessScreenProps) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isShake, setIsShake] = useState(false);

  // Generates positions for decorative hearts
  const backgroundHearts = [
    { left: "10%", top: "15%", delay: "0s", size: "1.5rem" },
    { left: "85%", top: "10%", delay: "1.5s", size: "2rem" },
    { left: "45%", top: "8%", delay: "3s", size: "1rem" },
    { left: "75%", top: "80%", delay: "2s", size: "1.8rem" },
    { left: "15%", top: "75%", delay: "4s", size: "1.2rem" },
    { left: "80%", top: "45%", delay: "0.5s", size: "1rem" },
    { left: "5%", top: "40%", delay: "2.5s", size: "1.6rem" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = "25122025";
    
    // Clean spaces
    if (password.trim() === correctPassword) {
      onUnlock();
    } else {
      setErrorMsg("Hum... essa não é a nossa data especial. Pense com carinho! 🥺💕");
      setIsShake(true);
      setTimeout(() => {
        setIsShake(false);
      }, 500);
    }
  };

  return (
    <div id="access-screen-container" className="min-h-screen relative overflow-hidden bg-gradient-to-tr from-rose-50 via-rose-100 to-rose-50 flex flex-col justify-center items-center px-4 py-8">
      
      {/* Dynamic Floating Background Hearts */}
      {backgroundHearts.map((h, idx) => (
        <div
          key={idx}
          className="absolute text-rose-300 animate-float-slow pointer-events-none opacity-40"
          style={{
            left: h.left,
            top: h.top,
            animationDelay: h.delay,
            fontSize: h.size,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Main Container Card */}
      <div
        id="access-card"
        className={`w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-rose-100 text-center transition-all duration-300 ${
          isShake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        {/* Heart logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-rose-200 blur-sm opacity-70 animate-pulse"></span>
            <div className="relative bg-rose-100 text-rose-500 p-4 rounded-full">
              <Heart className="w-8 h-8 fill-rose-400 stroke-rose-500 animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Display Typography */}
        <h1 className="font-serif text-3xl font-bold text-rose-900 tracking-tight mb-2">
          Nosso Espaço
        </h1>
        
        <p className="font-handwritten text-2xl text-rose-500 mb-6 font-medium">
          "Onde nossa história é eterna"
        </p>

        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Para entrar em nosso diário particular, digite a data que mudou nossas vidas (DDMMAAAA):
        </p>

        {/* Password input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              id="password-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(""); // Clear error when typing
              }}
              placeholder="Digite a senha..."
              className="w-full bg-rose-50/50 hover:bg-rose-50 border border-rose-200 text-gray-800 rounded-2xl py-4.5 px-12 text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all font-mono"
            />
            <Lock className="w-5 h-5 text-rose-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Adorable Error messages */}
          {errorMsg && (
            <p className="text-rose-600 text-xs font-medium px-2 py-1 bg-rose-50 rounded-lg border border-rose-100 transition-opacity animate-pulse">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            id="login-button"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-4 px-6 rounded-2xl shadow-md space-x-2 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-200 transform active:scale-95 text-base"
          >
            <Heart className="w-4.5 h-4.5 fill-white stroke-none" />
            <span>Entrar com Amor</span>
          </button>
        </form>

        {/* Hint footer */}
        <div className="mt-8 text-[11px] text-rose-400/80 italic font-medium">
          Dica: É um momento muito feliz de 2025! ❤️
        </div>
      </div>
    </div>
  );
}
