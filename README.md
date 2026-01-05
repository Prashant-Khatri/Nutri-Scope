# NutriScope - AI-Powered Nutritional Analysis

An intelligent food analysis companion that uses AI to provide instant, personalized nutritional insights. Upload a photo of any food product, and get context-aware health recommendations tailored to your dietary needs.

## ✨ Features

### 🎯 Core Capabilities
- **Instant Food Recognition** - AI-powered image analysis identifies food items in seconds
- **Personalized Context Detection** - Automatically infers user context (Gym Enthusiast, Parent, Diabetic, etc.)
- **Smart Component System** - Dynamic UI components that adapt based on the analysis:
  - ⚠️ Warning Cards for allergens and health conflicts
  - 📊 Nutritional Breakdowns with interactive tables
  - 🔬 Science Explainers with visual diagrams
  - 💡 Alternative Suggestions with better options
  - 📈 Processing Meters (NOVA classification)
  - 🎯 Quick Verdicts for binary questions
  - 📉 Macro Distribution visualizations
  - 🔍 Evidence-based sources with confidence scores
  - ⏳ Long-term health impact analysis

### 🧠 AI-Powered Intelligence
- **Multi-Modal Analysis** - Processes both images and text queries
- **Conversation Memory** - Maintains context across multiple questions
- **Smart Follow-ups** - Suggests relevant next questions
- **Citation Support** - Backs claims with authoritative sources (WHO, FDA, NIH, etc.)
- **Visual Explanations** - Generates diagrams for complex biological/chemical concepts

### 🎨 User Experience
- **Dark Mode Support** - Seamless theme switching
- **Responsive Design** - Works perfectly on mobile and desktop
- **Chat Interface** - Conversational interaction with history
- **Real-time Streaming** - Live AI responses as they generate
- **Demo Modes** - Pre-configured scenarios for testing (Gym, Parent, Diabetic)

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 20+ 
npm or yarn
Google Generative AI API Key
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nutri-scope.git
cd nutri-scope
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Workflow

1. **Upload an Image**
   - Click the gallery icon or camera button
   - Select a food product image
   - The AI automatically detects the context

2. **Confirm or Edit Context**
   - Review the AI-detected user persona
   - Edit if needed (e.g., "Diabetic", "Vegan", "Gym Enthusiast")
   - Confirm to proceed

3. **Get Instant Analysis**
   - View personalized health warnings
   - Explore nutritional breakdowns
   - Read science-backed explanations
   - See alternative suggestions

4. **Ask Follow-up Questions**
   - Type custom queries about the food
   - Click suggested follow-up questions
   - Build on previous conversation context

### Example Queries

```
"Is this safe for someone with diabetes?"
"What are healthier alternatives?"
"Explain why this ingredient is bad"
"How does this compare to [other food]?"
"Is this suitable for muscle building?"
```

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 16.1 (App Router)
- React 19.2 with React Compiler
- TypeScript 5.0
- Tailwind CSS 4.0
- Radix UI Components

**AI & API**
- Google Gemini 2.5 Flash (Vision + Text)
- Vercel AI SDK 6.0
- Structured Output with Zod

**State Management**
- React Hooks (useState, useEffect, useRef)
- Vercel AI SDK's `useObject` for streaming

### Project Structure

```
nutri-scope/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-response/    # Main AI analysis endpoint
│   │   │   └── identify/       # Image context detection
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main chat interface
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── AlternativeSuggestionCard.tsx
│   │   ├── ComparisonCard.tsx
│   │   ├── DosAndDontsGrid.tsx
│   │   ├── EvidenceSources.tsx
│   │   ├── HealthBadge.tsx
│   │   ├── IngredientTable.tsx
│   │   ├── InferredContextCard.tsx
│   │   ├── LongTermImpactCard.tsx
│   │   ├── MacroDistribution.tsx
│   │   ├── MethodologyStepper.tsx
│   │   ├── NutritionScore.tsx
│   │   ├── ProcessingMeter.tsx
│   │   ├── QuickVerdict.tsx
│   │   ├── ScienceExplainer.tsx
│   │   ├── SmartFollowUp.tsx
│   │   ├── TextWithImages.tsx  # Visual concept renderer
│   │   └── WarningCard.tsx
│   └── lib/
│       └── utils.ts
├── package.json
└── tsconfig.json
```

### API Endpoints

#### POST `/api/ai-response`
Main analysis endpoint that processes images and text.

**Request Body:**
```typescript
{
  imageBase64?: string;      // Base64 encoded image
  userContext?: string;       // User persona/context
  prompt?: string;            // User query
  history?: ChatMessage[];    // Conversation history
}
```

**Response:**
```typescript
{
  uiComponents: [
    {
      component: string;  // Component name
      props: object;      // Component props
    }
  ]
}
```

#### POST `/api/identify`
Fast pre-scan endpoint for context detection.

**Request Body:**
```typescript
{
  imageBase64: string;  // Base64 encoded image
}
```

**Response:**
```typescript
{
  label: string;       // e.g., "Protein Bar"
  context: string;     // e.g., "Gym Enthusiast"
  confidence: number;  // 0-100
}
```

## 🎨 Component System

### Dynamic UI Components

The system uses 15+ specialized components that render based on AI analysis:

| Component | Purpose | Use Case |
|-----------|---------|----------|
| `WarningCard` | Critical alerts | Allergens, conflicts |
| `HealthBadge` | Positive confirmation | Safe products |
| `IngredientTable` | Nutritional data | Macro breakdown |
| `ScienceExplainer` | Education | Complex concepts |
| `AlternativeSuggestionCard` | Recommendations | Better options |
| `ComparisonCard` | Context comparison | "Equivalent to X" |
| `MacroDistribution` | Visual ratios | Protein/carbs/fat |
| `ProcessingMeter` | NOVA classification | Processing level |
| `NutritionScore` | 0-100 rating | Overall health score |
| `QuickVerdict` | Binary assessment | Safe/Caution/Avoid |
| `DosAndDontsGrid` | Dietary guidance | Condition-specific |
| `MethodologyStepper` | Process explanation | Step-by-step |
| `EvidenceSources` | Citations | WHO, FDA, NIH |
| `LongTermImpactCard` | Chronic effects | Long-term risks |
| `SmartFollowUp` | Next questions | Conversation flow |

### Visual Concept System

Components support inline AI-generated visual concepts using the `<Image of X>` tag syntax:

```typescript
"Fructose is metabolized in the liver <Image of fructose metabolism pathway>. 
This can lead to fatty liver disease."
```

The `TextWithImages` component automatically:
- Parses the special syntax
- Generates placeholder visualizations
- Renders them inline with explanations

## 🔧 Configuration

### Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional
NODE_ENV=development
```

### Theme Customization

Edit `src/app/globals.css` to customize the color scheme:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... more variables */
}
```

## 🧪 Testing

### Demo Modes

Three pre-configured demo scenarios are available (hidden buttons at bottom-left):

1. **💪 Gym Mode** - Protein bar analysis for muscle building
2. **👪 Parent Mode** - Cereal analysis for child safety
3. **🩸 Diabetic Mode** - Veggie chips analysis for blood sugar

Click the emoji buttons to trigger instant demo responses.

### Manual Testing

1. Upload test images from `test-images/` directory
2. Try different user contexts
3. Ask follow-up questions
4. Test dark mode toggle
5. Verify responsive design on mobile

## 📊 Performance

- **Image Analysis**: ~2-3 seconds
- **Context Detection**: ~800ms
- **Follow-up Queries**: ~1-2 seconds
- **Streaming Responses**: Real-time display
- **Bundle Size**: ~300KB (gzipped)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing component structure
- Add JSDoc comments for complex functions
- Ensure dark mode compatibility
- Test on both mobile and desktop

## 🐛 Known Issues

- Large images (>5MB) may timeout - compress before upload
- Some complex diagrams use placeholders instead of actual images
- Context detection accuracy varies with image quality

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Barcode scanning integration
- [ ] Meal planning features
- [ ] Export analysis as PDF
- [ ] User accounts with history
- [ ] Nutrition tracking over time
- [ ] Integration with fitness apps
- [ ] Voice input support
- [ ] Offline mode (PWA)
- [ ] Real diagram generation API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for powerful vision AI
- Vercel for AI SDK and deployment
- Radix UI for accessible components
- Tailwind CSS for styling system
- shadcn/ui for component inspiration

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

**Built with ❤️ using Next.js, React, and Google Gemini AI**
