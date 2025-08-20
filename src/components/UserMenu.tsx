"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Settings, Users, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useAuth } from "@/context/AuthContext";
import { usePartner } from "@/context/PartnerContext";
import { useLanguage } from "@/context/LanguageContext";
import { AccountDialog } from "./AccountDialog";
import { PartnerDialog } from "./PartnerDialog";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { partner, partnerUser } = usePartner();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showPartnerDialog, setShowPartnerDialog] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.right - 256, // 256px - ширина меню
      });
    }
  }, [isOpen]);

  if (!user) return null;

  const handleSignOut = async () => {
    console.log("Sign out button clicked");
    try {
      await signOut();
      console.log("Sign out completed");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      <div className="relative">
        <Button
          ref={buttonRef}
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium shadow-modern">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs sm:text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700">
            {user.name}
          </span>
          <ChevronDown
            className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Меню в портале */}
      {isOpen && (
        <Portal>
          {/* Оверлей для закрытия меню */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 999999 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Само меню */}
          <div
            className="fixed w-64 sm:w-72 bg-white/98 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200/50 py-2 sm:py-3 animate-modal-fade-in"
            style={{
              zIndex: 1000000,
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              maxWidth: "calc(100vw - 16px)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5)",
            }}
          >
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100/50">
              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="py-1 sm:py-2">
              <button
                onClick={() => {
                  setShowAccountDialog(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg mx-2 transition-all duration-200 hover:scale-105"
              >
                <div className="p-1 sm:p-1.5 bg-blue-100 rounded-lg">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                {t("navigation.account")}
              </button>

              <button
                onClick={() => {
                  setShowPartnerDialog(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50/80 rounded-lg mx-2 transition-all duration-200 hover:scale-105"
              >
                <div className="p-1 sm:p-1.5 bg-green-100 rounded-lg">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                </div>
                {t("navigation.partner")}
                {partner && (
                  <span className="ml-auto px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full font-medium shadow-modern">
                    {t("partners.connected")}
                  </span>
                )}
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50/80 rounded-lg mx-2 transition-all duration-200 hover:scale-105"
              >
                <div className="p-1 sm:p-1.5 bg-red-100 rounded-lg">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                </div>
                {t("navigation.logout")}
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* Диалоги */}
      <AccountDialog
        open={showAccountDialog}
        onOpenChange={setShowAccountDialog}
        user={user}
      />

      <PartnerDialog
        open={showPartnerDialog}
        onOpenChange={setShowPartnerDialog}
        partner={partner}
        partnerUser={partnerUser}
      />
    </>
  );
}
