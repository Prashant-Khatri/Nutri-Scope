"use client";

import { useEffect, useState, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { Camera, Loader2, Moon, Sparkles, Sun, X, User, Bot, Image as ImageIcon } from "lucide-react";

// Components
import WarningCard from "@/components/WarningCard";
import IngredientTable from "@/components/IngredientTable";
import HealthBadge from "@/components/HealthBadge";
import ScienceExplainer from "@/components/ScienceExplainer";
import AlternativeSuggestionCard from "@/components/AlternativeSuggestionCard";
import { ComparisonCard } from "@/components/ComparisonCard";
import { MacroDistribution } from "@/components/MacroDistribution";
import { ProcessingMeter } from "@/components/ProcessingMeter";
import { SmartFollowUp } from "@/components/SmartFollowUp";
import { NutritionScore } from "@/components/NutritionScore";
import { Button } from "@/components/ui/button";
import { DosAndDontsGrid } from "@/components/DosAndDontsGrid";
import { MethodologyStepper } from "@/components/MethodologyStepper";
import { QuickVerdict } from "@/components/QuickVerdict";
import EvidenceSources from "@/components/EvidenceSources"
import LongTermImpactCard from '@/components/LongTermImpactCard'
import ErrorBoundary from "@/components/ErrorBoundary";
import InferredContextCard from "@/components/InferredContextCard";

// 1️⃣ Component Registry
const COMPONENT_MAP: Record<string, React.FC<any>> = {
  WarningCard,
  IngredientTable,
  HealthBadge,
  ScienceExplainer,
  AlternativeSuggestionCard,
  ComparisonCard,
  MacroDistribution,
  ProcessingMeter,
  SmartFollowUp,
  DosAndDontsGrid,
  MethodologyStepper,
  QuickVerdict,
  NutritionScore,
  EvidenceSources,
  LongTermImpactCard
};

// 2️⃣ Schema
const analysisSchema = z.object({
  uiComponents: z.array(
    z.object({
      component: z.string(),
      props: z.any(),
    })
  ),
});

// 3️⃣ Types for Chat History
type ChatItem = {
  role: 'user' | 'assistant';
  content: any;
  image?: string | null;
};

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<string>("light");
  
  // --- Context State ---
  const [showInferredCard, setShowInferredCard] = useState(false);
  const [confirmedContext, setConfirmedContext] = useState<string>(""); 
  
  // --- Detection State ---
  const [detectedLabel, setDetectedLabel] = useState<string>("Analyzing...");
  const [isDetecting, setIsDetecting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai-response",
    schema: analysisSchema,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // --- Warning Logic ---
  const synthesizeWarningIfNeeded = (components: any[] = []) => {
      if (!Array.isArray(components)) return components;
      return components; 
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, object]);

  useEffect(()=>{
    console.log(object)
  },[object])

  // --- Detect Context ---
  const detectImageContext = async (base64String: string) => {
    setIsDetecting(true);
    setDetectedLabel("Scanning...");
    
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64String }),
      });
      const data = await response.json();
      setDetectedLabel(`${data.label} (${data.context})`); 
    } catch (err) {
      console.error(err);
      setDetectedLabel("Food Item");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageBase64(base64.split(",")[1]);
      
      // Reset Detection
      setConfirmedContext(""); 
      setShowInferredCard(true);
      detectImageContext(base64.split(",")[1]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const resetInput = () => {
    setImagePreview(null);
    setImageBase64(null);
    setPrompt("");
    setShowInferredCard(false);
    setConfirmedContext("");
  };

  // --- Handler when user clicks "Confirmed" on the card ---
  const handleContextConfirm = (finalText: string) => {
    setConfirmedContext(finalText);
    setShowInferredCard(false);
    
    // Auto-fill prompt if empty to show context usage
    if (!prompt.trim()) {
        setPrompt(`Context: ${finalText}`);
    }
  };

  const analyzeNutrients = () => {
    setShowInferredCard(false); 

    // Determine effective prompt
    const effectivePrompt = prompt || (confirmedContext ? `Context: ${confirmedContext}` : "Analyze this image");
    const currentImageRaw = imageBase64;
    const currentImageView = imagePreview;

    if (!currentImageRaw && !effectivePrompt) return;

    let updatedHistory = [...chatHistory];
    
    if (object?.uiComponents) {
       updatedHistory.push({ role: 'assistant', content: object.uiComponents });
    }

    updatedHistory.push({
      role: 'user',
      content: effectivePrompt,
      image: currentImageView
    });

    setChatHistory(updatedHistory);

    const apiHistory = updatedHistory.map(msg => {
      if (msg.role === 'user') return { role: 'user', content: msg.content };
      return { role: 'assistant', content: JSON.stringify(msg.content) };
    });

    // --- CRITICAL: Pass Confirmed Context & Prompt Separately ---
    submit({
      imageBase64: currentImageRaw,
      userContext: confirmedContext, 
      prompt: effectivePrompt,
      history: apiHistory
    });

    setPrompt(""); 
  };

  const handleFollowUpSelect = (question: string) => {
    const updatedHistory = [...chatHistory];
    if (object?.uiComponents) updatedHistory.push({ role: 'assistant', content: object.uiComponents });

    updatedHistory.push({ role: 'user', content: question });
    setChatHistory(updatedHistory);

    const apiHistory = updatedHistory.map(msg => {
      if (msg.role === 'user') return { role: 'user', content: msg.content };
      return { role: 'assistant', content: JSON.stringify(msg.content) };
    });

    submit({ 
        userContext: confirmedContext, // Keep context for follow-ups
        prompt: question, 
        history: apiHistory 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 overflow-hidden transition-colors duration-300">
      <header className="shrink-0 pt-4 pb-2 px-6 text-center z-20 bg-emerald-50/50 dark:bg-gray-900/50 backdrop-blur-sm transition-colors duration-300">
         <div className="absolute top-4 right-4">
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full w-8 h-8 dark:bg-gray-800 dark:text-white dark:border-gray-700">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase mb-2">
          <Sparkles size={10} /> AI-Powered Nutritionist
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
          AI Nutrient Analyzer
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {chatHistory.length === 0 && !object && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-60 mt-20">
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-full mb-4">
                <Bot size={48} className="text-emerald-200 dark:text-emerald-800" />
              </div>
              <p className="font-medium">Upload a food label or ask a question to start.</p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[85%] lg:max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                {msg.role === 'user' && msg.image && (
                  <img src={msg.image} alt="User upload" className="w-40 h-auto rounded-2xl border-2 border-white dark:border-gray-700 shadow-sm" />
                )}
                {msg.role === 'user' && msg.content && (
                  <div className="bg-gray-800 dark:bg-emerald-800 text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-sm shadow-md">
                    {msg.content}
                  </div>
                )}
                {msg.role === 'assistant' && Array.isArray(msg.content) && (
                   <div className="space-y-3 w-full">
                    {synthesizeWarningIfNeeded(msg.content).map((item: any, idx: number) => {
                      const Component = COMPONENT_MAP[item.component];
                      const extraProps = item.component === 'SmartFollowUp' ? { onSelect: handleFollowUpSelect } : {};
                      return Component ? <ErrorBoundary key={idx}><Component {...item.props} {...extraProps} /></ErrorBoundary> : null;
                    })}
                   </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <User size={14} className="text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          
           {object?.uiComponents && (
            <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 mt-1">
                <Loader2 size={14} className="text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
              <div className="max-w-[85%] lg:max-w-[75%] space-y-3 w-full">
                {synthesizeWarningIfNeeded(object.uiComponents).map((item, index) => {
                  const Component = COMPONENT_MAP[item.component];
                  const extraProps = item.component === 'SmartFollowUp' ? { onSelect: handleFollowUpSelect } : {};
                  return Component ? <ErrorBoundary key={index}><Component {...item.props} {...extraProps} /></ErrorBoundary> : null;
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 min-h-40 flex flex-col justify-center transition-colors duration-300 relative z-30">
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">
          
          <div className="w-full">
            <InferredContextCard 
               key={imagePreview} // Reset card if image changes
               isVisible={showInferredCard && !!imagePreview && prompt.length === 0}
               inferredLabel={isDetecting ? "Scanning..." : detectedLabel}
               confidence={90}
               onConfirm={handleContextConfirm} 
               onDismiss={() => setShowInferredCard(false)}
            />
          </div>

          <div className="flex-1 min-h-0 relative">
            {imagePreview ? (
              <div className="h-24 w-fit relative group rounded-xl overflow-hidden border border-emerald-100 dark:border-gray-700 shadow-sm mx-auto md:mx-0">
                <img src={imagePreview} className="h-full w-auto object-cover" alt="Preview" />
                <button onClick={resetInput} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X size={12} /></button>
              </div>
            ) : (
              !showInferredCard && (
                <div className="h-12 flex items-center justify-center border-2 border-dashed border-emerald-100 dark:border-gray-700 rounded-xl bg-emerald-50/30 dark:bg-gray-800/50 text-emerald-400 dark:text-gray-400 text-xs font-medium cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors" onClick={() => document.getElementById('gallery-upload')?.click()}>
                  <span className="flex items-center gap-2"><Camera size={16} /> Tap below to analyze food</span>
                </div>
              )
            )}
          </div>

          <div className="flex gap-2 items-end">
            <input id="gallery-upload" type="file" accept="image/*" hidden onChange={handleImageUpload} />
            <input id="camera-upload" type="file" accept="image/*" capture="environment" hidden onChange={handleImageUpload} />
            
            <button onClick={() => document.getElementById('gallery-upload')?.click()} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"><ImageIcon size={20} /></button>
            <button onClick={() => document.getElementById('camera-upload')?.click()} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer md:hidden"><Camera size={20} /></button>

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); analyzeNutrients(); }}}
              className="text-black dark:text-white flex-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder={imagePreview ? "Add context... (Optional)" : "Ask a question..."}
              rows={1}
              style={{ minHeight: '46px', maxHeight: '80px' }}
            />

            <button onClick={analyzeNutrients} disabled={(!imageBase64 && !prompt) || isLoading} className="cursor-pointer p-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none shrink-0">
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}