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

/* ----------------------------------------------------------------------------------
   HARDCODED DEMO DATA
   ---------------------------------------------------------------------------------- */

const GYM_MODE_DATA = [
  {
    component: "WarningCard",
    props: {
      title: "Deceptive Protein Source",
      severity: "medium",
      reasoning: "While this contains 16g of protein, it comes with 400 calories and 24g of sugar. The protein-to-calorie ratio (4g/100kcal) is poor for a lean bulk, effectively making this a 'dirty bulk' item.",
      source: "AI Nutrient Analysis"
    }
  },
  {
    component: "NutritionScore",
    props: {
      score: 42,
      subtitle: "Low efficiency for muscle gain",
      feedback: "High sugar content blunts the anabolic potential of the protein."
    }
  },
  {
    component: "MacroDistribution",
    props: { carbs: 55, protein: 15, fat: 30, calories: 410 }
  },
  {
    component: "IngredientTable",
    props: {
      items: [
        JSON.stringify({ label: "Whey Concentrate", value: "16g", status: "good" }),
        JSON.stringify({ label: "High Fructose Syrup", value: "24g", status: "bad" }),
        JSON.stringify({ label: "Palm Oil", value: "High", status: "bad" })
      ]
    }
  },
  {
    component: "ScienceExplainer",
    props: {
      title: "The Insulin-Fat Connection",
      explanation: `While insulin is anabolic, chronic high sugar spikes combined with fat (like in this cookie) preferentially drive energy into adipose tissue rather than muscle. `
    }
  },
  {
    component: "ComparisonCard",
    props: {
      nutrient: "Sugar Content",
      currentValue: "24g",
      comparisonText: "Equivalent to eating 2 Glazed Donuts",
      sentiment: "negative"
    }
  },
  {
    component: "AlternativeSuggestionCard",
    props: {
      suggestions: [
        JSON.stringify({ title: "Greek Yogurt & Whey", reason: "Higher protein (25g), lower calorie (180kcal)." }),
        JSON.stringify({ title: "Grilled Chicken Breast", reason: "Pure protein source without added sugars." })
      ]
    }
  }
];

const PARENT_MODE_DATA = [
  {
    component: "QuickVerdict",
    props: {
      status: "avoid",
      title: "Not Safe for Your Criteria",
      explanation: "Contains Red 40 and High Fructose Corn Syrup, which you specifically requested to avoid for your child.",
      nuanceTag: "Contains Additives"
    }
  },
  {
    component: "ProcessingMeter",
    props: {
      level: 4,
      title: "Ultra-Processed (NOVA 4)",
      description: "Industrial formulation using extrusion molding and cosmetic additives."
    }
  },
  {
    component: "IngredientTable",
    props: {
      items: [
        JSON.stringify({ label: "Red 40 Dye", value: "Detected", status: "bad" }),
        JSON.stringify({ label: "Fiber", value: "<1g", status: "bad" }),
        JSON.stringify({ label: "Whole Grains", value: "Low", status: "bad" })
      ]
    }
  },
  {
    component: "ScienceExplainer",
    props: {
      title: "Why Avoid Red 40?",
      explanation: "Red 40 is a synthetic petroleum-based dye. Some studies suggest a link between artificial colors and behavioral changes in children, such as hyperactivity . While approved by the FDA, many parents avoid it due to these potential neurobehavioral effects."
    }
  },
  {
    component: "EvidenceSources",
    props: {
      sources: [
        JSON.stringify({
          title: "Artificial Food Colors and Attention",
          authority: "Peer-Reviewed",
          description: "Meta-analysis suggesting synthetic food dyes may affect attention in sensitive children.",
          confidence: 88
        })
      ]
    }
  },
  {
    component: "SmartFollowUp",
    props: {
      questions: ["What are dye-free cereal alternatives?", "Is 'Natural Flavor' safe?"],
      onSelect: () => {}
    }
  }
];

const DIABETIC_MODE_DATA = [
  {
    component: "WarningCard",
    props: {
      title: "High Glycemic Impact",
      severity: "high",
      reasoning: "Despite being 'veggie' chips, the primary ingredient is potato starch/flour. This causes a rapid glucose spike similar to white bread, which is dangerous for pre-diabetes management.",
      source: "Glycemic Index Database"
    }
  },
  {
    component: "NutritionScore",
    props: {
      score: 28,
      subtitle: "Risky for blood sugar control",
      feedback: "Glycemic load is extremely high due to processed starch."
    }
  },
  {
    component: "MethodologyStepper",
    props: {
      title: "How Starch Spikes Glucose",
      steps: [
        JSON.stringify({ action: "Ingestion", detail: "The chips are chewed and mixed with saliva." }),
        JSON.stringify({ action: "Rapid Breakdown", detail: "Since fiber is removed, enzymes break starch into pure glucose ." }),
        JSON.stringify({ action: "Insulin Surge", detail: `Glucose floods the bloodstream, forcing a massive insulin spike .` })
      ]
    }
  },
  {
    component: "LongTermImpactCard",
    props: {
      title: "Cumulative Effect on Insulin",
      timeframe: "Over 6-12 months",
      impacts: [
        {
          effect: "Increased Insulin Resistance",
          explanation: `Frequent spikes from processed starches wear down insulin receptors, accelerating progression to Type 2 diabetes .`,
          severity: "high"
        }
      ]
    }
  },
  {
    component: "DosAndDontsGrid",
    props: {
      condition: "Pre-Diabetes",
      recommended: [
        JSON.stringify({ name: "Roasted Chickpeas", reason: "High fiber blunts the sugar spike." }),
        JSON.stringify({ name: "Kale Chips", reason: "Non-starchy vegetable base." })
      ],
      avoid: [
        JSON.stringify({ name: "Potato/Corn Chips", reason: "Pure rapid-digesting starch." }),
        JSON.stringify({ name: "Rice Crackers", reason: "Very high glycemic index." })
      ]
    }
  },
  {
    component: "AlternativeSuggestionCard",
    props: {
      suggestions: [
        JSON.stringify({ title: "Roasted Chickpeas", reason: "High fiber, low glycemic index." }),
        JSON.stringify({ title: "Kale Chips", reason: "Zero starch, high micronutrients." })
      ]
    }
  }
];

// Component Registry
const COMPONENT_MAP: Record<string, React.FC<any>> = {
  WarningCard, IngredientTable, HealthBadge, ScienceExplainer, AlternativeSuggestionCard,
  ComparisonCard, MacroDistribution, ProcessingMeter, SmartFollowUp, DosAndDontsGrid,
  MethodologyStepper, QuickVerdict, NutritionScore, EvidenceSources, LongTermImpactCard
};

const analysisSchema = z.object({
  uiComponents: z.array(z.object({ component: z.string(), props: z.any() })),
});

type ChatItem = {
  role: 'user' | 'assistant';
  content: any;
  image?: string | null;
};

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<string>("dark");
  
  // State
  const [showInferredCard, setShowInferredCard] = useState(false);
  const [confirmedContext, setConfirmedContext] = useState<string>(""); 
  const [detectedLabel, setDetectedLabel] = useState<string>("Analyzing...");
  const [isDetecting, setIsDetecting] = useState(false);
  
  // DEMO STATE
  const [manualResponse, setManualResponse] = useState<any[] | null>(null);
  const [pendingDemoData, setPendingDemoData] = useState<any[] | null>(null);
  const [isManualLoading, setIsManualLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai-response",
    schema: analysisSchema,
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  const synthesizeWarningIfNeeded = (components: any[]) => Array.isArray(components) ? components : [];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, object, manualResponse, isManualLoading]);

  // --- Real Logic (Fallback) ---
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
      
      // Reset State
      setManualResponse(null);
      setPendingDemoData(null);
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
    setManualResponse(null);
    setPendingDemoData(null);
  };

  const handleContextConfirm = (finalText: string) => {
    setConfirmedContext(finalText);
    setShowInferredCard(false);
    // STAGE 3: Load context into input after confirmation
    if (!prompt.trim()) {
      setPrompt(`Context: ${finalText}`);
    }
  };

  // --- WIZARD OF OZ: STAGED DEMO TRIGGER ---
  const triggerDemo = (type: 'gym' | 'parent' | 'diabetic') => {
    // 1. Reset everything
    setManualResponse(null);
    setPendingDemoData(null);
    setConfirmedContext("");
    setPrompt("");
    setShowInferredCard(false); 

    let mockContext = "", mockData: any[] = [], mockImage = "";

    if (type === 'gym') {
        mockContext = "Gym Enthusiast / Muscle Building";
        mockData = GYM_MODE_DATA;
        mockImage = "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/qst/qst00600/y/39.jpg"; 
    } else if (type === 'parent') {
        mockContext = "Mother of 4yo / Avoiding Dyes";
        mockData = PARENT_MODE_DATA;
        mockImage = "https://www.foodforlife.com/sites/default/files/263%5B1%5D.png";
    } else {
        mockContext = "Pre-Diabetic / Insulin Control";
        mockData = DIABETIC_MODE_DATA;
        mockImage = "https://www.govindjee.store/cdn/shop/products/mix-vegetable-chips-806793.jpg?v=1710799483&width=960";
    }

    // STAGE 1: Load Image
    setImagePreview(mockImage);
    
    // Store data for later
    setPendingDemoData(mockData);
    
    // Fake Detection Loading State (Short Delay)
    setDetectedLabel("Scanning...");
    setIsDetecting(true);

    // STAGE 2: Show Context Card after delay
    setTimeout(() => {
       setIsDetecting(false);
       setDetectedLabel(mockContext); // Set Hardcoded Context
       setShowInferredCard(true);     // Reveal Card
    }, 800);
  };

  const analyzeNutrients = () => {
    const effectivePrompt = prompt || (confirmedContext ? `Context: ${confirmedContext}` : "Analyze this image");
    const currentImageRaw = imageBase64 || "placeholder"; // Allow placeholder for demo
    const currentImageView = imagePreview;

    if (!currentImageRaw && !effectivePrompt) return;

    // 1. IMMEDIATE: Add USER INPUT to Chat History
    const userMessage: ChatItem = { 
        role: 'user', 
        content: effectivePrompt, 
        image: currentImageView 
    };
    
    // Add to history right away so user sees their input
    setChatHistory(prev => [...prev, userMessage]);

    // 2. Clear UI Inputs
    setPrompt("");
    setShowInferredCard(false);
    // Note: We keep imagePreview until the end usually, but since we pushed to history, we can technically clear it to make footer clean. 
    // But let's keep logic simple.

    // --- DEMO PATH ---
    if (pendingDemoData) {
      setIsManualLoading(true); // Triggers the spinner at bottom

      // STAGE 4: Simulate Network Delay then Show Result
      setTimeout(() => {
        setIsManualLoading(false);
        setManualResponse(pendingDemoData);
        
        // Add Assistant Response to History
        setChatHistory(prev => [
            ...prev, 
            { role: 'assistant', content: pendingDemoData }
        ]);
        
        // Clean up
        setPendingDemoData(null);
        // Clear preview now that it's in the chat
        setImagePreview(null); 
      }, 1500); 
      return;
    }

    // --- REAL AI PATH ---
    setManualResponse(null);
    // Real API submission handles history differently (it needs the new history for context), 
    // but visually we already added the user message above.
    // So we just prepare the API payload.

    const apiHistory = [...chatHistory, userMessage].map(msg => {
      if (msg.role === 'user') return { role: 'user', content: msg.content };
      return { role: 'assistant', content: JSON.stringify(msg.content) };
    });

    submit({
      imageBase64: currentImageRaw,
      userContext: confirmedContext, 
      prompt: effectivePrompt,
      history: apiHistory
    });
    
    // Clear preview for real path too
    setImagePreview(null);
  };

  const handleFollowUpSelect = (question: string) => {
    const updatedHistory = [...chatHistory];
    const lastContent = manualResponse || object?.uiComponents;
    if (lastContent && chatHistory[chatHistory.length -1]?.role !== 'assistant') {
        // Ensure we don't duplicate if manual response was just added
        // But in our flow manual response is added to history in timeout.
        // So we just check if last item is assistant.
    }

    updatedHistory.push({ role: 'user', content: question });
    setChatHistory(updatedHistory);

    const apiHistory = updatedHistory.map(msg => {
      if (msg.role === 'user') return { role: 'user', content: msg.content };
      return { role: 'assistant', content: JSON.stringify(msg.content) };
    });

    submit({ userContext: confirmedContext, prompt: question, history: apiHistory });
  };

  // Rendering Helper
  // If we are manual loading, OR real loading, we show spinner
  const isStreaming = isLoading || isManualLoading;
  // We show components if we have real object OR manual response
  const currentComponents = manualResponse || object?.uiComponents;

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 overflow-hidden transition-colors duration-300">
      
      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          
          {/* Welcome Empty State */}
          {chatHistory.length === 0 && !currentComponents && !isStreaming && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-60 mt-20">
              <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-full mb-4">
                <Bot size={48} className="text-emerald-200 dark:text-emerald-800" />
              </div>
              <p className="font-medium text-center">
                Upload a food label.<br/>
                <span className="text-xs opacity-70">Use hidden icons at bottom-left for Demo</span>
              </p>
            </div>
          )}

          {/* Chat History Loop */}
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
          
           {/* Loading / Streaming State (Appears after last message) */}
           {(isStreaming || (currentComponents && chatHistory[chatHistory.length - 1]?.role === 'user')) && (
            <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 mt-1">
                 {/* Always show spinner if streaming or manual loading */}
                {isStreaming ? <Loader2 size={14} className="text-emerald-600 animate-spin" /> : <Sparkles size={14} className="text-emerald-600" />}
              </div>
              <div className="max-w-[85%] lg:max-w-[75%] space-y-3 w-full">
                {/* Only show components if we have them and NOT manual loading (unless we want to stream them) */}
                {!isManualLoading && currentComponents && synthesizeWarningIfNeeded(currentComponents).map((item, index) => {
                  const Component = COMPONENT_MAP[item.component];
                  const extraProps = item.component === 'SmartFollowUp' ? { onSelect: handleFollowUpSelect } : {};
                  return Component ? <ErrorBoundary key={index}><Component {...item.props} {...extraProps} /></ErrorBoundary> : null;
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 min-h-40 flex flex-col justify-center transition-colors duration-300 relative z-30">
        
        {/* HIDDEN DEMO BUTTONS */}
        <div className="absolute bottom-1 left-1 z-50 flex gap-1 opacity-10 hover:opacity-100 transition-opacity p-2">
            <button onClick={() => triggerDemo('gym')} className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs grayscale hover:grayscale-0">💪</button>
            <button onClick={() => triggerDemo('parent')} className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs grayscale hover:grayscale-0">👪</button>
            <button onClick={() => triggerDemo('diabetic')} className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-xs grayscale hover:grayscale-0">🩸</button>
        </div>

        <div className="max-w-3xl mx-auto w-full flex flex-col gap-3">
          
          <div className="w-full">
            <InferredContextCard 
               key={imagePreview || 'init'} 
               // Ensure card is visible when detecting OR when we have a result but haven't confirmed yet (prompt is empty)
               isVisible={showInferredCard || (isDetecting && !!imagePreview)}
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
              !showInferredCard && !isDetecting && (
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

            <button onClick={analyzeNutrients} disabled={(!imagePreview && !prompt) || isStreaming} className="cursor-pointer p-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none shrink-0">
              {isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}