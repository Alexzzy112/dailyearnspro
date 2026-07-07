'use client';
import { useEffect, useState, useRef } from 'react';
import { HiDownload } from 'react-icons/hi';

export default function InstallAppButton() {
  const deferredPrompt = useRef<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setShow(false);
      deferredPrompt.current = null;
    };
    window.addEventListener('appinstalled', installedHandler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShow(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const result = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    if (result.outcome === 'accepted') setShow(false);
  };

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="group relative overflow-hidden gradient-orange rounded-xl p-3.5 text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 w-full text-left"
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
      <div className="relative flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 shrink-0">
          <HiDownload className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">Get App</p>
          <p className="text-[11px] text-orange-100 mt-0.5">Install now</p>
        </div>
      </div>
    </button>
  );
}
