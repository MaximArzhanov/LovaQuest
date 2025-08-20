"use client";

import React from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatar: string;
  name: string;
}

export function AvatarViewer({
  open,
  onOpenChange,
  avatar,
  name,
}: AvatarViewerProps) {
  const [zoom, setZoom] = React.useState(1);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = avatar;
    link.download = `avatar-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] max-h-[90vh] overflow-hidden p-0 bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl animate-modal-fade-in">
        <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg sm:rounded-xl">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></div>
                </div>
              </div>
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {name}
              </span>
            </DialogTitle>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {/* Кнопки управления зумом */}
              <div className="flex items-center gap-1 p-1 bg-gray-100/80 backdrop-blur-sm rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="h-8 w-8 p-0 hover:bg-gray-200/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium text-gray-600 px-2 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="h-8 w-8 p-0 hover:bg-gray-200/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Кнопка сброса */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 px-3 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Сброс</span>
              </Button>

              {/* Кнопка скачивания */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/80"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Скачать</span>
              </Button>

              {/* Кнопка закрытия */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-gray-100/80"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Контейнер изображения */}
        <div
          className="flex-1 flex justify-center items-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                position.y / zoom
              }px)`,
            }}
          >
            <img
              src={avatar}
              alt={`Аватар ${name}`}
              className="max-w-full max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] rounded-xl sm:rounded-2xl shadow-2xl border-4 border-white/80"
              style={{
                imageRendering: "crisp-edges",
                objectFit: "contain",
                filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))",
              }}
              draggable={false}
            />

            {/* Индикатор зума */}
            {zoom > 1 && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {Math.round(zoom * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Подсказка по управлению */}
        {zoom > 1 && (
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100/50">
            <p className="text-xs sm:text-sm text-center text-gray-600 font-medium">
              💡 Перетащите изображение для навигации • Используйте колесо мыши
              для зума
            </p>
          </div>
        )}

        {/* Мобильная подсказка */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100/50 sm:hidden">
          <p className="text-xs text-center text-gray-500 font-medium">
            👆 Используйте кнопки + и - для изменения масштаба
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
