import { Link } from "wouter";
import { useMode } from "@/hooks/use-mode";
import { ScanBarcode, User, Baby, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { mode, setMode } = useMode();
  const isElderly = mode === 'elderly';
  const isBaby = mode === 'baby';

  const modes = [
    { id: 'general', label: 'General', icon: User, desc: 'Standard safety analysis' },
    { id: 'baby', label: 'Baby', icon: Baby, desc: 'Strict criteria & choking hazards' },
    { id: 'elderly', label: 'Elderly', icon: Activity, desc: 'Heart & metabolic risks' },
  ] as const;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${
      isBaby ? 'bg-pink-50' : 'bg-gradient-to-b from-background to-muted/50'
    }`}>
      <div className={`w-full max-w-xl mx-auto space-y-8 md:space-y-12 ${isElderly ? 'space-y-10' : ''}`}>
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/baba.jpeg"
              alt="Barcode Baba"
              className={`rounded-3xl shadow-xl object-cover ${
                isElderly
                  ? 'w-28 h-28 md:w-32 md:h-32 border-4 border-black'
                  : isBaby
                    ? 'w-28 h-28 md:w-32 md:h-32 border-2 border-pink-200'
                    : 'w-28 h-28 md:w-32 md:h-32 border-2 border-primary/20'
              }`}
            />
          </div>
          <h1 className={`font-display tracking-tight ${
            isElderly ? 'text-5xl md:text-6xl font-black' : 'text-4xl md:text-5xl font-bold text-foreground'
          }`}>
            Barcode Baba
          </h1>
          <p className={`${
            isElderly ? 'text-xl font-bold' : 'text-lg text-muted-foreground'
          }`}>
            <i>Smart Choice Vahi, Jo Scan Kare Sahi</i>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="space-y-4">
          <h2 className={`font-display ${
            isElderly ? 'text-2xl font-black text-center mb-6' : 'text-xl font-semibold text-center'
          }`}>
            Select Your Mode
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              
              let cardClasses = "relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer text-center";
              
              if (isElderly) {
                cardClasses += isSelected 
                  ? " bg-amber-200 border-amber-500 text-amber-950 border-4 scale-105 shadow-2xl"
                  : " bg-amber-50 border-amber-300 text-amber-900 border-4 hover:bg-amber-100";
              } else {
                cardClasses += isSelected
                  ? " border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20 scale-105"
                  : isBaby
                    ? " border-pink-200/80 bg-white/80 text-violet-900 shadow hover:shadow-lg hover:border-pink-300"
                    : " border-transparent bg-card text-muted-foreground shadow hover:shadow-md hover:border-primary/20";
              }

              return (
                <div 
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cardClasses}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isElderly ? 'text-amber-900' : isSelected && !isElderly ? 'text-primary' : isBaby ? 'text-pink-500' : ''}`} />
                  <span className="font-display font-bold text-lg mb-1">{m.label}</span>
                  <span className={`text-xs ${isElderly ? 'text-amber-800' : 'text-foreground'}`}>
                    {m.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link href="/scan" className="block w-full">
            <Button 
              size="lg" 
              className={`w-full h-16 md:h-20 text-xl md:text-2xl font-display rounded-2xl shadow-xl transition-all active:scale-95 ${
                isElderly 
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black font-black' 
                  : isBaby
                    ? 'bg-pink-300 hover:bg-pink-400 text-violet-950 border border-pink-200 hover:-translate-y-1'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/25 hover:-translate-y-1'
              }`}
            >
              <ScanBarcode className={`mr-3 ${isElderly ? 'w-8 h-8' : 'w-6 h-6'}`} />
              Start Scanning
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
