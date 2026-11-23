'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import type { ColorOption } from '@/types';

export function SizePicker({ sizes, value, onChange, id }: { sizes: string[]; value: string; onChange: (s: string) => void; id: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">Size</legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === s}
            onClick={() => onChange(s)}
            className={cn('relative min-w-14 rounded-xl border px-4 py-2 text-sm font-semibold transition', value === s ? 'border-slate-900 text-white' : 'border-slate-200 hover:border-slate-400')}
          >
            {value === s && <motion.span layoutId={`size-${id}`} className="absolute inset-0 rounded-[10px] bg-slate-900" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ColorPicker({ colors, value, onChange }: { colors: ColorOption[]; value: string; onChange: (c: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">
        Color: <span className="font-normal text-slate-600">{value}</span>
      </legend>
      <div className="flex gap-3">
        {colors.map((c) => (
          <motion.button
            key={c.name}
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            aria-label={c.name}
            aria-pressed={value === c.name}
            onClick={() => onChange(c.name)}
            className={cn('h-9 w-9 rounded-full border border-black/10 ring-offset-2 transition', value === c.name && 'ring-2 ring-slate-900')}
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </fieldset>
  );
}
