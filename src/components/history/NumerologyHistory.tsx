import { useEffect, useState, useContext } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyHistory, generateNumerologyPDF } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ReadingDetailsModal } from "./ReadingDetailsModal";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config/api";

type HistoryResponse = {
  title: string;
  readings: HistoryEntry[];
};

type HistoryEntry = {
  id: string;
  name: string;
  dob: string;
  createdAt: string;
  readings: {
    lifePath: { name: string; value: number };
    expression: { name: string; value: number };
    soulUrge: { name: string; value: number };
  };
};

interface NumerologyHistoryProps {
  refreshTrigger: number;
}

export function NumerologyHistory({ refreshTrigger }: NumerologyHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReading, setSelectedReading] = useState<HistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const fetchHistory = async () => {
    if (!auth?.token) return;
    
    try {
      setLoading(true);
      const data = await getNumerologyHistory(auth.token);
      setHistory(data.readings || []);
    } catch (error) {
      setError("Failed to load history");
      console.error("Error fetching history:", error);
      toast({
        title: t('history.error.title'),
        description: t('history.error.description'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [auth?.token, refreshTrigger]);

  const handleViewDetails = (reading: HistoryEntry) => {
    setSelectedReading(reading);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const generatePDF = async (reading: HistoryEntry) => {
    if (!auth?.token) return;
    
    try {
      setGeneratingPDF(reading.id);
      const data = await generateNumerologyPDF(auth.token, reading.name, reading.dob);
      const fullUrl = data.downloadUrl.startsWith('http') 
        ? data.downloadUrl 
        : `${API_BASE_URL}${data.downloadUrl}`;
      
      // Create a temporary anchor to trigger download
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = `${reading.name}-numerology.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: t('history.pdfSuccess.title'),
        description: t('history.pdfSuccess.description'),
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: t('history.pdfError.title'),
        description: t('history.pdfError.description'),
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(null);
    }
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="backdrop-blur-sm bg-card/50 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('history.title')}</CardTitle>
                <CardDescription>{t('history.description')}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchHistory}
                className="flex items-center gap-2 transition-all hover:scale-105"
                disabled={loading}
              >
                <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{t('history.refresh')}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-center py-8 flex flex-col items-center gap-3"
              >
                <svg className="h-12 w-12 text-destructive opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchHistory}>
                  {t('history.tryAgain')}
                </Button>
              </motion.div>
            ) : history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 text-muted-foreground flex flex-col items-center gap-4"
              >
                <FileText className="h-16 w-16 opacity-20" />
                <div>
                  <p className="text-lg font-medium">{t('history.noData')}</p>
                  <p className="text-sm max-w-md mx-auto mt-2">{t('history.startCalculating')}</p>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <motion.div
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('history.name')}</TableHead>
                        <TableHead>{t('history.dob')}</TableHead>
                        <TableHead>{t('history.date')}</TableHead>
                        <TableHead className="text-right">{t('history.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((entry) => (
                        <motion.tr
                          key={entry.id}
                          variants={rowVariants}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
                        >
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell>{formatDate(entry.dob)}</TableCell>
                          <TableCell>{formatDate(entry.createdAt)}</TableCell>
                          <TableCell className="text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform"
                              onClick={() => handleViewDetails(entry)}
                              title={t('history.viewDetails')}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">{t('history.viewDetails')}</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 rounded-full hover:scale-110 transition-transform"
                              onClick={() => generatePDF(entry)}
                              disabled={generatingPDF === entry.id}
                              title={t('history.downloadPdf')}
                            >
                              {generatingPDF === entry.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              <span className="sr-only">{t('history.downloadPdf')}</span>
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <ReadingDetailsModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        reading={selectedReading}
        onGeneratePDF={generatePDF}
      />
    </>
  );
} 