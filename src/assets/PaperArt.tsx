export default function PaperArt() {
  return (
    <div aria-hidden="true">
      <svg viewBox="0 0 640 420" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="80" y1="40" x2="560" y2="380" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.95"/>
      <stop offset="1" stop-color="white" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="g2" x1="210" y1="70" x2="460" y2="300" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.06"/>
    </linearGradient>
  </defs>

  <rect x="160" y="70" width="320" height="290" rx="26" fill="url(#g2)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <rect x="220" y="46" width="200" height="70" rx="18" fill="url(#g1)" opacity="0.45"/>
  <rect x="250" y="58" width="140" height="32" rx="12" fill="rgba(0,0,0,0.25)"/>

  <rect x="190" y="110" width="300" height="210" rx="18" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.28)"/>
  <rect x="205" y="125" width="270" height="180" rx="14" fill="rgba(255,255,255,0.12)"/>
  <path d="M230 165h220" stroke="rgba(255,255,255,0.55)" stroke-width="6" stroke-linecap="round"/>
  <path d="M230 205h200" stroke="rgba(255,255,255,0.45)" stroke-width="6" stroke-linecap="round"/>
  <path d="M230 245h160" stroke="rgba(255,255,255,0.40)" stroke-width="6" stroke-linecap="round"/>

  <g transform="translate(60 260) rotate(-18 300 80)">
    <rect x="300" y="68" width="210" height="22" rx="11" fill="rgba(255,255,255,0.34)"/>
    <rect x="300" y="68" width="70" height="22" rx="11" fill="rgba(0,0,0,0.22)"/>
    <path d="M510 79l38-11v22l-38-11z" fill="rgba(255,255,255,0.30)"/>
    <path d="M548 79l14-4v8l-14-4z" fill="rgba(0,0,0,0.35)"/>
  </g>

  <circle cx="120" cy="120" r="30" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)"/>
  <path d="M108 120h24M120 108v24" stroke="rgba(255,255,255,0.75)" stroke-width="6" stroke-linecap="round"/>

  <circle cx="530" cy="132" r="26" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)"/>
  <path d="M522 132l6 6 14-14" stroke="rgba(255,255,255,0.75)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    </div>
  );
}
