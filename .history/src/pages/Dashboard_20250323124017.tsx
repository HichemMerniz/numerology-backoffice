import { useState, useContext } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyData, generateNumerologyPDF } from "../services/api";
import { NumerologyHistory } from "@/components/history/NumerologyHistory";
import { Download } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function Dashboard() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  const fetchNumerology = async () => {
    if (!auth?.token) return;
    try {
      const data = await getNumerologyData(auth.token, name, dob);
      setResult(data);
    } catch (error) {
      console.error("Error fetching numerology data:", error);
    }
  };

  const generatePDF = async () => {
    if (!auth?.token) return;
    try {
      setIsGenerating(true);
      const data = await generateNumerologyPDF(auth.token, name, dob);
      // Ensure the URL is absolute
      const fullUrl = data.downloadUrl.startsWith('http') 
        ? data.downloadUrl 
        : `${API_BASE_URL}${data.downloadUrl}`;
      setDownloadUrl(fullUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* Numerology Calculator Form */}
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>{t('calculator.title')}</CardTitle>
            <CardDescription>
              {t('calculator.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  type="text"
                  placeholder={t('calculator.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                />
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-background/50"
                />
                <Button
                  onClick={fetchNumerology}
                  className="w-full"
                >
                  {t('calculator.button')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>{t('results.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h3 className="font-semibold mb-2">{t('results.lifePath')}</h3>
                    <p className="text-3xl font-bold">{result.lifePath}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h3 className="font-semibold mb-2">{t('results.expression')}</h3>
                    <p className="text-3xl font-bold">{result.expression}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h3 className="font-semibold mb-2">{t('results.soulUrge')}</h3>
                    <p className="text-3xl font-bold">{result.soulUrge}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={generatePDF}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={isGenerating}
                  >
                    <Download className="h-4 w-4" />
                    {isGenerating ? t('results.generating') : t('results.generateReport')}
                  </Button>
                </div>

                {downloadUrl && (
                  <div className="mt-4 flex justify-end">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 underline"
                    >
                      <Download className="h-4 w-4" />
                      {t('results.downloadReport')}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Section */}
        <NumerologyHistory />
      </div>
    </DashboardLayout>
  );
}