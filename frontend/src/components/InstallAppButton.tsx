'use client';
import { useEffect, useState } from 'react';
import { HiDownload } from 'react-icons/hi';

let deferredPrompt: any = null;

export default function InstallAppButton() {
  const [installable, setInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setInstalled(true);
      setInstallable(false);
      deferredPrompt = null;
    };
    window.addEventListener('appinstalled', installedHandler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      deferredPrompt = null;
      setInstallable(false);
      if (result.outcome === 'accepted') setInstalled(true);
    } else if (!installed) {
      window.open('/manifest.json', '_blank');
    }
  };

  if (installed) return null;

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
