/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Photo } from "../types";
import { Camera, Heart, Edit2, Check } from "lucide-react";

interface PhotoAlbumSectionProps {
  photos: Photo[];
  onUpdatePhoto: (updatedPhotos: Photo[]) => void;
}

export default function PhotoAlbumSection({ photos, onUpdatePhoto }: PhotoAlbumSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [tempCaption, setTempCaption] = useState("");

  // Handler for image uploads with canvas compression
  const handleImageUploadAndCompress = (photoId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600; // Optimized for mobile screen and keeps base64 light
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress high dynamic quality jpeg
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          
          const updated = photos.map((p) => {
            if (p.id === photoId) {
              return { ...p, userImage: dataUrl };
            }
            return p;
          });
          onUpdatePhoto(updated);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = (photoId: string) => {
    setEditingCardId(photoId);
    setIsEditingCaption(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingCardId) {
      handleImageUploadAndCompress(editingCardId, e.target.files[0]);
      setEditingCardId(null);
      setIsEditingCaption(false);
    }
  };

  const startEditingCaption = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCardId(photo.id);
    setIsEditingCaption(true);
    setTempCaption(photo.caption);
  };

  const saveCaption = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = photos.map((p) => {
      if (p.id === photoId) {
        return { ...p, caption: tempCaption };
      }
      return p;
    });
    onUpdatePhoto(updated);
    setEditingCardId(null);
    setIsEditingCaption(false);
  };

  return (
    <div id="photo-album-section" className="space-y-6">
      
      {/* Invisible file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Guide label */}
      <p className="text-center text-xs text-rose-500/80 italic font-medium bg-rose-50/40 py-2 rounded-xl border border-rose-100/40">
        ✨ Toque na câmera para enviar sua própria foto ou no lápis para editar a legenda!
      </p>

      {/* PHOTO GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fadeIn">
        {photos.map((photo) => {
          const hasUserImage = !!photo.userImage;
          const isThisCardEditing = editingCardId === photo.id && isEditingCaption;
          return (
            <div
              key={photo.id}
              id={`grid-photo-card-${photo.id}`}
              className="group bg-white rounded-3xl overflow-hidden border border-rose-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Photo space */}
              <div className="relative aspect-[3/4] bg-rose-50 overflow-hidden w-full">
                <img
                  src={photo.userImage || photo.defaultImage}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-550"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Icon indicators */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerUpload(photo.id);
                    }}
                    className="bg-white/90 blur-0 hover:bg-white text-rose-600 hover:text-rose-700 p-2 rounded-full shadow-md transition-colors cursor-pointer"
                    title="Alterar Foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Image type pill */}
                {!hasUserImage && (
                  <div className="absolute bottom-4 left-4 bg-rose-500/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md mb-2 animate-pulse-slow">
                    Ilustração do Momento
                  </div>
                )}

                {/* Photo Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-lg font-bold leading-tight flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 stroke-none animate-pulse-slow" />
                    {photo.title}
                  </h3>
                </div>
              </div>

              {/* Card text content */}
              <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-rose-50/50">
                {isThisCardEditing ? (
                  <div className="space-y-2 w-full" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={tempCaption}
                      onChange={(e) => setTempCaption(e.target.value)}
                      className="w-full text-xs text-gray-700 p-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 font-serif"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingCardId(null);
                          setIsEditingCaption(false);
                        }}
                        className="px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={(e) => saveCaption(photo.id, e)}
                        className="px-2 py-1 text-[10px] bg-rose-500 text-white rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-1.5 min-h-[44px]">
                    <p className="text-gray-600 text-xs italic leading-relaxed font-serif pt-1 flex-1">
                      "{photo.caption}"
                    </p>
                    <button
                      onClick={(e) => startEditingCaption(photo, e)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50/50 cursor-pointer self-start transition-colors"
                      title="Editar Legenda"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
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
