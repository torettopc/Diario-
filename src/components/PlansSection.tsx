/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FuturePlan } from "../types";
import { CheckSquare, Square, Plus, Trash2, Heart, Award, Star, Compass, Home as HomeIcon, Check } from "lucide-react";

interface PlansSectionProps {
  plans: FuturePlan[];
  onUpdatePlans: (updatedPlans: FuturePlan[]) => void;
}

export default function PlansSection({ plans, onUpdatePlans }: PlansSectionProps) {
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState<"viagem" | "casa" | "lazer" | "outro">("viagem");

  // Calculates completion stats
  const total = plans.length;
  const completedCount = plans.filter((p) => p.completed).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleToggle = (id: string) => {
    const updated = plans.map((p) => {
      if (p.id === id) {
        return { ...p, completed: !p.completed };
      }
      return p;
    });
    onUpdatePlans(updated);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const added: FuturePlan = {
      id: "plan_" + Date.now().toString(),
      text: newText.trim(),
      completed: false,
      category: newCat
    };

    onUpdatePlans([...plans, added]);
    setNewText("");
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid checklist toggles
    const updated = plans.filter((p) => p.id !== id);
    onUpdatePlans(updated);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "viagem":
        return <Compass className="w-4 h-4 text-emerald-500" />;
      case "casa":
        return <HomeIcon className="w-4 h-4 text-indigo-500" />;
      case "lazer":
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-300" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "viagem": return "Viagens";
      case "casa": return "Lar & Futuro";
      case "lazer": return "Lazer & Encontros";
      default: return "Outros Sonhos";
    }
  };

  return (
    <div id="plans-section" className="space-y-6 max-w-xl mx-auto py-2">
      
      {/* Visual Header and statistics progress */}
      <div className="bg-white/80 rounded-3xl p-6 border border-rose-100 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-rose-500 fill-rose-100 animate-pulse-slow" />
            <h3 className="font-serif text-lg font-bold text-rose-900">Nosso Pote de Sonhos</h3>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 font-mono">
            {completedCount} de {total} realizados
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-500 font-semibold px-0.5">
            <span>Progresso da nossa caminhada</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-rose-50 rounded-full h-3 border border-rose-100 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {plans.map((p) => (
          <div
            key={p.id}
            id={`plan-item-${p.id}`}
            onClick={() => handleToggle(p.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
              p.completed
                ? "bg-rose-50/40 border-rose-100/50 opacity-70"
                : "bg-white border-rose-100 hover:border-rose-200 shadow-sm"
            }`}
          >
            {/* Left elements: Checkbox and title */}
            <div className="flex items-center space-x-3.5 flex-1 pr-4 text-left">
              <div className="flex-shrink-0">
                {p.completed ? (
                  <div className="bg-rose-500 text-white p-0.5 rounded-lg">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-lg border-2 border-rose-200 group-hover:border-rose-400 transition-colors" />
                )}
              </div>

              <div className="space-y-1">
                <p className={`text-xs sm:text-sm font-medium ${
                  p.completed ? "line-through text-gray-400 font-normal" : "text-gray-800"
                }`}>
                  {p.text}
                </p>
                <div className="flex items-center space-x-1.5 text-[9px] text-gray-400 font-semibold uppercase">
                  {getCategoryIcon(p.category)}
                  <span>{getCategoryLabel(p.category)}</span>
                </div>
              </div>
            </div>

            {/* Right delete action */}
            <button
              onClick={(e) => handleDeletePlan(p.id, e)}
              className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir Plano"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {total === 0 && (
          <p className="text-center text-xs text-gray-400 py-6">Nenhum plano cadastrado por enquanto. Que tal registrar os seus primeiros sonhos? 😊</p>
        )}
      </div>

      {/* Inline additions form */}
      <form onSubmit={handleAddPlan} className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-3.5">
        <h4 className="font-serif font-bold text-rose-800 text-xs text-left">Fazer Mais Um Plano Juntos</h4>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Ex. Ver o pôr do sol nas dunas..."
            className="flex-1 text-xs p-3.5 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10 placeholder-gray-400"
            required
          />

          <div className="flex gap-2">
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value as any)}
              className="text-xs p-3.5 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10 text-gray-700 bg-white"
            >
              <option value="viagem">✈️ Viagens</option>
              <option value="casa">🏠 Lar/Futuro</option>
              <option value="lazer">🎡 Lazer/Encontros</option>
              <option value="outro">🌻 Outros Sonhos</option>
            </select>

            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-3.5 rounded-xl hover:shadow-md transition-all active:scale-95 cursor-pointer text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
