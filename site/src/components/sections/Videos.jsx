import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Terminal } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { videos } from '../../data/content';

export function Videos() {
  const [active, setActive] = useState(0);
  const v = videos[active];

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Nos réalisations · vidéo</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
              La cryogénie, <span className="text-white/50">en action.</span>
            </h2>
          </div>
          <p className="max-w-md text-white/60">
            Aucune mise en scène — des chantiers réels, filmés sur place, en Nouvelle-Aquitaine.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main player */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="terminal-frame relative aspect-video w-full overflow-hidden rounded-2xl lg:col-span-8"
          >
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-amber-300/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
              <Terminal className="ml-3 h-3 w-3 text-cyan-glow/70" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                stream / cryo-{String(active + 1).padStart(2, '0')}.mp4
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="aspect-video w-full"
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Playlist */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            {videos.map((vid, i) => (
              <button
                type="button"
                key={vid.id}
                onClick={() => setActive(i)}
                className={`group relative flex items-center gap-4 rounded-xl border p-4 text-left transition cursor-pointer ${
                  i === active
                    ? 'border-cyan-glow/40 bg-cyan-glow/[0.05]'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black">
                  <img
                    src={`https://i.ytimg.com/vi/${vid.id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-glow/80">
                    {String(i + 1).padStart(2, '0')} · YouTube
                  </div>
                  <div className="mt-1 truncate text-sm text-white/85">{vid.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
