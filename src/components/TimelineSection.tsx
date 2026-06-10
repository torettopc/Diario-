/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Milestone } from "../types";
import { Heart, Star, MapPin, Camera, Smile, Trophy, Plus, Calendar, Edit2, Trash2, Check, X } from "lucide-react";

interface TimelineSectionProps {
  milestones: Milestone[];
  onUpdateMilestones: (updatedMilestones: Milestone[]) => void;
}

export default function TimelineSection({ milestones, onUpdateMilestones }: TimelineSectionProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState<"heart" | "star" | "cup" | "map" | "smile" | "camera">("heart");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editIcon, setEditIcon] = useState<"heart" | "star" | "cup" | "map" | "smile" | "camera">("heart");

  const getIconElement = (type: string) => {
    switch (type) {
      case "heart":
        return <Heart className="w-5 h-5 fill-rose-500 stroke-none" />;
      case "star":
        return <Star className="w-5 h-5 fill-amber-400 stroke-none" />;
      case "map":
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case "camera":
        return <Camera className="w-5 h-5 text-indigo-500" />;
      case "smile":
        return <Smile className="w-5 h-5 text-rose-500" />;
      default:
        return <Heart className="w-5 h-5 fill-rose-500 stroke-none" />;
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTitle || !newDesc) return;

    const created: Milestone = {
      id: "m_" + Date.now().toString(),
      date: newDate,
      title: newTitle,
      description: newDesc,
      iconType: newIcon
    };

    const updated = [...milestones, created].sort((a, b) => {
      // Sorting simple Brazilian Dates "DD/MM/YYYY" can be handled or we sort by index or reverse timestamps
      return 1; // Default append
    });

    onUpdateMilestones(updated);
    setIsAddingNew(false);
    
    // reset form
    setNewDate("");
    setNewTitle("");
    setNewDesc("");
    setNewIcon("heart");
  };

  const triggerEdit = (m: Milestone) => {
    setEditingId(m.id);
    setEditDate(m.date);
    setEditTitle(m.title);
    setEditDesc(m.description);
    setEditIcon(m.iconType);
  };

  const handleSaveEdit = (id: string) => {
    if (!editDate || !editTitle || !editDesc) return;

    const updated = milestones.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          date: editDate,
          title: editTitle,
          description: editDesc,
          iconType: editIcon
        };
      }
      return m;
    });

    onUpdateMilestones(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Quer mesmo apagar essa linda lembrança? 🥺")) {
      const updated = milestones.filter((m) => m.id !== id);
      onUpdateMilestones(updated);
    }
  };

  return (
    <div id="timeline-section" className="space-y-8 max-w-xl mx-auto py-2">
      
      {/* Visual history intro */}
      <div className="text-center space-y-2 mb-6">
        <h3 className="font-serif text-2xl font-bold text-rose-900">Como Tudo Começou...</h3>
        <p className="text-gray-600 text-sm italic">
          Cada conquista, cada viagem, cada risada... Nossa história registrada dia após dia ❤️
        </p>
      </div>

      {/* Button wrapper for addition */}
      {!isAddingNew && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-full text-xs font-semibold shadow-md transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Capítulo</span>
          </button>
        </div>
      )}

      {/* Forms for additions */}
      {isAddingNew && (
        <form onSubmit={handleAddNew} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-md space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-rose-50">
            <h4 className="font-serif font-bold text-rose-800 text-sm">Registrar Novo Momento</h4>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-rose-700/80 uppercase mb-1">Data / Período</label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                placeholder="Ex. 25/12/2025"
                className="w-full text-xs p-3 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-rose-700/80 uppercase mb-1">Ícone</label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value as any)}
                className="w-full text-xs p-3 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10 text-gray-700"
              >
                <option value="heart">❤️ Coração</option>
                <option value="smile">😊 Sorriso</option>
                <option value="star">⭐ Estrela</option>
                <option value="map">📍 Viagem</option>
                <option value="camera">📷 Foto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-rose-700/80 uppercase mb-1">Título do Momento</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex. A nossa primeira viagem"
              className="w-full text-xs p-3 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-rose-700/80 uppercase mb-1">Descrição</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Conte detalhadamente o que aconteceu..."
              className="w-full text-xs p-3 border border-rose-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:bg-rose-50/10"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Salvar No Caderno
            </button>
          </div>
        </form>
      )}

      {/* Main vertical line layout */}
      <div id="timeline-stack" className="relative border-l-2 border-rose-100 pl-6 ml-4 space-y-8 text-left py-2">
        {milestones.map((m) => {
          const isEditing = editingId === m.id;

          return (
            <div key={m.id} className="relative group">
              {/* Colored floating point icon marker */}
              <div className="absolute -left-[37px] top-1.5 bg-rose-50 border-2 border-rose-200 p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform bg-white">
                {getIconElement(m.iconType)}
              </div>

              {/* Memory panel body */}
              <div className="bg-white/80 border border-rose-100/75 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
                {isEditing ? (
                  // Inline editor
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="text-xs p-2.5 border border-rose-100 rounded-xl"
                        placeholder="Data"
                      />
                      <select
                        value={editIcon}
                        onChange={(e) => setEditIcon(e.target.value as any)}
                        className="text-xs p-2.5 border border-rose-100 rounded-xl text-gray-700"
                      >
                        <option value="heart">❤️ Coração</option>
                        <option value="smile">😊 Sorriso</option>
                        <option value="star">⭐ Estrela</option>
                        <option value="map">📍 Viagem</option>
                        <option value="camera">📷 Foto</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xs font-bold p-2.5 border border-rose-100 rounded-xl w-full"
                      placeholder="Título"
                    />

                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="text-xs p-2.5 border border-rose-100 rounded-xl w-full"
                      rows={3}
                      placeholder="Lembrança"
                    />

                    <div className="flex justify-end space-x-1.5 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveEdit(m.id)}
                        className="px-2 py-1 bg-rose-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display details
                  <div>
                    {/* Header line with date and actions */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center space-x-2 text-[11px] text-rose-500 font-bold tracking-wide font-mono bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{m.date}</span>
                      </div>

                      {/* Tool actions */}
                      <div className="flex space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => triggerEdit(m)}
                          className="p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-serif text-base font-bold text-rose-950 mb-2">
                      {m.title}
                    </h4>
                    
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {m.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
