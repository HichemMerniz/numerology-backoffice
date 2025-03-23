import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";

type ReadingDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reading: {
    id: string;
    name: string;
    dob: string;
    createdAt: string;
    readings: {
      lifePath: { name: string; value: number };
      expression: { name: string; value: number };
      soulUrge: { name: string; value: number };
    };
  } | null;
};

export function ReadingDetailsModal({ isOpen, onClose, reading }: ReadingDetailsModalProps) {
  const { t } = useLanguage();

  if (!reading) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{reading.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {formatDate(reading.dob)} • {t('history.calculatedOn')} {formatDate(reading.createdAt)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5">
              <h3 className="font-semibold mb-2">{t('results.lifePath')}</h3>
              <p className="text-3xl font-bold">{reading.readings.lifePath.value}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <h3 className="font-semibold mb-2">{t('results.expression')}</h3>
              <p className="text-3xl font-bold">{reading.readings.expression.value}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <h3 className="font-semibold mb-2">{t('results.soulUrge')}</h3>
              <p className="text-3xl font-bold">{reading.readings.soulUrge.value}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 