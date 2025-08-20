'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, PartyPopper } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'

export function PrizeNotification() {
  const { state, checkPrizes } = useApp()
  const { user } = useAuth()
  const [showNotification, setShowNotification] = useState(false)
  const [availablePrizes, setAvailablePrizes] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const prizes = checkPrizes(user.id)
    if (prizes.length > 0) {
      setAvailablePrizes(prizes)
      setShowNotification(true)
    }
  }, [user?.id, state.completedDates, checkPrizes])

  const handleClose = () => {
    setShowNotification(false)
    setAvailablePrizes([])
  }

  if (!showNotification || availablePrizes.length === 0) {
    return null
  }

  return (
    <Dialog open={showNotification} onOpenChange={setShowNotification}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <PartyPopper className="h-6 w-6 text-yellow-500" />
            Поздравляем! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Вы выполнили условия для получения призов!
          </p>
          
          {availablePrizes.map((prize) => (
            <Card key={prize.id} className="border-pink-200 bg-pink-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gift className="h-5 w-5 text-pink-500" />
                  {prize.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{prize.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {prize.isRepeatable ? '🔄 Повторяемый' : '⭐ Одноразовый'}
                  </span>
                  {prize.expiresAt && (
                    <span>
                      До: {new Date(prize.expiresAt).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleClose} className="flex-1 bg-pink-500 hover:bg-pink-600">
              Отлично! 🎉
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
