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
  { id: 'cried', text: "I yelled at my kids today... 🥺", mood: 'patience' },
  { id: 'mess', text: "The house is a total mess and I can't get anything done 🧹", mood: 'overwhelmed' },
  { id: 'bad_mom', text: "I feel like I'm a bad mom 💔", mood: 'guilt' },
  { id: 'sleep', text: "I haven't slept, I'm physically at my limit 🥱", mood: 'exhausted' },
  { id: 'alone', text: "I feel so alone carrying all this weight 👤", mood: 'isolated' }
];

// Grounding sensory exercise presets
const GROUNDING_EXERCISES: Record<MoodType, GroundingExercise> = {
  overwhelmed: {
    title: "5-Senses Grounding (Quick calm)",
    steps: [
      "Look at 3 objects around you and name their color.",
      "Touch 2 different surfaces (your clothes, the table) and feel the texture.",
      "Close your eyes and listen for 1 distant sound.",
      "Take a deep breath in through your nose, out through your mouth."
    ]
  },
  guilt: {
    title: "The Self-Compassion Gesture",
    steps: [
      "Gently place both hands flat on your heart.",
      "Feel the warmth of your hands through your clothes.",
      "Close your eyes and tell yourself: 'I'm doing my best, and that's already a lot.'",
      "Relax your shoulders and let out a sigh."
    ]
  },
  exhausted: {
    title: "Instant Recharge (Short body scan)",
    steps: [
      "Sit comfortably or lie down if you can.",
      "Let the full weight of your body sink into your support (chair, bed).",
      "Unclench your jaw, relax your forehead and the space between your eyebrows.",
      "Take 3 slow breaths, imagining gentle energy flowing in with each inhale."
    ]
  },
  patience: {
    title: "The Physiological Pause Button",
    steps: [
      "Run your hands under cool water for 15 seconds.",
      "Feel the coolness on your skin, it sends an immediate calming signal to your brain.",
      "Take a slow breath in, hold for 3 seconds, breathe out very gently.",
      "Remind yourself: 'Anger is a passing storm. I am the calm sky around it.'"
    ]
  },
  isolated: {
    title: "Grounding in the Present",
    steps: [
      "Wrap your own arms around yourself in a warm hug.",
      "Feel the strength and kindness of your own hands.",
      "Remind yourself that thousands of moms share this exact feeling right now.",
      "You're connected to them by this invisible thread of motherhood."
    ]
  },
  general: {
    title: "The Releasing Breath",
    steps: [
      "Breathe in deeply, filling your belly.",
      "Breathe out as if blowing gently on a candle without putting it out.",
      "Repeat 3 times, releasing the tension in your neck.",
      "Know that this minute is yours alone."
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
    if (lowercaseText.includes('yell') || lowercaseText.includes('shout') || lowercaseText.includes('anger') || lowercaseText.includes('angry') || lowercaseText.includes('patience')) {
      keywordsMatched.push('patience');
    }
    if (lowercaseText.includes('chores') || lowercaseText.includes('mess') || lowercaseText.includes('clutter') || lowercaseText.includes('dishes') || lowercaseText.includes('laundry') || lowercaseText.includes('tidy')) {
      keywordsMatched.push('housework');
    }
    if (lowercaseText.includes('tired') || lowercaseText.includes('exhaust') || lowercaseText.includes('sleep') || lowercaseText.includes('rest') || lowercaseText.includes('worn out') || lowercaseText.includes('night')) {
      keywordsMatched.push('exhaustion');
    }
    if (lowercaseText.includes('bad mom') || lowercaseText.includes('worthless') || lowercaseText.includes('guilty') || lowercaseText.includes('blame myself') || lowercaseText.includes('guilt')) {
      keywordsMatched.push('guilt');
    }
    if (lowercaseText.includes('alone') || lowercaseText.includes('isolat') || lowercaseText.includes('lonel') || lowercaseText.includes('partner') || lowercaseText.includes('nobody')) {
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
      sweetness: "I hear you, and I'm wrapping you in all the gentleness I can right now. Close your eyes for a moment, place your hands on your belly, and listen to this:",
      perspective: "Let's take an objective, caring step back together. What you're feeling is the logical consequence of being overloaded, not a lack of love or competence:",
      energy: "Chin up, take a deep breath, and let's put things back in perspective! You have incredible strength in you, and today we're chasing away this needless guilt:"
    };

    // Build central message paragraphs
    const paragraphs: string[] = [];
    paragraphs.push(toneIntro[tone]);

    // Construct tailored core advice based on matched keywords/moods
    keywordsMatched.forEach(key => {
      if (key === 'patience') {
        paragraphs.push(
          "It's so normal to lose patience when your tank is empty. Your yelling or frustration isn't a lack of love, it's the alarm signal of an overloaded nervous system. Your child doesn't need a perfect mom, they need a human one. Once the storm passes, a simple hug and a healing kind word ('mom was tired, I'm sorry I raised my voice') teaches your child a beautiful lesson: the right to make mistakes and the beauty of making up."
        );
      } else if (key === 'housework') {
        paragraphs.push(
          "The mess and the pile of dishes don't define your worth as a mother. A lived-in home is rarely a showroom! Scattered toys are proof of your kids' life and creativity. Tonight, chores are not your priority. Choose your rest and your mental well-being. Your kids will remember your laughter and your loving gaze on them, never the shine of your countertop."
        );
      } else if (key === 'exhaustion') {
        paragraphs.push(
          "Sleep deprivation and chronic fatigue aren't mere discomforts, they chemically alter your perception of reality and your emotions. It's scientifically normal to feel sadder, more anxious, or more irritable in this state of extreme exhaustion. You're in survival mode. Reduce all your demands to the strict minimum today. Rest isn't a luxury, it's your absolute priority."
        );
      } else if (key === 'guilt') {
        paragraphs.push(
          "Guilt is the trap of the imaginary 'perfect mom'. It's born from the immense love you have for your kids and your desire to do well. But you have the right to have limits, to be tired, and to need time for yourself. You're doing a monumental job with the tools, energy, and support you have today. You are exactly the mom your kids need."
        );
      } else if (key === 'isolation') {
        paragraphs.push(
          "Modern motherhood asks us to carry the weight of an entire village on one person's shoulders. This feeling of isolation is legitimate. You don't have to do it all alone. Don't hesitate to clearly express your limits and ask for concrete help. Getting support isn't an admission of failure, it's an act of courage and love toward yourself and your family."
        );
      } else {
        paragraphs.push(
          "Take a deep breath. What you're going through right now is intense, and everything you feel is 100% valid. You have the right to be tired, to have doubts, and to want a break. Don't confuse a hard day or a moment of overwhelm with failing at life. You're doing your best, and that's already more than enough."
        );
      }
    });

    // Concluding dynamic comfort line
    const toneOutro = {
      sweetness: "You are wrapped in love. Take care of yourself, you are the heart of your home. ❤️",
      perspective: "Remember this scientific truth: a happy, rested mom is the greatest pillar for a child. Let the rest go tonight. ⚖️",
      energy: "Stand tall, drink a big glass of water, and give yourself a well-deserved break without an ounce of regret. You're amazing! ⚡"
    };
    paragraphs.push(toneOutro[tone]);

    return paragraphs.join("\n\n");
  };

  // Get localized short mantras
  const getMantra = (mood: MoodType): string => {
    const mantras: Record<MoodType, string> = {
      overwhelmed: "I can't do everything, and that's perfectly okay. My priority is my calm. 🌸",
      guilt: "My kids don't need a perfect mom, they need a happy, peaceful mom. ❤️",
      exhausted: "Rest is a biological necessity, not a reward to earn. I allow myself to slow down. 🥱",
      patience: "I am human. My frustration is a cry for help from my tired body. I repair with love. 🧘‍♀️",
      isolated: "Asking for help isn't weakness. I deserve to be supported and surrounded. 🤝",
      general: "I'm doing my best at every moment with the energy I have. That's more than enough. ✨"
    };
    return mantras[mood];
  };

  const toneLabel = {
    sweetness: 'gentle, comforting, like a verbal hug',
    perspective: 'calm, helping to step back and reflect',
    energy: 'energetic and motivating',
  };

  const fetchAiReply = async (): Promise<string> => {
    const systemPrompt = `You are a warm, emotionally intelligent AI companion inside a mental-load app for moms. A mom just selected the mood "${selectedMood}" and may have shared something with you. Actually read and respond to what she specifically wrote - never give a generic, templated, or scripted-sounding reply. Adapt to what she really said: if she shares something emotional, comfort her genuinely; if she asks something concrete or off-topic, engage with it naturally and honestly before gently bringing warmth back in. Reply in English, in a ${toneLabel[selectedTone]} tone, in 3-4 short sentences, no lists or markdown, like a real, present friend - not a script.`;

    const userMessage = userText || `I'm feeling ${selectedMood} today and haven't written anything specific, just comfort me about this mood.`;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, system: systemPrompt }),
    });
    const data = await res.json();
    if (!res.ok || !data.answer) {
      throw new Error(data.error || 'empty response');
    }
    return data.answer as string;
  };

  const handleConsult = async () => {
    setIsGenerating(true);
    setTypedResponse('');

    let response: string;
    try {
      response = await fetchAiReply();
    } catch (err) {
      // Fall back to pre-written responses if the Mistral API is unavailable.
      console.error('AI chat request failed, using fallback response:', err);
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
              <h2 className="text-base font-black uppercase tracking-wider text-[#4B4453] font-display">My Anti-Guilt AI Ally</h2>
              <p className="text-[11px] text-stone-500 font-bold">Light, immediate psychological support to free your heart.</p>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl self-start md:self-center">
            🔒 Total privacy: Nothing is stored online
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
                <Smile className="w-4 h-4 text-purple-500" /> 1. What's weighing on your heart?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'overwhelmed', label: "Overwhelmed 🌀" },
                  { id: 'guilt', label: "Guilt 🥺" },
                  { id: 'exhausted', label: "Intense fatigue 🥱" },
                  { id: 'patience', label: "Lost my patience ⚡" },
                  { id: 'isolated', label: "Isolation 👤" },
                  { id: 'general', label: "Need to talk ✨" }
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
                <span>2. Get it off your chest (optional):</span>
                <span className="text-[9px] text-stone-400 lowercase italic normal-case">write freely, no filter</span>
              </label>
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Briefly share your hard moment, your frustration, or why you're being hard on yourself today..."
                rows={4}
                className="w-full bg-stone-50/50 border-2 border-stone-200 rounded-2xl p-3.5 text-xs text-[#4B4453] font-bold placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent resize-none leading-relaxed"
              />

              {/* Presets suggestions */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-stone-400">Quick ideas:</span>
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
                <Compass className="w-4 h-4 text-emerald-600" /> 3. Choose the AI's potion:
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'sweetness', label: "Gentleness 🌸", desc: "Verbal hug" },
                  { id: 'perspective', label: "Perspective 💡", desc: "Step back" },
                  { id: 'energy', label: "Energy ⚡", desc: "Motivation" }
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
                  <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5px]" /> Crafting kindness...
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 fill-white shrink-0" /> Talk to my AI Ally
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
                  <h3 className="font-black text-[#4B4453] uppercase tracking-wider text-sm">Ready to release your tension?</h3>
                  <p className="text-stone-500 text-xs font-bold leading-relaxed">
                    Select your current mood on the left and click "Talk" to receive tailored, guilt-freeing kind words.
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
                      <Sparkles className="w-3.5 h-3.5 fill-rose-100" /> Caring response
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-[10px] text-[#4B4453]/60 hover:text-[#4B4453] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 stroke-[2.5px]" /> New message
                    </button>
                  </div>

                  {/* Message body */}
                  <div className="min-h-[140px] text-xs font-bold leading-relaxed text-[#4B4453] whitespace-pre-line bg-white/50 border border-amber-100 p-4 rounded-2xl italic">
                    <Quote className="w-8 h-8 text-[#FF6B6B]/20 absolute top-12 left-5 -z-10" />
                    {typedResponse || "Analyzing..."}
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
                          <p className="text-[9px] font-black uppercase tracking-wider text-emerald-800">Mantra of the moment:</p>
                          <p className="text-xs font-black text-emerald-950 mt-0.5 leading-snug">{activeMantra}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyMantra}
                        className="p-2 bg-white hover:bg-stone-50 border border-[#4B4453] rounded-lg cursor-pointer transition-all shrink-0"
                        title="Copy the mantra"
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
                        <p className="text-[10px] text-stone-500 font-bold">To release physical tension right away.</p>
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
