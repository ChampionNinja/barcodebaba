import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMode } from "@/hooks/use-mode";
import { useScanBarcode } from "@/hooks/use-scan";
import { Scanner } from "@/components/Scanner";
import { ScoreCard } from "@/components/ScoreCard";
import { WarningList } from "@/components/WarningList";
import { ProductDetails } from "@/components/ProductDetails";
import { speakText, stopSpeech } from "@/lib/speech";
import { ArrowLeft, Loader2, RefreshCcw, Search, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Scan() {
  const { mode } = useMode();
  const { mutate: scan, data: result, isPending, error, reset } = useScanBarcode();
  const { toast } = useToast();
  
  const [manualBarcode, setManualBarcode] = useState("");
  const isElderly = mode === 'elderly';
  const isBaby = mode === 'baby';

  // Handle successful scan
  useEffect(() => {
    if (result && isElderly) {
      const score = result.scores[mode];
      const rating = result.rating[mode];
      const warnings = result.warnings[mode];
      
      let speechText = `Scanned ${result.product_name || "product"}. `;
      speechText += `Elderly safety score is ${score}. Rating: ${rating}. `;
      
      if (warnings && warnings.length > 0) {
        speechText += `Warnings detected: ${warnings.join(". ")}.`;
      } else {
        speechText += "No major warnings detected.";
      }
      
      speakText(speechText);
    }
    
    return () => {
      stopSpeech();
    };
  }, [result, mode, isElderly]);

  const handleScan = (barcode: string) => {
    scan({ barcode });
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) return;
    scan({ barcode: manualBarcode.trim() });
  };

  const handleReset = () => {
    stopSpeech();
    reset();
    setManualBarcode("");
  };

  const replayVoice = () => {
    if (result && isElderly) {
      const score = result.scores[mode];
      const rating = result.rating[mode];
      const warnings = result.warnings[mode];
      speakText(`Scanned ${result.product_name}. Safety score ${score}. ${warnings.length > 0 ? warnings.join(". ") : ""}`);
    }
  };

  // Error effect
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Scan Error",
        description: error.message,
      });
      if (isElderly) {
        speakText("Error scanning product. Please try again.");
      }
    }
  }, [error, toast, isElderly]);

  return (
    <div className={`min-h-screen pb-12 ${isBaby ? 'bg-pink-50' : 'bg-background'}`}>
      {/* Header Navigation */}
      <header className={`sticky top-0 z-10 px-4 py-4 backdrop-blur-md border-b ${
        isElderly ? 'bg-white border-black border-b-4' : isBaby ? 'bg-white/75 border-pink-200' : 'bg-background/80 border-border'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className={isElderly ? 'border-2 border-black h-12 w-12 rounded-xl' : 'rounded-full'}>
              <ArrowLeft className={isElderly ? 'w-8 h-8' : 'w-6 h-6'} />
            </Button>
          </Link>
          <span className={`font-display ${isElderly ? 'text-2xl font-black' : 'text-lg font-bold uppercase tracking-wider text-muted-foreground'}`}>
            {mode} Mode
          </span>
          <div className="w-10"></div> {/* spacer */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 md:pt-10">
        {!result && !isPending && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className={`font-display ${isElderly ? 'text-3xl font-black' : 'text-2xl font-bold'}`}>
                Scan Barcode
              </h1>
              <p className={isElderly ? 'text-xl font-bold text-foreground' : 'text-muted-foreground'}>
                Align the barcode within the frame
              </p>
            </div>
            
            <Scanner onScan={handleScan} isElderlyMode={isElderly} isBabyMode={isBaby} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isElderly ? 'border-black border-t-2' : 'border-border'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isElderly ? 'bg-background font-bold text-lg' : 'bg-background text-muted-foreground'}`}>
                  OR
                </span>
              </div>
            </div>

            <form onSubmit={handleManualScan} className="flex gap-3">
              <Input 
                placeholder="Enter barcode manually..." 
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                className={`flex-1 h-14 rounded-xl ${isElderly ? 'border-4 border-black text-xl font-bold px-4' : isBaby ? 'text-lg border-pink-200 bg-white/90 placeholder:text-violet-400' : 'text-lg'}`}
              />
              <Button 
                type="submit" 
                className={`h-14 px-6 rounded-xl ${
                  isElderly 
                    ? 'bg-black text-white border-4 border-black font-bold text-lg' 
                    : isBaby
                      ? 'bg-pink-300 text-violet-950 border border-pink-200 font-semibold hover:bg-pink-400'
                      : 'bg-primary text-primary-foreground font-semibold'
                }`}
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <Loader2 className={`w-16 h-16 animate-spin ${isElderly ? 'text-black' : 'text-primary'}`} />
            <h2 className={`font-display ${isElderly ? 'text-2xl font-black' : 'text-xl font-bold'}`}>
              Analyzing Product...
            </h2>
          </div>
        )}

        {result && !isPending && (
          <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
            {/* Product Header */}
            <div className={`p-6 rounded-3xl border ${
              isElderly ? 'bg-white border-4 border-black' : isBaby ? 'bg-white/85 border-pink-200 shadow-pink-200/50 shadow-md' : 'bg-card border-border shadow-sm'
            }`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className={`mb-1 uppercase tracking-wide ${isElderly ? 'text-sm font-bold text-foreground' : 'text-xs font-semibold text-muted-foreground'}`}>
                    {result.brand || "Unknown Brand"}
                  </p>
                  <h1 className={`font-display leading-tight ${isElderly ? 'text-4xl font-black' : 'text-3xl font-bold text-foreground'}`}>
                    {result.product_name || "Unknown Product"}
                  </h1>
                </div>
                
                {isElderly && (
                  <Button 
                    onClick={replayVoice}
                    variant="outline" 
                    size="icon" 
                    className="h-14 w-14 rounded-full border-4 border-black shrink-0 hover:bg-yellow-100"
                  >
                    <Volume2 className="w-8 h-8 text-black" />
                  </Button>
                )}
              </div>
            </div>

            {/* Score Component */}
            <ScoreCard 
              mode={mode} 
              score={result.scores[mode]} 
              rating={result.rating[mode]} 
            />

            {/* Warnings Component */}
            <WarningList 
              mode={mode} 
              warnings={[...(result.warnings[mode] ?? []), ...(result.personalizedWarnings?.[mode] ?? [])]} 
            />

            <ProductDetails product={result} />

            {/* Action Buttons */}
            <div className="pt-6">
              <Button 
                onClick={handleReset}
                size="lg"
                className={`w-full h-16 text-xl rounded-2xl transition-all ${
                  isElderly 
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black font-black' 
                    : isBaby
                      ? 'bg-pink-200 hover:bg-pink-300 text-violet-950 border border-pink-200 font-semibold shadow-sm'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold shadow-sm'
                }`}
              >
                <RefreshCcw className={`mr-3 ${isElderly ? 'w-6 h-6' : 'w-5 h-5'}`} />
                Scan Another Product
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
