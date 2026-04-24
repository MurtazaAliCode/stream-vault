'use client'

import { useState, useEffect, useRef } from 'react'
import { resolveUrl, VideoMeta, PLATFORM_CONFIG } from '@/lib/resolver'
import VideoPlayer from '@/components/VideoPlayer'
import HistoryPanel from '@/components/HistoryPanel'
import AffiliateBanner from '@/components/AffiliateBanner'
import LanguageSelector, { LANGUAGES } from '@/components/LanguageSelector'

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', color: '#ff0000' },
  { name: 'Vimeo', color: '#1ab7ea' },
  { name: 'Twitch', color: '#9146ff' },
  { name: 'Dailymotion', color: '#0066dc' },
  { name: 'Streamable', color: '#00f5c4' },
  { name: 'Facebook', color: '#1877f2' },
  { name: 'Direct MP4', color: '#a78bfa' },
  { name: '+ More', color: '#ff6b35' },
]

const TRANSLATIONS: any = {
  en: {
    tagline: 'Paste any video link from anywhere — watch it instantly, distraction-free',
    placeholder: 'Paste any video link — YouTube, Vimeo, Twitch, Dailymotion, and more...',
    play: 'PLAY',
    history: 'History',
    newVideo: 'New Video',
    copyLink: 'Copy Link',
    openOriginal: 'Open Original',
    save: 'Save',
    share: 'Share with friends',
    howItWorks: 'How it works',
    step1Title: 'Paste Your Link',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion, or any direct video URL',
    step2Title: 'Auto Detected',
    step2Desc: 'Platform is detected automatically — no settings required',
    step3Title: 'Watch & Enjoy',
    step3Desc: 'Enjoy your video in a clean, distraction-free player',
    statsSupported: 'Supported Platforms',
    statsDownloads: 'Total Downloads',
    statsActive: 'Active Users',
    statsFree: 'Free Forever',
    back: 'STREAMVAULT'
  },
  ur: {
    tagline: 'کہیں سے بھی ویڈیو لنک پیسٹ کریں — فوراً دیکھیں، بغیر کسی رکاوٹ کے',
    placeholder: 'ویڈیو لنک پیسٹ کریں — یوٹیوب، ویمیو، ٹویچ، ڈیلی موشن اور مزید...',
    play: 'چلائیں',
    history: 'تاریخ',
    newVideo: 'نئی ویڈیو',
    copyLink: 'لنک کاپی',
    openOriginal: 'اصل دیکھیں',
    save: 'محفوظ',
    share: 'دوستوں کے ساتھ شیئر کریں',
    howItWorks: 'یہ کیسے کام کرتا ہے',
    step1Title: 'لنک پیسٹ کریں',
    step1Desc: 'یوٹیوب، ویمیو، ٹویچ، یا کوئی بھی ڈائریکٹ ویڈیو لنک',
    step2Title: 'خودکار تشخیص',
    step2Desc: 'پلیٹ فارم خود بخود پہچان لیا جاتا ہے',
    step3Title: 'دیکھیں اور لطف اٹھائیں',
    step3Desc: 'ایک صاف اور بہتر پلیئر میں ویڈیو کا لطف لیں',
    statsSupported: 'سپورٹڈ پلیٹ فارمز',
    statsDownloads: 'کل ڈاؤن لوڈز',
    statsActive: 'ایکٹو صارفین',
    statsFree: 'ہمیشہ مفت',
    back: 'اسٹریم والٹ'
  },
  hi: {
    tagline: 'कहीं से भी वीडियो लिंक पेस्ट करें — तुरंत देखें, बिना किसी रुकावट के',
    placeholder: 'वीडियो लिंक पेस्ट करें — YouTube, Vimeo, Twitch, Dailymotion और अधिक...',
    play: 'चलाएं',
    history: 'इतिहास',
    newVideo: 'नई वीडियो',
    copyLink: 'लिंक कॉपी',
    openOriginal: 'ओरिजिनल देखें',
    save: 'सहेजें',
    share: 'दोस्तों के साथ साझा करें',
    howItWorks: 'यह कैसे काम करता है',
    step1Title: 'लिंक पेस्ट करें',
    step1Desc: 'YouTube, Vimeo, Twitch, या कोई भी डायरेक्ट वीडियो लिंक',
    step2Title: 'ऑटो डिटेक्टेड',
    step2Desc: 'प्लेटफॉर्म स्वचालित रूप से पहचाना जाता है',
    step3Title: 'देखें और आनंद लें',
    step3Desc: 'एक साफ और बेहतर प्लेयर में वीडियो का आनंद लें',
    statsSupported: 'सपोर्टेड प्लेटफॉर्म',
    statsDownloads: 'कुल डाउनलोड',
    statsActive: 'एक्टिव यूजर्स',
    statsFree: 'हमेशा फ्री',
    back: 'स्ट्रीमवॉल्ट'
  },
  es: {
    tagline: 'Pega cualquier enlace de video desde cualquier lugar — míralo al instante, sin distracciones',
    placeholder: 'Pega cualquier enlace de video — YouTube, Vimeo, Twitch, Dailymotion y más...',
    play: 'REPRODUCIR',
    history: 'Historial',
    newVideo: 'Nuevo Video',
    copyLink: 'Copiar Enlace',
    openOriginal: 'Abrir Original',
    save: 'Guardar',
    share: 'Compartir con amigos',
    howItWorks: 'Cómo funciona',
    step1Title: 'Pega tu Enlace',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion o cualquier URL directa',
    step2Title: 'Auto Detectado',
    step2Desc: 'La plataforma se detecta automáticamente',
    step3Title: 'Mira y Disfruta',
    step3Desc: 'Disfruta de tu video en un reproductor limpio',
    statsSupported: 'Plataformas',
    statsDownloads: 'Descargas Totales',
    statsActive: 'Usuarios Activos',
    statsFree: 'Gratis Siempre',
    back: 'STREAMVAULT'
  },
  fr: {
    tagline: 'Collez n\'importe quel lien vidéo de n\'importe où — regardez-le instantanément, sans distraction',
    placeholder: 'Collez un lien vidéo — YouTube, Vimeo, Twitch, Dailymotion et plus...',
    play: 'LIRE',
    history: 'Historique',
    newVideo: 'Nouvelle Vidéo',
    copyLink: 'Copier le Lien',
    openOriginal: 'Ouvrir l\'Original',
    save: 'Enregistrer',
    share: 'Partager avec des amis',
    howItWorks: 'Comment ça marche',
    step1Title: 'Collez votre Lien',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion ou toute URL directe',
    step2Title: 'Auto Détecté',
    step2Desc: 'La plateforme est détectée automatiquement',
    step3Title: 'Regardez et Profitez',
    step3Desc: 'Profitez de votre vidéo dans un lecteur propre',
    statsSupported: 'Plateformes',
    statsDownloads: 'Téléchargements',
    statsActive: 'Utilisateurs Actifs',
    statsFree: 'Gratuit Toujours',
    back: 'STREAMVAULT'
  },
  de: {
    tagline: 'Fügen Sie einen Videolink ein — schauen Sie sofort, ohne Ablenkungen',
    placeholder: 'Videolink einfügen — YouTube, Vimeo, Twitch, Dailymotion und mehr...',
    play: 'ABSPIELEN',
    history: 'Verlauf',
    newVideo: 'Neues Video',
    copyLink: 'Link Kopieren',
    openOriginal: 'Original Öffnen',
    save: 'Speichern',
    share: 'Mit Freunden teilen',
    howItWorks: 'Wie es funktioniert',
    step1Title: 'Link Einfügen',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion oder direkte URL',
    step2Title: 'Auto-Erkennung',
    step2Desc: 'Plattform wird automatisch erkannt',
    step3Title: 'Ansehen & Genießen',
    step3Desc: 'Genießen Sie Ihr Video in einem sauberen Player',
    statsSupported: 'Plattformen',
    statsDownloads: 'Downloads Gesamt',
    statsActive: 'Aktive Nutzer',
    statsFree: 'Immer Kostenlos',
    back: 'STREAMVAULT'
  },
  ar: {
    tagline: 'الصق أي رابط فيديو من أي مكان - شاهده على الفور ، دون تشتيت الانتباه',
    placeholder: 'الصق أي رابط فيديو - YouTube و Vimeo و Twitch و Dailymotion والمزيد...',
    play: 'تشغيل',
    history: 'السجل',
    newVideo: 'فيديو جديد',
    copyLink: 'نسخ الرابط',
    openOriginal: 'فتح الأصلي',
    save: 'حفظ',
    share: 'شارك مع الأصدقاء',
    howItWorks: 'كيف يعمل',
    step1Title: 'الصق الرابط الخاص بك',
    step1Desc: 'YouTube أو Vimeo أو Twitch أو Dailymotion أو أي رابط مباشر',
    step2Title: 'اكتشاف تلقائي',
    step2Desc: 'يتم اكتشاف المنصة تلقائيًا - لا يلزم ضبط إعدادات',
    step3Title: 'شاهد واستمتع',
    step3Desc: 'استمتع بالفيديو الخاص بك في مشغل نظيف وخالٍ من التشتت',
    statsSupported: 'المنصات المدعومة',
    statsDownloads: 'إجمالي التحميلات',
    statsActive: 'المستخدمين النشطين',
    statsFree: 'مجاني للأبد',
    back: 'ستريم فولت'
  },
  pt: {
    tagline: 'Cole qualquer link de vídeo de qualquer lugar — assista instantaneamente, sem distrações',
    placeholder: 'Cole qualquer link de vídeo — YouTube, Vimeo, Twitch, Dailymotion e mais...',
    play: 'REPRODUZIR',
    history: 'Histórico',
    newVideo: 'Novo Vídeo',
    copyLink: 'Copiar Link',
    openOriginal: 'Abrir Original',
    save: 'Salvar',
    share: 'Compartilhar com amigos',
    howItWorks: 'Como funciona',
    step1Title: 'Cole seu Link',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion ou qualquer URL direta',
    step2Title: 'Auto Detectado',
    step2Desc: 'Plataforma detectada automaticamente',
    step3Title: 'Assista e Aproveite',
    step3Desc: 'Aproveite seu vídeo em um player limpo',
    statsSupported: 'Plataformas',
    statsDownloads: 'Total de Downloads',
    statsActive: 'Usuários Ativos',
    statsFree: 'Grátis Sempre',
    back: 'STREAMVAULT'
  },
  ru: {
    tagline: 'Вставьте любую ссылку на видео — смотрите мгновенно, без рекламы',
    placeholder: 'Вставьте ссылку на видео — YouTube, Vimeo, Twitch, Dailymotion и др.',
    play: 'ИГРАТЬ',
    history: 'История',
    newVideo: 'Новое видео',
    copyLink: 'Копировать',
    openOriginal: 'Открыть оригинал',
    save: 'Сохранить',
    share: 'Поделиться',
    howItWorks: 'Как это работает',
    step1Title: 'Вставьте ссылку',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion или прямая ссылка',
    step2Title: 'Автоопределение',
    step2Desc: 'Платформа определяется автоматически',
    step3Title: 'Смотрите и наслаждайтесь',
    step3Desc: 'Наслаждайтесь видео в чистом плеере',
    statsSupported: 'Платформы',
    statsDownloads: 'Всего скачиваний',
    statsActive: 'Активные пользователи',
    statsFree: 'Всегда бесплатно',
    back: 'STREAMVAULT'
  },
  ja: {
    tagline: 'どこからでもビデオリンクを貼り付けます — すぐに、気を散らすことなく視聴できます',
    placeholder: 'ビデオリンクを貼り付け — YouTube、Vimeo、Twitch, Dailymotionなど...',
    play: '再生',
    history: '履歴',
    newVideo: '新しいビデオ',
    copyLink: 'リンクをコピー',
    openOriginal: 'オリジナルを開く',
    save: '保存',
    share: '友達と共有',
    howItWorks: '使い方',
    step1Title: 'リンクを貼り付け',
    step1Desc: 'YouTube, Vimeo, Twitch, または直接の動画URL',
    step2Title: '自動検出',
    step2Desc: 'プラットフォームは自動的に検出されます',
    step3Title: '見て楽しむ',
    step3Desc: 'クリーンなプレーヤーでビデオをお楽しみください',
    statsSupported: '対応プラットフォーム',
    statsDownloads: '総ダウンロード数',
    statsActive: 'アクティブユーザー',
    statsFree: '永久無料',
    back: 'ストリームヴォルト'
  },
  it: {
    tagline: 'Incolla qualsiasi link video da qualsiasi luogo — guardalo istantaneamente, senza distrazioni',
    placeholder: 'Incolla link video — YouTube, Vimeo, Twitch, Dailymotion e altro...',
    play: 'PLAY',
    history: 'Cronologia',
    newVideo: 'Nuovo Video',
    copyLink: 'Copia Link',
    openOriginal: 'Apri Originale',
    save: 'Salva',
    share: 'Condividi con amici',
    howItWorks: 'Come funziona',
    step1Title: 'Incolla il Link',
    step1Desc: 'YouTube, Vimeo, Twitch, Dailymotion o qualsiasi URL diretto',
    step2Title: 'Auto Rilevato',
    step2Desc: 'La piattaforma viene rilevata automaticamente',
    step3Title: 'Guarda e Divertiti',
    step3Desc: 'Goditi il tuo video in un player pulito',
    statsSupported: 'Piattaforme',
    statsDownloads: 'Download Totali',
    statsActive: 'Utenti Attivi',
    statsFree: 'Sempre Gratis',
    back: 'STREAMVAULT'
  }
}


export default function Home() {
  const [url, setUrl] = useState('')
  const [meta, setMeta] = useState<VideoMeta | null>(null)
  const [history, setHistory] = useState<VideoMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [lang, setLang] = useState<string>('en')
  const inputRef = useRef<HTMLInputElement>(null)

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sv_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  function saveToHistory(m: VideoMeta) {
    setHistory(prev => {
      const filtered = prev.filter(h => h.originalUrl !== m.originalUrl)
      const updated = [m, ...filtered].slice(0, 20)
      localStorage.setItem('sv_history', JSON.stringify(updated))
      return updated
    })
  }

  function handlePlay() {
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please paste a video link first!')
      return
    }
    setError('')
    setLoading(true)

    // Small delay for UX
    setTimeout(() => {
      const resolved = resolveUrl(trimmed)
      setMeta(resolved)
      saveToHistory(resolved)
      setLoading(false)
    }, 600)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handlePlay()
    if (e.key === 'Escape') {
      setUrl('')
      setMeta(null)
      setError('')
    }
  }

  function handleHistoryClick(m: VideoMeta) {
    setUrl(m.originalUrl)
    setMeta(m)
    setShowHistory(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClear() {
    setMeta(null)
    setUrl('')
    setError('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const platformConfig = meta ? PLATFORM_CONFIG[meta.platform] : null

  return (
    <>
      <LanguageSelector current={lang} onChange={setLang} />
      <div className="min-h-screen grid-bg relative overflow-x-hidden" style={{ direction: (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr' }}>

        {/* ── Ambient orbs ─────────────────────────────────── */}
        <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,245,196,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="fixed top-1/2 left-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative z-10">

          {/* ── Header ─────────────────────────────────────── */}
          {!meta && (
            <header className="text-center mb-16 animate-float">

              {/* Logo mark */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 relative group"
                style={{ background: 'linear-gradient(135deg, rgba(0,245,196,0.1), rgba(0,245,196,0.02))', border: '1px solid rgba(0,245,196,0.2)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative z-10 drop-shadow-[0_0_8px_rgba(0,245,196,0.5)]">
                  <path d="M5 3L19 12L5 21V3Z" fill="url(#logo-grad)" />
                  <defs>
                    <linearGradient id="logo-grad" x1="5" y1="3" x2="19" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00f5c4" />
                      <stop offset="1" stopColor="#00d1a7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 plasma-glow" />
                <div className="absolute -inset-1 bg-[#00f5c4] blur-2xl opacity-10 rounded-full" />
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                className="text-3xl sm:text-5xl md:text-8xl text-white mb-3 tracking-tighter uppercase px-2">
                {lang === 'en' ? 'STREAM' : ''}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5c4] to-[#00d1a7]">{lang === 'en' ? 'VAULT' : t.back}</span>
              </h1>

              <p className="text-ghost text-base sm:text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed px-4">
                {t.tagline}
              </p>


              {/* Supported platforms */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {SUPPORTED_PLATFORMS.map(p => (
                  <span key={p.name} className="platform-badge text-xs"
                    style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}08` }}>
                    {p.name}
                  </span>
                ))}
              </div>
            </header>
          )}

          {/* ── Compact header when video is playing ─────── */}
          {meta && (
            <div className="flex items-center justify-between mb-8">
              <button onClick={handleClear}
                className="flex items-center gap-2 text-ghost hover:text-white transition-colors group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em', fontSize: '18px' }}
                  className="group-hover:text-white transition-colors uppercase">
                  {lang === 'en' ? 'STREAM' : ''}<span style={{ color: '#00f5c4' }}>{lang === 'en' ? 'VAULT' : t.back}</span>
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                  </svg>
                  {t.history}
                </button>
              </div>

            </div>
          )}

          {/* ── URL Input ───────────────────────────────────── */}
          <div className="mb-8">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholder}
                  className="url-input w-full h-14 px-5 pr-12 rounded-xl text-white placeholder-ghost font-light text-sm md:text-base transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-body)',
                    direction: (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr'
                  }}
                  autoFocus
                />
                {url && (
                  <button onClick={() => { setUrl(''); setError(''); inputRef.current?.focus() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost hover:text-white transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={handlePlay}
                disabled={loading}
                className="h-14 px-7 rounded-xl font-medium transition-all relative overflow-hidden group w-full sm:w-auto"
                style={{
                  background: loading ? 'rgba(0,245,196,0.2)' : '#00f5c4',
                  color: '#050508',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  fontSize: '16px',
                  minWidth: '140px',
                }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      ...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      {t.play}
                    </>
                  )}
                </span>
              </button>

              {history.length > 0 && !meta && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="h-14 px-4 rounded-xl transition-all sm:hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
                    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              )}
              {history.length > 0 && !meta && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="h-14 px-4 rounded-xl transition-all hidden sm:block"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
                  </svg>
                </button>
              )}
            </div>

            {error && (
              <p className="mt-2 text-sm pl-1" style={{ color: '#ff6b35' }}>{error}</p>
            )}

            <p className="mt-2 text-xs pl-1" style={{ color: '#444460' }}>
              Press Enter or click PLAY &nbsp;·&nbsp; Press ESC to clear
            </p>
          </div>

          {/* ── History Panel ────────────────────────────────── */}
          {showHistory && (
            <HistoryPanel
              history={history}
              onSelect={handleHistoryClick}
              onClose={() => setShowHistory(false)}
              onClear={() => {
                setHistory([])
                localStorage.removeItem('sv_history')
                setShowHistory(false)
              }}
            />
          )}

          {/* ── Video Player ─────────────────────────────────── */}
          {meta && !showHistory && (
            <div>
              {/* Platform badge + title */}
              <div className="flex items-center gap-3 mb-4">
                {platformConfig && (
                  <span className="platform-badge text-xs"
                    style={{ color: platformConfig.color, borderColor: `${platformConfig.color}40`, background: `${platformConfig.color}10` }}>
                    {platformConfig.icon} {platformConfig.label}
                  </span>
                )}
                <span className="text-ghost text-sm truncate max-w-sm">
                  {meta.originalUrl}
                </span>
              </div>

              <VideoPlayer meta={meta} />

              {/* Actions row */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={() => { navigator.clipboard?.writeText(meta.originalUrl) }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {t.copyLink}
                </button>

                <a href={meta.originalUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {t.openOriginal}
                </a>

                {/* Save Button (Replacing Download) */}
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(0,245,196,0.1)', border: '1px solid rgba(0,245,196,0.25)', color: '#00f5c4' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {t.save}
                </button>

                <button onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ml-auto"
                  style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.15)', color: '#00f5c4' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t.newVideo}
                </button>
              </div>

              {/* Social Share Buttons */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="text-xs text-ghost uppercase tracking-widest mb-4 font-semibold opacity-50">{t.share}</div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check out this awesome video on StreamVault: ' + meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)', color: '#25D366' }}>
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Watching this on StreamVault: ' + meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                    Twitter / X
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(meta.originalUrl)}`, '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.2)', color: '#1877F2' }}>
                    Facebook
                  </button>
                </div>
              </div>

              {/* Affiliate Banners */}
              <div className="mt-5 flex flex-col gap-2">
                <AffiliateBanner variant="nordvpn" />
                <AffiliateBanner variant="movavi" />
              </div>
            </div>
          )}

          {/* ── How it works (shown when idle) ───────────────── */}
          {!meta && !showHistory && (
            <>
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: '01', title: t.step1Title, desc: t.step1Desc, color: '#00f5c4' },
                  { num: '02', title: t.step2Title, desc: t.step2Desc, color: '#a78bfa' },
                  { num: '03', title: t.step3Title, desc: t.step3Desc, color: '#ff6b35' },
                ].map(step => (
                  <div key={step.num}
                    className="p-6 rounded-2xl animated-border relative overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: `${step.color}20`, lineHeight: 1 }}
                      className="absolute top-4 right-5">{step.num}</div>
                    <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                      style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
                    </div>
                    <h3 className="text-white font-medium mb-2">{step.title}</h3>
                    <p className="text-ghost text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              {/* ── Stats Section ──────────────────────────────────── */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: t.statsSupported, value: '10+' },
                  { label: t.statsDownloads, value: '1.2M+' },
                  { label: t.statsActive, value: '50K+' },
                  { label: t.statsFree, value: '100%' },
                ].map(stat => (
                  <div key={stat.label} className="p-6 rounded-2xl transition-all hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                    <div className="text-ghost text-xs md:text-sm uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="text-center py-12 mt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col items-center gap-6">
              <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.2em', color: '#00f5c4' }} className="text-sm font-bold opacity-80">
                STREAMVAULT
              </span>
              
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.2em] font-bold">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span style={{ color: '#1a1a28' }}>·</span>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span style={{ color: '#1a1a28' }}>·</span>
                <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
              </div>

              <div className="h-px w-12 bg-white/10" />

              <span className="text-ghost opacity-40 text-[10px] tracking-widest">
                © 2026 STREAMVAULT · UNIVERSAL VIDEO PLAYER
              </span>
            </div>
          </footer>

      </div>
    </>
  )
}
