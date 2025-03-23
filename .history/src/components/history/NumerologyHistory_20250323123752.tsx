import { useEffect, useState, useContext } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getNumerologyHistory } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";

type HistoryEntry = {
  id: string;
  name: string;
  dob: string;
  createdAt: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
};

export function NumerologyHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth?.token) return;
      
      try {
        setLoading(true);
        const data = await getNumerologyHistory(auth.token);
        setHistory(data);
      } catch (error) {
        setError("Failed to load history");
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [auth?.token]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
        <CardDescription>
          {t('history.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-4">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <Calendar className="h-10 w-10 opacity-20" />
            <p>{t('history.noData')}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('history.name')}</TableHead>
                  <TableHead>{t('history.dob')}</TableHead>
                  <TableHead>{t('history.date')}</TableHead>
                  <TableHead className="text-right">{t('history.viewDetails')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{formatDate(entry.dob)}</TableCell>
                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t('history.viewDetails')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 