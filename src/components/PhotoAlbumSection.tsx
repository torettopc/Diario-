/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Photo } from "../types";
import { Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X, Heart, RefreshCw, Edit2, Check } from "lucide-react";

interface PhotoAlbumSectionProps {
  photos: Photo[];
  onUpdatePhoto: (updatedPhotos: Photo[]) => void;
}

export default function PhotoAlbumSection({ photos, onUpdatePhoto }: PhotoAlbumSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
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
    // We can store which photo is being edited
    setEditingCardId(photoId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingCardId) {
      handleImageUploadAndCompress(editingCardId, e.target.files[0]);
    }
  };

  const startEditingCaption = (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening Lightbox
    setEditingCardId(photo.id);
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
  };

  // Carousel controls
  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % photos.length);
  };
  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  // Lightbox controls
  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };
  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
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

      {/* Mode selectors */}
      <div className="flex justify-between items-center bg-white/40 p-1.5 rounded-2xl border border-rose-100 max-w-sm mx-auto shadow-sm">
        <button
          onClick={() => setViewMode("grid")}
          className={`flex-1 text-center py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            viewMode === "grid"
              ? "bg-rose-500 text-white shadow-sm"
              : "text-rose-600 hover:bg-rose-50/50"
          }`}
        >
          🖼️ Grade
        </button>
        <button
          onClick={() => setViewMode("carousel")}
          className={`flex-1 text-center py-2 px-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            viewMode === "carousel"
              ? "bg-rose-500 text-white shadow-sm"
              : "text-rose-600 hover:bg-rose-50/50"
          }`}
        >
          🎠 Carrossel
        </button>
      </div>

      {/* Guide label */}
      <p className="text-center text-xs text-rose-500/80 italic font-medium">
        ✨ Clique em qualquer foto para ver melhor ou enviar a sua própria de vocês dois!
      </p>

      {/* 1. GRID LAYOUT */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo, idx) => {
            const hasUserImage = !!photo.userImage;
            return (
              <div
                key={photo.id}
                id={`grid-photo-card-${photo.id}`}
                className="group bg-white rounded-3xl overflow-hidden border border-rose-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Photo space */}
                <div className="relative aspect-[3/4] bg-rose-50 overflow-hidden w-full">
                  <img
                    src={photo.userImage || photo.defaultImage}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Icon indicators */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid lightbox
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
                    <div className="absolute bottom-4 left-4 bg-rose-500/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md mb-2">
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
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  {editingCardId === photo.id ? (
                    <div className="space-y-2 w-full" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={tempCaption}
                        onChange={(e) => setTempCaption(e.target.value)}
                        className="w-full text-xs text-gray-700 p-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCardId(null)}
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
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="text-gray-600 text-xs italic leading-relaxed font-serif pt-1 flex-1">
                        "{photo.caption}"
                      </p>
                      <button
                        onClick={(e) => startEditingCaption(photo, e)}
                        className="text-gray-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50/50 cursor-pointer self-start transition-colors"
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
      )}

      {/* 2. CAROUSEL LAYOUT */}
      {viewMode === "carousel" && (
        <div id="carousel-outer" className="relative max-w-md mx-auto aspect-[3/4.2] bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-xl flex flex-col">
          {/* Main Slide Carousel container */}
          <div className="relative flex-1 bg-rose-50 overflow-hidden">
            <img
              src={photos[carouselIndex].userImage || photos[carouselIndex].defaultImage}
              alt={photos[carouselIndex].title}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />

            {/* Quick Upload action on Slide */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => triggerUpload(photos[carouselIndex].id)}
                className="bg-white/95 hover:bg-white text-rose-600 hover:text-rose-700 p-3 rounded-full shadow-lg transition-all transform active:scale-90 cursor-pointer"
                title="Tirar/Enviar Foto"
              >
                <Camera className="w-5 h-5 animate-pulse-slow" />
              </button>
            </div>

            {/* Indicator of status */}
            {!photos[carouselIndex].userImage && (
              <div className="absolute top-4 left-4 bg-rose-500/90 text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md">
                Modelo Ilustrativo
              </div>
            )}

            {/* Slide title */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                {photos[carouselIndex].title}
              </h3>
              <p className="text-sm font-handwritten text-rose-200">
                Momento {carouselIndex + 1} de {photos.length}
              </p>
            </div>

            {/* Navigation buttons inside carousel */}
            <button
              onClick={handlePrevCarousel}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleNextCarousel}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel Caption beneath */}
          <div className="p-5 text-center bg-white space-y-2 text-gray-700">
            {editingCardId === photos[carouselIndex].id ? (
              <div className="space-y-2 w-full max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={tempCaption}
                  onChange={(e) => setTempCaption(e.target.value)}
                  className="w-full text-xs text-gray-700 p-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 text-center"
                  rows={2}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingCardId(null)}
                    className="px-2 py-1 text-[10px] text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={(e) => saveCaption(photos[carouselIndex].id, e)}
                    className="px-2 py-1 text-[10px] bg-rose-500 text-white rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-center gap-1.5 max-w-sm mx-auto">
                <p className="font-serif italic text-base px-2 text-gray-700 flex-1 leading-relaxed">
                  "{photos[carouselIndex].caption}"
                </p>
                <button
                  onClick={(e) => startEditingCaption(photos[carouselIndex], e)}
                  className="text-gray-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50/50 cursor-pointer self-center transition-colors"
                  title="Editar Legenda"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LIGHTBOX FULLSCREEN PREVIEW */}
      {lightboxIndex !== null && (
        <div id="lightbox-overlay" className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4" onClick={() => setLightboxIndex(null)}>
          {/* Top light bar */}
          <div className="flex justify-between items-center text-white p-2">
            <span className="font-serif font-semibold text-rose-300">
              {lightboxIndex + 1} / {photos.length}
            </span>
            <div className="flex items-center space-x-3">
              {/* Replace trigger in lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerUpload(photos[lightboxIndex].id);
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Substituir foto"
              >
                <Camera className="w-3.5 h-3.5" /> Enviar Minha Foto
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(null);
                }}
                className="hover:bg-white/10 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center viewport */}
          <div className="flex-1 flex justify-center items-center relative py-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex].userImage || photos[lightboxIndex].defaultImage}
              alt={photos[lightboxIndex].title}
              className="max-h-[70vh] max-w-[95vw] object-contain rounded-2xl shadow-2xl border border-white/5"
              referrerPolicy="no-referrer"
            />

            {/* Hotkeys inside view */}
            <button
              onClick={prevLightbox}
              className="absolute left-2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextLightbox}
              className="absolute right-2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Bottom metadata banner */}
          <div className="text-center text-white pb-6 px-4 space-y-2 mt-auto" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-serif text-xl font-bold text-rose-200">
              {photos[lightboxIndex].title}
            </h4>
            <p className="text-sm font-light italic max-w-lg mx-auto">
              "{photos[lightboxIndex].caption}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
