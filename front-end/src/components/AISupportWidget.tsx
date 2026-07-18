import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Smile, 
  Compass, 
  Zap, 
  HelpCircle, 
  Quote, 
  RefreshCw, 
  Check, 
  Volume2,
  Copy,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type MoodType = 'overwhelmed' | 'guilt' | 'exhausted' | 'patience' | 'isolated' | 'general';
type ToneType = 'sweetness' | 'perspective' | 'energy';

interface GroundingExercise {
  title: string;
  steps: string[];
}

const PRESET_PROMPTS = [
  { id: 'cried', text: "J'ai crié sur mes enfants aujourd'hui... 🥺", mood: 'patience' },
  { id: 'mess', text: "La maison est un désordre total et je n'arrive à rien 🧹", mood: 'overwhelmed' },
  { id: 'bad_mom', text: "J'ai l'impression d'être une mauvaise maman 💔", mood: 'guilt' },
  { id: 'sleep', text: "Je n'ai pas dormi, je suis à bout physiquement 🥱", mood: 'exhausted' },
  { id: 'alone', text: "Je me sens si seule face à toute cette charge 👤", mood: 'isolated' }
];

// Grounding sensory exercise presets
const GROUNDING_EXERCISES: Record<MoodType, GroundingExercise> = {
  overwhelmed: {
    title: "L'Ancrage des 5 Sens (Calme rapide)",
    steps: [
      "Regarde 3 objets autour de toi et nomme leur couleur.",
      "Touche 2 surfaces différentes (tes vêtements, la table) en ressentant la texture.",
      "Ferme les yeux et écoute 1 bruit lointain.",
      "Prends une grande inspiration par le nez, expire par la bouche."
    ]
  },
  guilt: {
    title: "Le Geste d'Auto-Compassion",
    steps: [
      "Pose tes deux mains à plat sur ton cœur, doucement.",
      "Sens la chaleur de tes mains traverser tes vêtements.",
      "Ferme les yeux et dis-toi dans ta tête : 'Je fais de mon mieux, et c'est déjà beaucoup.'",
      "Relâche tes épaules et laisse un soupir s'échapper."
    ]
  },
  exhausted: {
    title: "La Recharge Instantanée (Scan corporel court)",
    steps: [
      "Assieds-toi confortablement ou allonge-toi si possible.",
      "Laisse tout le poids de ton corps s'enfoncer dans le support (chaise, lit).",
      "Dessers tes mâchoires, décrispe le front et l'espace entre tes sourcils.",
      "Prends 3 respirations lentes en imaginant de l'énergie douce entrer à l'inspiration."
    ]
  },
  patience: {
    title: "Le Bouton Pause Physiologique",
    steps: [
      "Mets tes mains sous l'eau fraîche pendant 15 secondes.",
      "Sens la fraîcheur sur ta peau, cela envoie un signal de calme immédiat à ton cerveau.",
      "Prends une inspiration lente, bloque l'air 3 secondes, expire très doucement.",
      "Rappelle-toi : 'La colère est une tempête qui passe. Je suis le ciel calme autour.'"
    ]
  },
  isolated: {
    title: "L'Ancrage au Présent",
    steps: [
      "Entoure-toi de tes propres bras dans un câlin chaleureux.",
      "Sens la force et la bienveillance de tes propres mains.",
      "Rappelle-toi que des milliers de mamans partagent exactement ce sentiment en cet instant précis.",
      "Tu es connectée à elles par ce fil invisible de la maternité."
    ]
  },
  general: {
    title: "Le Souffle Libérateur",
    steps: [
      "Inspire profondément en gonflant le ventre.",
      "Expire comme si tu soufflais sur une bougie sans l'éteindre.",
      "Répète 3 fois en relâchant les tensions du cou.",
      "Sache que cette minute est rien qu'à toi."
    ]
  }
};

export default function AISupportWidget() {
  const [selectedMood, setSelectedMood] = useState<MoodType>('general');
  const [userText, setUserText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('sweetness');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [typedResponse, setTypedResponse] = useState<string>('');
  const [activeGrounding, setActiveGrounding] = useState<GroundingExercise | null>(null);
  const [activeMantra, setActiveMantra] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Analyze text and return keyword-matched paragraphs
  const generateDynamicResponse = (mood: MoodType, text: string, tone: ToneType) => {
    const lowercaseText = text.toLowerCase();
    let keywordsMatched: string[] = [];

    // Analyze custom text for keywords
    if (lowercaseText.includes('crie') || lowercaseText.includes('crié') || lowercaseText.includes('colère') || lowercaseText.includes('fâch') || lowercaseText.includes('patience')) {
      keywordsMatched.push('patience');
    }
    if (lowercaseText.includes('ménage') || lowercaseText.includes('désordre') || lowercaseText.includes('bazar') || lowercaseText.includes('vaisselle') || lowercaseText.includes('linge') || lowercaseText.includes('ranger')) {
      keywordsMatched.push('housework');
    }
    if (lowercaseText.includes('fatigue') || lowercaseText.includes('épuisé') || lowercaseText.includes('dormir') || lowercaseText.includes('sommeil') || lowercaseText.includes('crevé') || lowercaseText.includes('nuit')) {
      keywordsMatched.push('exhaustion');
    }
    if (lowercaseText.includes('mauvaise') || lowercaseText.includes('nulle') || lowercaseText.includes('coupable') || lowercaseText.includes('s\'en vouloir') || lowercaseText.includes('culpabilité')) {
      keywordsMatched.push('guilt');
    }
    if (lowercaseText.includes('seule') || lowercaseText.includes('isolé') || lowercaseText.includes('solitude') || lowercaseText.includes('conjoint') || lowercaseText.includes('personne')) {
      keywordsMatched.push('isolation');
    }

    // Default to the selected mood category if no keywords matched in custom text
    if (keywordsMatched.length === 0) {
      if (mood === 'patience') keywordsMatched.push('patience');
      else if (mood === 'overwhelmed') keywordsMatched.push('housework');
      else if (mood === 'exhausted') keywordsMatched.push('exhaustion');
      else if (mood === 'guilt') keywordsMatched.push('guilt');
      else if (mood === 'isolated') keywordsMatched.push('isolation');
      else keywordsMatched.push('general');
    }

    // Tones response variations
    const toneIntro = {
      sweetness: "Je t'entends, et je t'enveloppe de toute la douceur possible en ce moment. Ferme les yeux un court instant, pose tes mains sur ton ventre, et écoute ceci :",
      perspective: "Prenons un instant de recul objectif et bienveillant ensemble. Ce que tu ressens est la conséquence logique d'une surcharge, pas d'un manque d'amour ou de compétence :",
      energy: "On lève la tête, on respire un grand coup et on remet les choses à leur place ! Tu as une force incroyable en toi, et aujourd'hui on va chasser cette culpabilité inutile :"
    };

    // Build central message paragraphs
    const paragraphs: string[] = [];
    paragraphs.push(toneIntro[tone]);

    // Construct tailored core advice based on matched keywords/moods
    keywordsMatched.forEach(key => {
      if (key === 'patience') {
        paragraphs.push(
          "C'est tellement normal de perdre patience quand ton réservoir est vide. Ton cri ou ton énervement n'est pas un manque d'amour, c'est le signal d'alarme de ton système nerveux saturé. Ton enfant n'a pas besoin d'une maman parfaite, il a besoin d'une maman humaine. Une fois la tempête passée, un simple câlin et un mot doux réparateur ('maman était fatiguée, je m'excuse d'avoir haussé le ton') enseigne une magnifique leçon à ton enfant : le droit à l'erreur et la beauté de la réconciliation."
        );
      } else if (key === 'housework') {
        paragraphs.push(
          "Le désordre et la vaisselle accumulée ne définissent pas ta valeur en tant que mère. Une maison vivante est rarement une maison témoin ! Les jouets éparpillés sont les preuves de la vie et de la créativité de tes enfants. Ce soir, le ménage n'est pas ta priorité. Choisis ton repos et ton bien-être mental. Tes enfants se souviendront de ton rire et de ton regard posé sur eux, jamais de l'éclat de ton plan de travail."
        );
      } else if (key === 'exhaustion') {
        paragraphs.push(
          "La privation de sommeil et la fatigue chronique ne sont pas de simples inconforts, elles modifient chimiquement la perception de la réalité et de tes émotions. Il est scientifiquement normal de se sentir plus triste, anxieuse ou irritable dans cet état d'épuisement extrême. Tu es en mode survie. Réduis toutes tes exigences au strict minimum aujourd'hui. Le repos n'est pas un luxe, c'est ta priorité absolue."
        );
      } else if (key === 'guilt') {
        paragraphs.push(
          "La culpabilité est le piège de la 'maman parfaite' imaginaire. Elle naît de l'amour immense que tu portes à tes enfants et de ton envie de bien faire. Mais tu as le droit d'avoir des limites, d'être fatiguée et d'avoir besoin de temps pour toi. Tu fais un travail titanesque avec les outils, l'énergie et le soutien dont tu disposes aujourd'hui. Tu es exactement la maman dont tes enfants ont besoin."
        );
      } else if (key === 'isolation') {
        paragraphs.push(
          "La maternité moderne nous demande de porter le poids d'un village entier sur les épaules d'une seule personne. Ce sentiment d'isolement est légitime. Tu n'as pas à tout accomplir seule. N'hésite pas à exprimer clairement tes limites et à demander de l'aide concrète. Te faire soutenir n'est pas un aveu d'échec, c'est un acte de courage et d'amour envers toi et ta famille."
        );
      } else {
        paragraphs.push(
          "Prends une grande inspiration. Ce que tu traverses en ce moment est intense, et tous tes ressentis sont 100% valides. Tu as le droit d'être fatiguée, d'avoir des doutes et de vouloir souffler. Ne confonds pas une journée difficile ou un moment de débordement avec un échec de vie. Tu fais de ton mieux, et c'est déjà amplement suffisant."
        );
      }
    });

    // Concluding dynamic comfort line
    const toneOutro = {
      sweetness: "Tu es enveloppée d'amour. Prends soin de toi, tu es le cœur de ton foyer. ❤️",
      perspective: "Rappelle-toi de cette vérité scientifique : une maman heureuse et reposée est le plus grand pilier pour un enfant. Laisse tomber le reste ce soir. ⚖️",
      energy: "Redresse les épaules, prends un grand verre d'eau et offre-toi un moment de répit bien mérité sans une once de regret. Tu es fantastique ! ⚡"
    };
    paragraphs.push(toneOutro[tone]);

    return paragraphs.join("\n\n");
  };

  // Get localized short mantras
  const getMantra = (mood: MoodType): string => {
    const mantras: Record<MoodType, string> = {
      overwhelmed: "Je ne peux pas tout faire, et c'est parfaitement correct ainsi. La priorité, c'est mon calme. 🌸",
      guilt: "Mes enfants n'ont pas besoin d'une maman parfaite, ils ont besoin d'une maman heureuse et apaisée. ❤️",
      exhausted: "Le repos est une nécessité biologique, pas une récompense à mériter. Je m'autorise à ralentir. 🥱",
      patience: "Je suis humaine. Mon énervement est un appel au secours de mon corps fatigué. Je répare avec amour. 🧘‍♀️",
      isolated: "Demander de l'aide n'est pas une faiblesse. Je mérite d'être épaulée et entourée. 🤝",
      general: "Je fais de mon mieux à chaque instant avec l'énergie disponible. C'est amplement suffisant. ✨"
    };
    return mantras[mood];
  };

  const toneLabel = {
    sweetness: 'doux, réconfortant, comme un câlin verbal',
    perspective: 'posé, qui aide à prendre du recul',
    energy: 'énergique et motivant',
  };

  const fetchAiReply = async (): Promise<string> => {
    const prompt = `Une maman se sent "${selectedMood}" et écrit : "${
      userText || "(elle n'a rien précisé, réconforte-la simplement sur cette humeur)"
    }". Réponds-lui en français, sur un ton ${toneLabel[selectedTone]}, en 3-4 phrases courtes, sans liste ni markdown, comme une amie bienveillante et psychologue.`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    });
    const data = await res.json();
    if (!res.ok || !data.answer) {
      throw new Error(data.error || 'réponse vide');
    }
    return data.answer as string;
  };

  const handleConsult = async () => {
    setIsGenerating(true);
    setTypedResponse('');

    let response: string;
    try {
      response = await fetchAiReply();
    } catch {
      // Repli sur les réponses pré-écrites si l'API Mistral est indisponible.
      response = generateDynamicResponse(selectedMood, userText, selectedTone);
    }

    const mantra = getMantra(selectedMood);
    const grounding = GROUNDING_EXERCISES[selectedMood];

    setAiResponse(response);
    setActiveMantra(mantra);
    setActiveGrounding(grounding);
    setIsGenerating(false);

    // Simple pseudo-typewriter effect for immediate organic read
    let i = 0;
    const interval = setInterval(() => {
      if (i < response.length) {
        setTypedResponse(prev => prev + response.charAt(i));
        i += 4; // Step faster to prevent long waiting times
      } else {
        setTypedResponse(response);
        clearInterval(interval);
      }
    }, 15);
  };

  const selectPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setUserText(preset.text);
    setSelectedMood(preset.mood as MoodType);
  };

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(activeMantra);
    setIsCopied(true);
    setTimeout(() => setIsCopied(null as any), 2000);
  };

  const handleReset = () => {
    setUserText('');
    setTypedResponse('');
    setAiResponse('');
    setActiveGrounding(null);
    setActiveMantra('');
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto" id="ai-support-module">
      
      {/* HEADER EXPLAINER */}
      <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF4E0] text-rose-500 border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl shrink-0">
              <Sparkles className="w-5.5 h-5.5 fill-rose-100 stroke-[2.5px]" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">Mon Allié IA Anti-Culpabilité</h2>
              <p className="text-[11px] text-stone-500 font-bold">Un soutien psychologique léger et immédiat pour libérer ton cœur.</p>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl self-start md:self-center">
            🔒 Confidentialité totale : Rien n'est stocké en ligne
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPANION FORM CONTAINER */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-5">
            
            {/* Step 1: Mood */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-purple-500" /> 1. Quelle est l'ombre sur ton cœur ?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'overwhelmed', label: "Débordée 🌀" },
                  { id: 'guilt', label: "Culpabilité 🥺" },
                  { id: 'exhausted', label: "Fatigue intense 🥱" },
                  { id: 'patience', label: "Perte de patience ⚡" },
                  { id: 'isolated', label: "Isolement 👤" },
                  { id: 'general', label: "Besoin d'écoute ✨" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMood(item.id as MoodType)}
                    className={`p-2.5 rounded-xl border-2 text-[11px] font-bold text-center transition-all cursor-pointer truncate ${
                      selectedMood === item.id
                        ? 'bg-[#E0F2F1] border-[#4B4453] text-[#4B4453] font-black shadow-[2px_2px_0px_#4B4453]'
                        : 'bg-stone-50/50 border-stone-100 text-stone-600 hover:border-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Custom Text Area */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center justify-between">
                <span>2. Vide ton sac (facultatif) :</span>
                <span className="text-[9px] text-stone-400 lowercase italic normal-case">écris librement sans filtre</span>
              </label>
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Raconte brièvement ton moment difficile, ton énervement, ou pourquoi tu t'en veux aujourd'hui..."
                rows={4}
                className="w-full bg-stone-50/50 border-2 border-stone-200 rounded-2xl p-3.5 text-xs text-[#4B4453] font-bold placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent resize-none leading-relaxed"
              />

              {/* Presets suggestions */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-stone-400">Idées rapides :</span>
                <div className="flex flex-wrap gap-1">
                  {PRESET_PROMPTS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className="text-[9.5px] px-2.5 py-1 bg-stone-50 border border-stone-200 hover:bg-rose-50 hover:border-rose-200 rounded-lg text-stone-600 transition-colors cursor-pointer text-left truncate max-w-full"
                    >
                      {preset.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Choose Tone */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#4B4453] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" /> 3. Choisis la fiole de l'IA :
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'sweetness', label: "Douceur 🌸", desc: "Câlin verbal" },
                  { id: 'perspective', label: "Perspective 💡", desc: "Prendre du recul" },
                  { id: 'energy', label: "Énergie ⚡", desc: "Motivation" }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id as ToneType)}
                    className={`flex-1 p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      selectedTone === tone.id
                        ? 'bg-[#FFD966] border-[#4B4453] text-[#4B4453] font-black shadow-[2px_2px_0px_#4B4453]'
                        : 'bg-stone-50/50 border-stone-100 text-stone-500 hover:border-stone-200'
                    }`}
                  >
                    <div className="text-[11px] font-black">{tone.label}</div>
                    <div className="text-[8px] text-stone-400 mt-0.5 font-bold">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CONSULT ACTION */}
            <button
              onClick={handleConsult}
              disabled={isGenerating}
              className="w-full py-3.5 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-[#4B4453] border-b-4 border-r-4 rounded-[20px] font-black uppercase tracking-wider text-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5px]" /> Formulation de douceur...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 fill-white shrink-0" /> Échanger avec mon Allié IA
                </>
              )}
            </button>

          </div>
        </div>

        {/* RIGHT ARENA: DISPLAY RESPONSE */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!aiResponse ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[32px] p-8 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs text-center min-h-[430px] flex flex-col justify-center items-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#FFF4E0] border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl flex items-center justify-center text-rose-500">
                  <MessageSquare className="w-7 h-7 stroke-[2px]" />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="font-black text-[#4B4453] uppercase tracking-wider text-sm">Prête à relâcher tes tensions ?</h3>
                  <p className="text-stone-500 text-xs font-bold leading-relaxed">
                    Sélectionne ton humeur actuelle à gauche et clique sur "Échanger" pour recevoir des mots doux sur-mesure et déculpabilisants.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Simulated live response card */}
                <div className="bg-[#FFFBF0] rounded-[32px] p-6 border-2 border-[#4B4453] border-b-4 border-r-4 shadow-xs space-y-5 relative overflow-hidden">
                  
                  {/* Badge */}
                  <div className="flex justify-between items-center border-b border-[#4B4453]/10 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] bg-[#FFF4E0] border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-rose-100" /> Réponse bienveillante
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-[#4B4453]/60 hover:text-[#4B4453] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 stroke-[2.5px]" /> Nouveau message
                    </button>
                  </div>

                  {/* Message body */}
                  <div className="min-h-[140px] text-xs font-bold leading-relaxed text-[#4B4453] whitespace-pre-line bg-white/50 border border-amber-100 p-4 rounded-2xl italic">
                    <Quote className="w-8 h-8 text-[#FF6B6B]/20 absolute top-12 left-5 -z-10" />
                    {typedResponse || "Analyse en cours..."}
                    {typedResponse.length < aiResponse.length && (
                      <span className="inline-block w-1.5 h-4 bg-[#FF6B6B] animate-pulse ml-0.5" />
                    )}
                  </div>

                  {/* Active Mantra to copy */}
                  {activeMantra && (
                    <div className="bg-emerald-50 border-2 border-[#4B4453] border-b-4 border-r-4 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🔑</span>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-emerald-800">Mantra du moment :</p>
                          <p className="text-xs font-black text-emerald-950 mt-0.5 leading-snug">{activeMantra}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyMantra}
                        className="p-2 bg-white hover:bg-stone-50 border border-[#4B4453] rounded-lg cursor-pointer transition-all shrink-0"
                        title="Copier le mantra"
                      >
                        {isCopied ? (
                          <Check className="w-4.5 h-4.5 text-emerald-600 stroke-[3px]" />
                        ) : (
                          <Copy className="w-4.5 h-4.5 text-[#4B4453] stroke-[2px]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Grounding Exercise Card */}
                {activeGrounding && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[32px] p-6 border-2 border-stone-200 border-b-4 border-r-4 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🧘‍♀️</span>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#4B4453]">{activeGrounding.title}</h3>
                        <p className="text-[10px] text-stone-500 font-bold">Pour faire descendre la tension corporelle tout de suite.</p>
                      </div>
                    </div>

                    <div className="space-y-2 bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
                      {activeGrounding.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 text-xs">
                          <span className="w-5 h-5 rounded-full bg-stone-200 border border-stone-300 text-[10px] font-black flex items-center justify-center text-stone-600 shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-[#4B4453] font-bold leading-normal pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
