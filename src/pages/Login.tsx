import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Languages, Loader2 } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      auth?.login(data.token);
      toast({
        title: "Success",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-16 flex items-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[50%] top-[50%] -z-10 h-[600px] w-[600px] -translate-x-[50%] -translate-y-[50%] rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[25%] top-[25%] -z-10 h-[300px] w-[300px] rounded-full bg-primary/10 blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[25%] bottom-[25%] -z-10 h-[400px] w-[400px] rounded-full bg-primary/15 blur-2xl"
        />
      </div>

      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full mx-auto backdrop-blur-sm bg-card/50 border-primary/20 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('login.title')}
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  {t('login.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary/40 h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-primary/20 focus:border-primary/40 h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  t('login.submit')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;