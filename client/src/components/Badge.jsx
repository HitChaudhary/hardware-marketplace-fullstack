// Badge — written in Tailwind. Uses the CSS token colors (acc, grn, red, amb, t3)
// mapped through tailwind.config.js, so it respects light/dark mode automatically.

const VARIANTS = {
  new:       'bg-grn/15 text-grn',
  sale:      'bg-red/15 text-red',
  hot:       'bg-amb/15 text-amb',
  refurb:    'bg-pur/20 text-pur',
  in:        'bg-grn/15 text-grn',
  low:       'bg-amb/15 text-amb',
  out:       'bg-red/15 text-red',
  new_inq:   'bg-acc/15 text-acc',
  contacted: 'bg-grn/15 text-grn',
  closed:    'bg-t3/20 text-t3',
  default:   'bg-s1 text-t2 border border-b2',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  const cls = VARIANTS[variant] || VARIANTS.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${cls} ${className}`}>
      {children}
    </span>
  );
}
