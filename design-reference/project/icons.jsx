// Lightweight inline icon set (stroke style)
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  const s = size;
  const c = color;
  const sw = stroke;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':       return <svg {...props}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case 'trend':      return <svg {...props}><path d="M3 17l5-5 4 4 8-9"/><path d="M14 7h7v7"/></svg>;
    case 'bell':       return <svg {...props}><path d="M6 10a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/></svg>;
    case 'scan':       return <svg {...props}><path d="M4 8V5a1 1 0 011-1h3"/><path d="M20 8V5a1 1 0 00-1-1h-3"/><path d="M4 16v3a1 1 0 001 1h3"/><path d="M20 16v3a1 1 0 01-1 1h-3"/><path d="M3 12h18"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'back':       return <svg {...props}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'close':      return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l4 4 10-10"/></svg>;
    case 'minus':      return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'more':       return <svg {...props}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>;
    case 'share':      return <svg {...props}><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/></svg>;
    case 'mail':       return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case 'shield':     return <svg {...props}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'link':       return <svg {...props}><path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 10-5.66-5.66L11 7"/><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66L13 17"/></svg>;
    case 'box':        return <svg {...props}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4"/><path d="M12 11v10"/></svg>;
    case 'clock':      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'sun':        return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>;
    case 'moon':       return <svg {...props}><path d="M21 14A9 9 0 1110 3a7 7 0 0011 11z"/></svg>;
    case 'pill':       return <svg {...props}><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="M9 6l6 12" transform="rotate(-30 12 12)"/></svg>;
    case 'flask':      return <svg {...props}><path d="M9 3h6"/><path d="M10 3v6L5 18a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/></svg>;
    case 'edit':       return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>;
    case 'trash':      return <svg {...props}><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/><path d="M9 7V4h6v3"/></svg>;
    case 'calendar':   return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'camera':     return <svg {...props}><path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'qr':         return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/></svg>;
    case 'image':      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>;
    case 'spark':      return <svg {...props}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z"/></svg>;
    case 'flag':       return <svg {...props}><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></svg>;
    case 'flame':      return <svg {...props}><path d="M12 3s5 4 5 9a5 5 0 11-10 0c0-2 1-3 1-3s1 2 2 2c1-3-1-5 2-8z"/></svg>;
    case 'menu':       return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case 'search':     return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'chevron':    return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'send':       return <svg {...props}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    default:           return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

window.Icon = Icon;
