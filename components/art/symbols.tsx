// ภาพสัญลักษณ์ประจำไพ่ (SVG) วาดใน viewBox 200x300 พื้นที่ภาพอยู่ราว y 50–230
// สีมาตรฐาน: ทอง #f2c14e / ขาวม่วง #f6ecff / ม่วง #3b1d70
const GOLD = "#f2c14e";
const LIGHT = "#f6ecff";

function Sun() {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <g>
      <g className="art-spin" style={{ transformOrigin: "100px 140px" }}>
        {rays.map((a) => (
          <polygon key={a} points="100,70 94,92 106,92" fill={GOLD} transform={`rotate(${a} 100 140)`} opacity={a % 45 === 0 ? 1 : 0.6} />
        ))}
      </g>
      <circle cx="100" cy="140" r="30" fill={GOLD} />
      <circle cx="100" cy="140" r="22" fill="none" stroke="#fff3c4" strokeWidth="2" />
      <path d="M90 136 q4 -5 8 0 M102 136 q4 -5 8 0" stroke="#7a4b00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M92 148 q8 8 16 0" stroke="#7a4b00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Tower() {
  return (
    <g>
      <path d="M60 230 H140" stroke={GOLD} strokeWidth="2" />
      <path d="M82 230 V120 H78 V104 H90 V112 H96 V104 H104 V112 H110 V104 H122 V120 H118 V230 Z" fill="#5a2da0" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="95" y="190" width="10" height="22" rx="5" fill="#140a24" stroke={GOLD} strokeWidth="2" />
      <rect x="95" y="145" width="10" height="16" rx="5" fill="#140a24" stroke={GOLD} strokeWidth="2" />
      <polygon className="art-flash" transform="translate(26 -4)" points="132,60 112,112 126,112 108,160 150,96 134,96 146,60" fill="#fff3c4" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
      {[[56, 86], [150, 150], [64, 168], [146, 64]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={LIGHT} className="art-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

function Fool() {
  return (
    <g>
      <circle cx="140" cy="90" r="18" fill={GOLD} opacity="0.9" />
      <path d="M40 230 L40 190 Q60 178 90 184 L120 186 Q150 188 160 230 Z" fill="#5a2da0" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
      <g className="art-bob" transform="translate(0 2)">
        <path d="M98 168 L80 128 L116 128 Z" fill={LIGHT} stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="98" cy="112" r="13" fill="#fff3c4" stroke={GOLD} strokeWidth="2.5" />
        <path d="M86 104 q12 -18 24 0" fill={GOLD} stroke={GOLD} strokeWidth="2" />
        <path d="M112 134 L136 118" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="116" r="8" fill="#3b1d70" stroke={GOLD} strokeWidth="2.5" />
        <path d="M92 168 v18 M104 168 v18" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M170 190 q-18 -4 -24 -22" stroke={GOLD} strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="3 5" />
    </g>
  );
}


const PURPLE = "#5a2da0";
const DARK = "#140a24";
const PALE = "#fff3c4";
const stroke = { stroke: GOLD, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// คนแบบเรขาคณิต: หัว + ชุดคลุมสามเหลี่ยม (x = กึ่งกลาง, top = ยอดหัว)
function Person({ x, top, h = 70, robe = LIGHT, w = 0.5 }: { x: number; top: number; h?: number; robe?: string; w?: number }) {
  const r = h * 0.15;
  const by = top + r * 2 + 2;
  return (
    <g>
      <circle cx={x} cy={top + r} r={r} fill={PALE} {...stroke} />
      <path d={`M${x} ${by} L${x - h * w} ${top + h} L${x + h * w} ${top + h} Z`} fill={robe} {...stroke} />
    </g>
  );
}

function Stars({ pts }: { pts: number[][] }) {
  return (
    <>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill={LIGHT} className="art-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </>
  );
}

function Magician() {
  return (
    <g>
      <path d="M78 80 c0 -14 22 -14 22 0 s22 14 22 0 s-22 -14 -22 0 s-22 14 -22 0" fill="none" {...stroke} className="art-twinkle" />
      <Person x={100} top={96} h={90} robe={LIGHT} />
      <path d="M112 122 L130 92" {...stroke} strokeWidth="3" />
      <circle cx="131" cy="90" r="3" fill={GOLD} />
      <rect x="52" y="200" width="96" height="8" rx="2" fill={PURPLE} {...stroke} />
      <circle cx="68" cy="193" r="5" fill="none" {...stroke} />
      <path d="M86 188 v10 M82 188 h8" {...stroke} />
      <path d="M108 186 v14" {...stroke} />
      <polygon points="132,186 138,196 126,196" fill={GOLD} />
      <Stars pts={[[56, 100], [150, 130], [60, 150]]} />
    </g>
  );
}

function HighPriestess() {
  return (
    <g>
      <rect x="46" y="84" width="16" height="140" fill={PURPLE} {...stroke} />
      <rect x="138" y="84" width="16" height="140" fill={PURPLE} {...stroke} />
      <path d="M92 76 a14 14 0 1 0 0 28 a10 10 0 1 1 0 -28" fill={GOLD} />
      <Person x={100} top={110} h={110} robe="#3b1d70" w={0.45} />
      <path d="M82 150 L118 150" {...stroke} />
      <circle cx="100" cy="170" r="9" fill={PALE} {...stroke} />
      <Stars pts={[[72, 120], [130, 108], [124, 90]]} />
    </g>
  );
}

function Empress() {
  const crown = Array.from({ length: 7 }, (_, i) => [78 + i * 7.3, 72 - Math.sin((i / 6) * Math.PI) * 10]);
  return (
    <g>
      {crown.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill={GOLD} className="art-twinkle" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      <Person x={100} top={82} h={120} robe={PURPLE} w={0.55} />
      <path d="M100 160 c-10 -12 -22 0 -12 10 l12 10 l12 -10 c10 -10 -2 -22 -12 -10 z" fill="#e85d75" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
      {[52, 148].map((x) => (
        <g key={x}>
          <path d={`M${x} 214 V160`} {...stroke} strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={x + (i % 2 ? 5 : -5)} cy={170 + i * 9} rx="2.5" ry="5" fill={GOLD} />
          ))}
        </g>
      ))}
    </g>
  );
}

function Emperor() {
  return (
    <g>
      <rect x="58" y="92" width="84" height="128" rx="4" fill={PURPLE} {...stroke} />
      {[58, 142].map((x) => (
        <path key={x} d={`M${x} 92 c-14 -4 -16 -22 -2 -26 M${x} 92 c0 -6 4 -10 8 -10`} fill="none" {...stroke} />
      ))}
      <Person x={100} top={96} h={104} robe="#e85d75" w={0.4} />
      <path d="M90 100 l5 -8 l5 6 l5 -6 l5 8 z" fill={GOLD} />
      <path d="M128 118 v50 M121 128 h14" {...stroke} />
      <circle cx="128" cy="118" r="5" fill="none" {...stroke} />
    </g>
  );
}

function Hierophant() {
  return (
    <g>
      <path d="M100 66 V222 M88 82 H112 M82 100 H118 M76 118 H124" {...stroke} />
      <Person x={60} top={170} h={50} robe={PURPLE} />
      <Person x={140} top={170} h={50} robe={PURPLE} />
      <circle cx="100" cy="150" r="14" fill="none" {...stroke} className="art-twinkle" />
      <path d="M92 150 h16 M100 142 v16" {...stroke} strokeWidth="1.5" />
    </g>
  );
}

function Lovers() {
  return (
    <g>
      <g className="art-bob">
        <circle cx="100" cy="92" r="14" fill={GOLD} />
        <path d="M86 94 q-26 -14 -34 6 q22 6 34 -2 M114 94 q26 -14 34 6 q-22 6 -34 -2" fill={PALE} {...stroke} strokeWidth="2" />
      </g>
      <Person x={66} top={130} h={84} robe="#e85d75" />
      <Person x={134} top={130} h={84} robe={PURPLE} />
      <path d="M100 168 c-8 -10 -18 0 -10 8 l10 9 l10 -9 c8 -8 -2 -18 -10 -8 z" fill="#e85d75" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" className="art-twinkle" />
    </g>
  );
}

function Chariot() {
  return (
    <g>
      <path d="M62 100 H138 L130 112 H70 Z" fill={PURPLE} {...stroke} />
      {[66, 100, 134].map((x) => <path key={x} d={`M${x} 100 V118`} {...stroke} strokeWidth="2" />)}
      {[74, 92, 110, 126].map((x, i) => <circle key={x} cx={x} cy="106" r="2" fill={GOLD} className="art-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <Person x={100} top={114} h={60} robe={LIGHT} w={0.5} />
      <rect x="64" y="174" width="72" height="34" rx="4" fill={PURPLE} {...stroke} />
      <g className="art-spin" style={{ transformOrigin: "100px 218px" }}>
        <circle cx="100" cy="218" r="16" fill="none" {...stroke} />
        <path d="M100 202 V234 M84 218 H116 M89 207 L111 229 M111 207 L89 229" {...stroke} strokeWidth="1.5" />
      </g>
      <path d="M64 190 L44 186 L40 170 L52 176 Z M136 190 L156 186 L160 170 L148 176 Z" fill={LIGHT} {...stroke} strokeWidth="2" />
    </g>
  );
}

function Strength() {
  const mane = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  return (
    <g>
      <path d="M78 76 c0 -12 20 -12 20 0 s20 12 20 0 s-20 -12 -20 0 s-20 12 -20 0" fill="none" {...stroke} transform="translate(2 0)" className="art-twinkle" />
      <Person x={76} top={92} h={118} robe={LIGHT} w={0.4} />
      <g transform="translate(138 178)">
        <g className="art-spin" style={{ transformOrigin: "0px 0px" }}>
          {mane.map((a) => <polygon key={a} points="0,-26 -5,-18 5,-18" fill={GOLD} transform={`rotate(${a})`} />)}
        </g>
        <circle r="17" fill="#f4a261" {...stroke} />
        <path d="M-7 -3 h3 M4 -3 h3 M-4 7 q4 3 8 0" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <path d="M92 150 q20 14 34 18" fill="none" {...stroke} strokeWidth="2" />
    </g>
  );
}

function Hermit() {
  return (
    <g>
      <path d="M30 230 L70 150 L100 196 L130 130 L172 230 Z" fill={PURPLE} opacity="0.6" {...stroke} strokeWidth="1.5" />
      <Person x={92} top={84} h={130} robe="#6b6b8a" w={0.36} />
      <path d="M126 96 V214" {...stroke} />
      <path d="M112 128 L132 120" {...stroke} />
      <rect x="126" y="108" width="18" height="22" rx="3" fill="#fff3c4" {...stroke} strokeWidth="2" className="art-twinkle" />
      <polygon points="135,111 138,119 132,119 138,119 132,119" fill="none" />
      <path d="M135 112 L139 122 L131 118 L139 118 L131 122 Z" fill={GOLD} />
      <path d="M135 108 v-6" {...stroke} strokeWidth="2" />
    </g>
  );
}

function Wheel() {
  return (
    <g>
      <g className="art-spin" style={{ transformOrigin: "100px 145px" }}>
        <circle cx="100" cy="145" r="62" fill="none" {...stroke} />
        <circle cx="100" cy="145" r="44" fill="none" {...stroke} strokeWidth="1.5" />
        {[0, 45, 90, 135].map((a) => <path key={a} d="M100 83 V207" {...stroke} strokeWidth="1.5" transform={`rotate(${a} 100 145)`} />)}
        {[0, 90, 180, 270].map((a) => <circle key={a} cx="100" cy="95" r="5" fill={GOLD} transform={`rotate(${a} 100 145)`} />)}
      </g>
      <circle cx="100" cy="145" r="10" fill={GOLD} />
      <Stars pts={[[40, 90], [162, 92], [38, 200], [164, 198]]} />
    </g>
  );
}

function Justice() {
  return (
    <g>
      <path d="M100 74 V222" {...stroke} />
      <path d="M52 98 H148" {...stroke} />
      <g className="art-bob">
        <path d="M52 98 L38 142 H66 Z M148 98 L134 142 H162 Z" fill="none" {...stroke} strokeWidth="2" />
        <path d="M34 142 H70 a18 12 0 0 1 -36 0 M130 142 H166 a18 12 0 0 1 -36 0" fill={GOLD} {...stroke} strokeWidth="2" />
      </g>
      <circle cx="100" cy="82" r="8" fill={GOLD} />
      <path d="M92 222 H108" {...stroke} />
      <polygon points="100,196 94,210 106,210" fill={PALE} {...stroke} strokeWidth="2" />
    </g>
  );
}

function HangedMan() {
  return (
    <g>
      <path d="M44 220 V84 H156 V220" fill="none" {...stroke} strokeWidth="4" />
      <path d="M100 84 V110" {...stroke} />
      <g>
        <path d="M100 110 L90 120 M100 110 L110 120" {...stroke} strokeWidth="2" />
        <path d="M88 122 H112 L106 170 H94 Z" fill="#5a82e0" {...stroke} />
        <circle cx="100" cy="184" r="12" fill={PALE} {...stroke} />
        <circle cx="100" cy="184" r="19" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.7" className="art-twinkle" />
        <path d="M88 138 L72 152 M112 138 L128 152" {...stroke} strokeWidth="3" />
      </g>
    </g>
  );
}

function Death() {
  return (
    <g>
      <circle cx="100" cy="196" r="34" fill={GOLD} opacity="0.85" className="art-twinkle" />
      <path d="M30 196 H170" {...stroke} />
      <path d="M62 92 V218" {...stroke} strokeWidth="3" />
      <path d="M62 92 q44 -8 66 28 q-30 -20 -66 -14" fill="#8e8ea8" {...stroke} />
      <path d="M118 120 q26 -6 36 16" fill="none" {...stroke} strokeWidth="2" />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="120" cy="166" rx="6" ry="10" fill="#e85d75" transform={`rotate(${a} 120 176)`} />)}
      <circle cx="120" cy="176" r="5" fill={PALE} />
      <path d="M120 188 V222" stroke="#2a9d8f" strokeWidth="3" />
    </g>
  );
}

function Temperance() {
  return (
    <g>
      <path d="M100 76 L62 100 M100 76 L138 100" fill="none" {...stroke} />
      <path d="M62 100 q-18 12 -10 30 M138 100 q18 12 10 30" fill={PALE} {...stroke} strokeWidth="2" />
      <circle cx="100" cy="86" r="12" fill={PALE} {...stroke} />
      <path d="M44 150 H72 L68 174 H48 Z" fill={PURPLE} {...stroke} />
      <path d="M128 168 H156 L152 192 H132 Z" fill={PURPLE} {...stroke} />
      <path d="M72 152 Q100 120 130 168" fill="none" stroke="#7fd1ff" strokeWidth="3" strokeDasharray="4 5" strokeLinecap="round" className="art-flash" />
      <path d="M30 222 q20 -18 40 0 t40 0 t40 0" fill="none" stroke="#7fd1ff" strokeWidth="2" opacity="0.7" />
    </g>
  );
}

function Devil() {
  const pts = [0, 1, 2, 3, 4].map((i) => {
    const a = (Math.PI * 2 * i * 2) / 5 + Math.PI / 2;
    return `${100 + 44 * Math.cos(a)},${130 + 44 * Math.sin(a)}`;
  });
  return (
    <g>
      <path d="M62 86 q-6 -22 14 -26 M138 86 q6 -22 -14 -26" fill="none" {...stroke} />
      <circle cx="100" cy="130" r="48" fill="none" {...stroke} strokeWidth="1.5" />
      <polygon points={pts.join(" ")} fill="none" {...stroke} className="art-twinkle" />
      <circle cx="100" cy="140" r="6" fill={GOLD} />
      <path d="M72 218 H128" {...stroke} />
      <Person x={70} top={190} h={28} robe={PURPLE} />
      <Person x={130} top={190} h={28} robe={PURPLE} />
      <path d="M78 206 H122" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
    </g>
  );
}

function Star() {
  const small = [[48, 88], [152, 84], [34, 134], [166, 130], [52, 176], [150, 172], [100, 70]];
  return (
    <g>
      <g className="art-spin" style={{ transformOrigin: "100px 130px" }}>
        <polygon points="100,86 108,122 144,130 108,138 100,174 92,138 56,130 92,122" fill={GOLD} {...stroke} strokeWidth="1.5" />
        <polygon points="100,98 104,126 130,130 104,134 100,162 96,134 70,130 96,126" fill={PALE} />
      </g>
      {small.map(([x, y], i) => <polygon key={i} points={`${x},${y - 6} ${x + 2},${y - 2} ${x + 6},${y} ${x + 2},${y + 2} ${x},${y + 6} ${x - 2},${y + 2} ${x - 6},${y} ${x - 2},${y - 2}`} fill={LIGHT} className="art-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />)}
      <path d="M40 214 q20 -14 40 0 t40 0 t40 0" fill="none" stroke="#7fd1ff" strokeWidth="2.5" />
      <path d="M40 228 q20 -14 40 0 t40 0 t40 0" fill="none" stroke="#7fd1ff" strokeWidth="2" opacity="0.6" />
    </g>
  );
}

function Moon() {
  return (
    <g>
      <circle cx="100" cy="124" r="46" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="2 5" />
      <g className="art-twinkle">
        <circle cx="100" cy="124" r="34" fill={GOLD} />
        <circle cx="116" cy="116" r="29" fill="#2a1250" />
        <circle cx="84" cy="116" r="2" fill="#7a4b00" />
        <path d="M80 130 q6 4 12 -2" stroke="#7a4b00" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      {[[62, 176], [138, 176]].map(([x], i) => (
        <g key={i}>
          <rect x={x - 12} y="170" width="24" height="52" fill={PURPLE} {...stroke} strokeWidth="2" />
          <path d={`M${x - 12} 170 h6 v-6 h4 v6 h4 v-6 h4 v6 h2`} fill="none" {...stroke} strokeWidth="2" />
        </g>
      ))}
      <path d="M100 222 Q92 200 100 190 Q108 180 100 170" fill="none" stroke={GOLD} strokeWidth="2.5" strokeDasharray="1 6" />
      <Stars pts={[[40, 90], [162, 100], [150, 70]]} />
    </g>
  );
}

function Judgement() {
  return (
    <g>
      {[-40, -20, 0, 20, 40].map((a) => <path key={a} d="M100 96 L100 60" stroke={GOLD} strokeWidth="2" transform={`rotate(${a} 100 100)`} opacity="0.7" />)}
      <path d="M72 112 q-30 -8 -34 -26 q26 2 36 16 M128 112 q30 -8 34 -26 q-26 2 -36 16" fill={PALE} {...stroke} strokeWidth="2" />
      <polygon points="78,112 122,112 112,132 88,132" fill={LIGHT} {...stroke} />
      <path d="M112 118 L146 96 L152 108 Z" fill={GOLD} {...stroke} />
      <g className="art-bob">
        <rect x="120" y="100" width="22" height="14" fill="#e85d75" stroke={GOLD} strokeWidth="1.5" transform="rotate(-24 120 100)" />
      </g>
      {[52, 100, 148].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="204" width="32" height="18" rx="2" fill={PURPLE} {...stroke} strokeWidth="2" />
          <Person x={x} top={170} h={34} robe={LIGHT} w={0.35} />
        </g>
      ))}
    </g>
  );
}

function World() {
  const leaves = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2);
  return (
    <g>
      <g className="art-spin" style={{ transformOrigin: "100px 145px" }}>
        {leaves.map((a, i) => (
          <ellipse key={i} cx={100 + 56 * Math.cos(a)} cy={145 + 70 * Math.sin(a)} rx="4" ry="9" fill="#2a9d8f" stroke={GOLD} strokeWidth="1.5" transform={`rotate(${(a * 180) / Math.PI + 90} ${100 + 56 * Math.cos(a)} ${145 + 70 * Math.sin(a)})`} />
        ))}
      </g>
      <Person x={100} top={110} h={70} robe="#e85d75" w={0.35} />
      <path d="M84 150 q16 -18 32 -4 q-14 10 -32 4" fill="none" stroke={GOLD} strokeWidth="2" />
      {[[40, 72], [160, 72], [40, 218], [160, 218]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={GOLD} className="art-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />)}
    </g>
  );
}

// ไพ่ที่ยังไม่มีภาพเฉพาะ: ใช้ดาวแปดแฉกกลาง
function Generic() {
  return (
    <g>
      <g className="art-spin" style={{ transformOrigin: "100px 140px" }}>
        <polygon points="100,90 108,132 150,140 108,148 100,190 92,148 50,140 92,132" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <circle cx="100" cy="140" r="8" fill={GOLD} />
    </g>
  );
}

export const symbols: Record<string, () => React.JSX.Element> = {
  fool: Fool,
  magician: Magician,
  "high-priestess": HighPriestess,
  empress: Empress,
  emperor: Emperor,
  hierophant: Hierophant,
  lovers: Lovers,
  chariot: Chariot,
  strength: Strength,
  hermit: Hermit,
  "wheel-of-fortune": Wheel,
  justice: Justice,
  "hanged-man": HangedMan,
  death: Death,
  temperance: Temperance,
  devil: Devil,
  tower: Tower,
  star: Star,
  moon: Moon,
  sun: Sun,
  judgement: Judgement,
  world: World,
};

export const FallbackSymbol = Generic;
