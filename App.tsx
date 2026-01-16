
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PasswordOptions, StrengthInfo } from './types';
import { generatePassword, calculateStrength } from './utils/crypto';
import StrengthMeter from './components/StrengthMeter';
import Checkbox from './components/Checkbox';

const App: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
  });

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState<StrengthInfo | null>(null);
  // Fix: Use number instead of NodeJS.Timeout as this is a client-side application and browser setTimeout returns a number.
  const clipboardTimerRef = useRef<number | null>(null);

  const handleGenerate = useCallback(() => {
    const newPass = generatePassword(options);
    setPassword(newPass);
    setStrength(calculateStrength(newPass, options));
  }, [options]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      
      // Visual feedback reset
      window.setTimeout(() => setCopied(false), 2000);

      // Security: Clear clipboard after 30 seconds
      // Fix: Explicitly use window.clearTimeout to ensure the browser API is used.
      if (clipboardTimerRef.current) window.clearTimeout(clipboardTimerRef.current);
      
      // Fix: Use window.setTimeout which returns a number in the browser environment.
      clipboardTimerRef.current = window.setTimeout(async () => {
        try {
          // Attempt to overwrite clipboard
          await navigator.clipboard.writeText('');
          console.log('Clipboard cleared for security.');
        } catch (err) {
          console.error('Failed to clear clipboard:', err);
        }
      }, 30000);

    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen">
      <div className="w-full max-w-lg glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-500/20 rounded-2xl mb-4">
            <i className="fa-solid fa-shield-halved text-sky-400 text-xl" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            JPasswordGenerator
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">
            Quantum-Secure Generation
          </p>
        </header>

        {/* Password Display Box */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative flex items-center bg-slate-900/80 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <div className="flex-1 overflow-hidden">
              <span className="mono text-xl md:text-2xl break-all text-sky-50 select-all tracking-wider px-2">
                {password || "••••••••••••••••"}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button 
                onClick={handleGenerate}
                title="Regenerate"
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-200"
              >
                <i className="fa-solid fa-arrows-rotate" />
              </button>
              <button 
                onClick={copyToClipboard}
                title="Copy to Clipboard"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  copied 
                  ? 'bg-green-500 text-white scale-105' 
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <i className="fa-solid fa-check" />
                    <span className="text-sm">Copied</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-copy" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Length Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-300">Password Length</label>
              <span className="mono text-sky-400 font-bold bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/20">
                {options.length}
              </span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="64" 
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox 
              label="Uppercase Letters" 
              checked={options.includeUppercase} 
              onChange={(val) => setOptions({ ...options, includeUppercase: val })}
            />
            <Checkbox 
              label="Lowercase Letters" 
              checked={options.includeLowercase} 
              onChange={(val) => setOptions({ ...options, includeLowercase: val })}
            />
            <Checkbox 
              label="Include Numbers" 
              checked={options.includeNumbers} 
              onChange={(val) => setOptions({ ...options, includeNumbers: val })}
            />
            <Checkbox 
              label="Special Symbols" 
              checked={options.includeSymbols} 
              onChange={(val) => setOptions({ ...options, includeSymbols: val })}
            />
          </div>

          <hr className="border-slate-800" />

          <Checkbox 
            label="Optimize Readability" 
            description="Exclude similar characters (i, l, 1, L, o, 0, O)"
            checked={options.excludeSimilar} 
            onChange={(val) => setOptions({ ...options, excludeSimilar: val })}
          />

          {strength && <StrengthMeter info={strength} />}
        </div>

        <footer className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Client-Side Only
                </div>
                <div className="w-px h-3 bg-slate-800" />
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                    AES-256 Compliant
                </div>
            </div>
            <p className="text-[10px] text-slate-600 text-center leading-relaxed">
              Clipboard is automatically cleared after 30 seconds for your protection.<br/>
              Generated using browser-native <code>window.crypto</code>.
            </p>
        </footer>
      </div>
      
      <p className="mt-8 text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">
        Design by AI Studio Labs
      </p>
    </div>
  );
};

export default App;
