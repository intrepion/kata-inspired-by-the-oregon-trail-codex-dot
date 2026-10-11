import type { Journey } from './game';
export function landscape(s: Journey) {
  const river = s.pending?.kind === 'river';
  const arrived = s.status === 'arrived';
  const storm = s.weather === 'Storm';
  return `<svg class="landscape" viewBox="0 0 1000 470" role="img" aria-label="Original illustration of a covered wagon and oxen beneath mountains${river ? ' beside a wide river' : ''}${arrived ? ', approaching the lights of Lantern Harbor' : ''}">
  <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${storm ? '#68767d' : '#df9875'}"/><stop offset="1" stop-color="#f4d9a4"/></linearGradient><linearGradient id="hill" x2="0" y2="1"><stop stop-color="#4c7365"/><stop offset="1" stop-color="#223f39"/></linearGradient><linearGradient id="canvas" x2="0" y2="1"><stop stop-color="#fff2ca"/><stop offset="1" stop-color="#d6ba86"/></linearGradient><pattern id="grain" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#172e2d" opacity=".08"/></pattern></defs>
  <rect width="1000" height="470" fill="url(#sky)"/>
  <circle cx="785" cy="101" r="46" fill="#ffebbd" opacity=".95"/>
  <path d="M0 220L125 99l96 101 128-155 132 157 84-102 91 115 91-81 153 127v130H0Z" fill="#a38178"/>
  <path d="m258 151 91-106 64 77-36-12-27 13-23-27-22 40Z" fill="#e5c7aa"/><path d="m77 145 48-46 45 48-44-20Z" fill="#d8bd9f"/>
  <path d="M0 266q122-89 258-28t283-22 459 24v230H0Z" fill="#778674"/>
  <path d="M0 319q136-127 356-43t348-11 296-20v225H0Z" fill="url(#hill)"/>
  ${river ? '<path d="M740 278q-210 23-210 55t210 33 70 104H1000V292Z" fill="#75a6a0"/><path d="M730 295q-139 12-145 32M729 352l81 7" fill="none" stroke="#c1d5bb" stroke-width="4" opacity=".7"/>' : '<path d="M710 275q-324 49-329 77t247 118H843q-174-49-268-98t177-95Z" fill="#b4a17a" opacity=".8"/>'}
  <path d="M0 385q211-61 432 28t568-21v78H0Z" fill="#29453b"/>
  <g fill="#244239"><path d="m83 206-36 75h24l-30 58h45v66h9v-66h45l-30-58h24Z"/><path d="m905 169-45 98h29l-35 80h47v66h13v-66h47l-36-80h27Z"/><path d="m952 247-34 70h21l-24 54h35v47h10v-47h35l-24-54h21Z"/></g>
  ${arrived ? '<g fill="#183936"><path d="M728 350v-75l30-25 30 25v75Zm81 0v-60l24-19 24 19v60Zm70 0v-80l28-25 28 25v80Z"/></g><g fill="#f6cc6e"><path d="M747 281h15v22h-15Zm77 16h12v18h-12Zm72-18h15v22h-15Z"/></g>' : ''}
  <g class="wagon" transform="translate(335 255)">
  <ellipse cx="180" cy="155" rx="160" ry="12" fill="#102b2b" opacity=".25"/>
  <path d="M36 104V48q0-47 81-47t81 47v56Z" fill="url(#canvas)" stroke="#6d674e" stroke-width="3"/>
  <path d="M72 9q-12 44-7 91M111 1v99M154 9q14 44 8 91" fill="none" stroke="#ba9b6c" stroke-width="3"/>
  <path d="M37 87h161v35H37Z" fill="#9c694b" stroke="#583e31" stroke-width="4"/><path d="M44 100h147m-147 13h147" stroke="#c49262" stroke-width="3"/>
  <path d="M54 121h168l52 19" stroke="#59432e" stroke-width="8" fill="none"/>
  <g fill="#342f28" stroke="#c2915d" stroke-width="6"><circle cx="67" cy="133" r="25"/><circle cx="172" cy="133" r="25"/></g>
  <g stroke="#c2915d" stroke-width="3"><path d="m43 133h48m-24-24v48m-17-41 34 34m-34 0 34-34m57 17h48m-24-24v48m-17-41 34 34m-34 0 34-34"/></g>
  <g transform="translate(250 95)"><path d="M-12 12q4-21 33-20h37l20 16-10 21H9Z" fill="#c4ac7f"/><path d="m7 22-3 38m45-36 6 36m-46-44-18 22m64-24 22 18" stroke="#8b7757" stroke-width="8"/><path d="m58 3 17-13 14 5 10 29-22 9-11-9Z" fill="#d6bf94"/><path d="m78-7-9-10m13 12 9-11" stroke="#e9d5ae" stroke-width="4"/><circle cx="88" cy="13" r="2.5" fill="#2a332c"/><path d="m-17 0-11 23" stroke="#8b7757" stroke-width="4"/><path d="M60 4h-44m24-9v22" stroke="#5a4e36" stroke-width="5"/></g>
  <g transform="translate(29 66)"><path d="M0 0v21" stroke="#473f2f" stroke-width="3"/><rect x="-6" y="17" width="12" height="17" rx="3" fill="#f7d17a" stroke="#615537" stroke-width="2"/><circle cy="25" r="12" fill="#ffdb77" opacity=".16"/></g>
  </g>
  <g fill="#d8bd79" opacity=".65"><path d="m103 422 3-18 4 18m-22 0 2-12 4 12m709 6 4-21 5 21m-20-1 3-12 4 12"/></g>
  <rect width="1000" height="470" fill="url(#grain)"/>
  </svg>`;
}
export function routeMap(s: Journey) {
  return `<svg viewBox="0 0 940 100" role="img" aria-label="Route progress: ${s.miles} of 720 miles" class="route-map"><path d="M30 51Q120 25 215 50T390 51 575 48 720 51 910 51" fill="none" stroke="#c6c2a7" stroke-width="3" stroke-dasharray="5 6"/><path d="M30 51H${30 + s.miles / 720 * 880}" fill="none" stroke="#49776b" stroke-width="3"/>${[0,160,280,430,540,660,720].map((m,i) => `<circle cx="${30+m/720*880}" cy="51" r="${m === s.miles ? 7 : 5}" fill="${m <= s.miles ? '#2c6456' : '#f2eedb'}" stroke="#557566" stroke-width="2"/><text x="${30+m/720*880}" y="${i % 2 ? 24 : 83}" text-anchor="${i===0?'start':i===6?'end':'middle'}" font-size="12" fill="#506457">${['Briar Landing','Copper Hollow','Glasswater','Juniper Post','Silverbend','Mosslight','Lantern Harbor'][i]}</text>`).join('')}<path d="m${30+s.miles/720*880} 38-5-8h10Z" fill="#b87245"/></svg>`;
}
