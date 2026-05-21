/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSlider */
const { useEffect } = React;

const MWL_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "champagne",
  "filmBars": true,
  "grain": true,
  "customCursor": true,
  "heroDim": 0.4,
  "heroImage": "wedding-1"
}/*EDITMODE-END*/;

const HERO_IMAGES = {
  "wedding-1": "https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80&auto=format&fit=crop",
  "wedding-2": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=80&auto=format&fit=crop",
  "wedding-3": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2400&q=80&auto=format&fit=crop",
  "wedding-4": "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=2400&q=80&auto=format&fit=crop"
};

const PALETTES = {
  champagne: { name: "Champagne", colors: ["#F7F2EA","#0F0F10","#C8A97E"] },
  sage:      { name: "Sage",      colors: ["#F4F2EC","#1C1E1A","#9DA88B"] },
  burgundy:  { name: "Burgundy",  colors: ["#F5EFE8","#1A1110","#8C3A4A"] },
  ink:       { name: "Notte",     colors: ["#0F0F10","#F7F2EA","#C8A97E"] }
};

function applyPalette(key) {
  const root = document.documentElement;
  if (key === "sage") {
    root.style.setProperty('--ivory', '#F4F2EC');
    root.style.setProperty('--ivory-2', '#F8F6F0');
    root.style.setProperty('--paper', '#E8E6DD');
    root.style.setProperty('--ink', '#1C1E1A');
    root.style.setProperty('--ink-2', '#262824');
    root.style.setProperty('--ink-soft', '#34362F');
    root.style.setProperty('--stone', '#7C8472');
    root.style.setProperty('--champagne', '#9DA88B');
    root.style.setProperty('--champagne-deep', '#7E8B6A');
  } else if (key === "burgundy") {
    root.style.setProperty('--ivory', '#F5EFE8');
    root.style.setProperty('--ivory-2', '#FAF5EE');
    root.style.setProperty('--paper', '#E9DFD3');
    root.style.setProperty('--ink', '#1A1110');
    root.style.setProperty('--ink-2', '#2A1A18');
    root.style.setProperty('--ink-soft', '#3A2620');
    root.style.setProperty('--stone', '#8A6E66');
    root.style.setProperty('--champagne', '#8C3A4A');
    root.style.setProperty('--champagne-deep', '#6C2A38');
  } else if (key === "ink") {
    root.style.setProperty('--ivory', '#0F0F10');
    root.style.setProperty('--ivory-2', '#161618');
    root.style.setProperty('--paper', '#1E1E20');
    root.style.setProperty('--ink', '#F7F2EA');
    root.style.setProperty('--ink-2', '#EFE8DC');
    root.style.setProperty('--ink-soft', '#D8CFC0');
    root.style.setProperty('--stone', '#8A7E6D');
    root.style.setProperty('--champagne', '#C8A97E');
    root.style.setProperty('--champagne-deep', '#E0BD8E');
    root.style.setProperty('--line', 'rgba(247,242,234,0.14)');
  } else {
    root.style.setProperty('--ivory', '#F7F2EA');
    root.style.setProperty('--ivory-2', '#FBF8F4');
    root.style.setProperty('--paper', '#EFE8DC');
    root.style.setProperty('--ink', '#0F0F10');
    root.style.setProperty('--ink-2', '#1C1A18');
    root.style.setProperty('--ink-soft', '#2A2620');
    root.style.setProperty('--stone', '#8A7E6D');
    root.style.setProperty('--champagne', '#C8A97E');
    root.style.setProperty('--champagne-deep', '#A8895E');
    root.style.setProperty('--line', 'rgba(15,15,16,0.12)');
  }
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(MWL_TWEAK_DEFAULTS);

  useEffect(() => { applyPalette(t.palette); }, [t.palette]);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (t.filmBars) hero.classList.add('film-bars'); else hero.classList.remove('film-bars');
  }, [t.filmBars]);
  useEffect(() => {
    const g = document.getElementById('grain');
    if (g) g.style.display = t.grain ? '' : 'none';
  }, [t.grain]);
  useEffect(() => {
    document.body.style.cursor = t.customCursor ? 'none' : 'auto';
    ['cursorDot','cursorRing','cursorLabel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = t.customCursor ? '' : 'none';
    });
  }, [t.customCursor]);
  useEffect(() => {
    const media = document.querySelector('.hero-media');
    if (!media) return;
    media.style.setProperty('--dim', t.heroDim);
    const css = `linear-gradient(180deg, rgba(0,0,0,${Math.max(0,t.heroDim-0.1)}) 0%, rgba(0,0,0,${Math.max(0,t.heroDim-0.25)}) 35%, rgba(0,0,0,${Math.min(0.85,t.heroDim+0.15)}) 100%)`;
    let s = document.getElementById('heroDimStyle');
    if (!s) { s = document.createElement('style'); s.id = 'heroDimStyle'; document.head.appendChild(s); }
    s.textContent = `.hero-media::after{background:${css};}`;
  }, [t.heroDim]);
  useEffect(() => {
    const img = document.getElementById('heroImg');
    if (img && HERO_IMAGES[t.heroImage]) img.src = HERO_IMAGES[t.heroImage];
  }, [t.heroImage]);

  return (
    <TweaksPanel title="Tweaks · MWL">
      <TweakSection label="Palette">
        <TweakRadio
          label="Mood cromatico"
          value={t.palette}
          onChange={v => setTweak('palette', v)}
          options={[
            { value: 'champagne', label: 'Champagne' },
            { value: 'sage', label: 'Sage' },
            { value: 'burgundy', label: 'Burgundy' },
            { value: 'ink', label: 'Notte' }
          ]}
        />
      </TweakSection>
      <TweakSection label="Hero">
        <TweakRadio
          label="Immagine principale"
          value={t.heroImage}
          onChange={v => setTweak('heroImage', v)}
          options={[
            { value: 'wedding-1', label: 'Como' },
            { value: 'wedding-2', label: 'Ravello' },
            { value: 'wedding-3', label: 'Villa' },
            { value: 'wedding-4', label: 'Toscana' }
          ]}
        />
        <TweakSlider label="Intensità overlay" min={0} max={0.85} step={0.05} value={t.heroDim} onChange={v => setTweak('heroDim', v)} />
        <TweakToggle label="Barre cinematiche" value={t.filmBars} onChange={v => setTweak('filmBars', v)} />
      </TweakSection>
      <TweakSection label="Atmosfera">
        <TweakToggle label="Effetto pellicola" value={t.grain} onChange={v => setTweak('grain', v)} />
        <TweakToggle label="Cursore custom" value={t.customCursor} onChange={v => setTweak('customCursor', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
