/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, Heart, Edit3, Check, RefreshCw } from "lucide-react";

interface DeclarationSectionProps {
  declarationText: string;
  onSave: (newText: string) => void;
}

export default function DeclarationSection({ declarationText, onSave }: DeclarationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(declarationText);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onSave(editText);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const resetToDefault = () => {
    if (confirm("Deseja restaurar a declaração original padrão? Isso substituirá suas edições locais.")) {
      const defaultText = `Meu amor,

Desde o dia 25/12/2025, a minha vida ganhou cores muito mais vibrantes e o meu coração encontrou um porto seguro de pura cumplicidade. Olhar para cada foto nossa é lembrar da leveza do teu sorriso, do aconchego do teu abraço e do carinho incomparável que dividimos em cada momento juntos.

Você é a pessoa que transforma os dias mais simples em memórias eternas. Amo nossa sintonia, amo como vibramos juntos pelo nosso Flamengo, amo o seu abraço sob a água, o beijo roubado no elevador e todo e qualquer instante no qual nossos olhares se encontram.

Prometo cuidar de você, caminhar ao seu lado nos momentos fáceis e difíceis, e continuar construindo uma história linda e cheia de respeito. Esse aplicativo é apenas um pedacinho físico do infinito que quero viver com você.

Com todo o amor do mundo, para sempre,
Seu amor. ❤️`;
      setEditText(defaultText);
      onSave(defaultText);
    }
  };

  return (
    <div id="declaration-container" className="space-y-6 max-w-2xl mx-auto">
      
      {/* Visual Love Letter style panel */}
      <div className="bg-white/80 rounded-3xl shadow-xl border border-rose-100 overflow-hidden relative">
        {/* Subtle decorative banner */}
        <div className="bg-gradient-to-r from-rose-400 to-rose-300 h-2 w-full" />
        
        <div className="p-6 sm:p-10 relative">
          
          {/* Decorative stamp/heart */}
          <div className="absolute right-6 top-8 w-12 h-12 border-2 border-dashed border-rose-300 rounded-full flex items-center justify-center text-rose-400/70 font-serif text-xs font-bold rotate-12 select-none pointer-events-none">
            AMOR
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-300 stroke-rose-500 animate-pulse-slow" />
              <h2 className="font-serif text-xl font-bold text-rose-900 tracking-tight">Carta de Amor</h2>
            </div>
            
            <div id="deck-buttons" className="flex items-center space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-600 cursor-pointer flex items-center gap-1.5 text-xs font-medium transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={resetToDefault}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-400 cursor-pointer flex items-center gap-1.5 text-xs transition-all"
                    title="Restaurar padrão"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-rose-500 text-white px-3 py-1.5 rounded-xl hover:bg-rose-600 text-xs font-semibold flex items-center gap-1.5 shadow-sm transform active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </button>
              )}
            </div>
          </div>

          {/* Letter Body text area */}
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full min-h-[300px] border border-rose-200 outline-none p-5 rounded-2xl bg-rose-50/20 text-gray-800 leading-relaxed font-sans focus:ring-2 focus:ring-rose-400 text-sm focus:bg-white transition-all shadow-inner"
                rows={12}
                placeholder="Escreva sua declaração de amor aqui..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditText(declarationText);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-rose-600 flex items-center gap-1.5 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Salvar Declaração
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {/* Splendid luxury handwriting style */}
              <div className="font-handwritten text-[23px] sm:text-[27px] leading-relaxed text-rose-950 font-normal whitespace-pre-wrap px-1 select-text selection:bg-rose-200 text-left">
                {declarationText}
              </div>
            </div>
          )}

          {/* Succeeded toast */}
          {saveSuccess && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-md transition-opacity duration-300 animate-bounce flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>Salvo nos arquivos do amor com sucesso!</span>
            </div>
          )}
        </div>
      </div>

      {/* Sweet quote card */}
      <div className="p-5 bg-gradient-to-r from-rose-100 to-rose-200 rounded-2xl border border-rose-200 text-center text-xs sm:text-sm italic font-medium text-rose-800 max-w-md mx-auto shadow-sm">
        "O amor não se mede pelo tempo que passamos juntos, mas sim pelos momentos inesquecíveis que construímos em cada olhar." 💕
      </div>
    </div>
  );
}
