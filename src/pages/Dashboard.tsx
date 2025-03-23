import { useState, useContext, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyData, generateNumerologyPDF } from "../services/api";
import { NumerologyHistory } from "@/components/history/NumerologyHistory";
import { Download, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const fetchNumerology = async () => {
    if (!auth?.token) return;
    if (!name || !dob) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getNumerologyData(auth.token, name, dob);
      setResult(data);
      toast({
        title: "Success",
        description: "Numerology calculation completed",
      });
    } catch (error) {
      console.error("Error fetching numerology data:", error);
      toast({
        title: "Error",
        description: "Failed to calculate numerology",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!auth?.token) return;
    try {
      setIsGenerating(true);
      const { previewUrl } = await generateNumerologyPDF(auth.token, name, dob);
      window.open(previewUrl, '_blank');
      toast({
        title: "Success",
        description: "PDF generated successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* Numerology Calculator Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('calculator.title')}</CardTitle>
              <CardDescription className="text-lg">
                {t('calculator.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">
                      {t('calculator.name')}
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="dob">
                      {t('calculator.dob')}
                    </label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <Button
                    onClick={fetchNumerology}
                    className="w-full h-12 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      t('calculator.button')
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{t('results.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm"
                      >
                        <h3 className="font-semibold text-lg mb-3">{t('results.lifePath')}</h3>
                        <p className="text-4xl font-bold text-primary">{result.lifePath}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm"
                      >
                        <h3 className="font-semibold text-lg mb-3">{t('results.expression')}</h3>
                        <p className="text-4xl font-bold text-primary">{result.expression}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm"
                      >
                        <h3 className="font-semibold text-lg mb-3">{t('results.soulUrge')}</h3>
                        <p className="text-4xl font-bold text-primary">{result.soulUrge}</p>
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={generatePDF}
                        variant="outline"
                        className="flex items-center gap-2 h-12 text-lg"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('results.generating')}
                          </>
                        ) : (
                          <>
                            <Download className="h-5 w-5" />
                            {t('results.generateReport')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <NumerologyHistory refreshTrigger={result} />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}