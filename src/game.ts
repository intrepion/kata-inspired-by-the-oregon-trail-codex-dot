export type Pace = 'gentle' | 'steady' | 'brisk';
export type Rations = 'lean' | 'filling' | 'generous';
export type Item = 'food' | 'parts' | 'medicine';
export type Status = 'outfitting' | 'traveling' | 'arrived' | 'failed';
export type EventId = 'orchard' | 'axle' | 'stranger' | 'fever' | 'ridge';
export interface Traveler { name: string; role: string; health: number }
export interface Journey {
  version: 1; seed: number; rng: number; day: number; miles: number;
  food: number; money: number; parts: number; medicine: number; wagon: number;
  pace: Pace; rations: Rations; status: Status; weather: string;
  party: Traveler[]; visited: number[]; market: boolean;
  pending: { kind: 'event'; id: EventId } | { kind: 'river'; id: number } | null;
  journal: string[]; ending: string;
}
export type Action = { type: 'start' | 'travel' | 'rest' | 'forage' | 'repair' | 'heal' }
  | { type: 'buy'; item: Item } | { type: 'pace'; value: Pace } | { type: 'rations'; value: Rations }
  | { type: 'choice'; index: number } | { type: 'cross'; method: 'ferry' | 'ford' | 'float' };
export const ROUTE = [
  { miles: 0, name: 'Briar Landing', kind: 'town' },
  { miles: 160, name: 'Copper Hollow', kind: 'town' },
  { miles: 280, name: 'Glasswater River', kind: 'river' },
  { miles: 430, name: 'Juniper Post', kind: 'town' },
  { miles: 540, name: 'Silverbend River', kind: 'river' },
  { miles: 660, name: 'Mosslight Camp', kind: 'town' },
  { miles: 720, name: 'Lantern Harbor', kind: 'end' },
] as const;
export const SHOP: Record<Item, { price: number; amount: number; cap: number; label: string }> = {
  food: { price: 12, amount: 40, cap: 600, label: '40 food' },
  parts: { price: 15, amount: 1, cap: 12, label: '1 spare part' },
  medicine: { price: 10, amount: 1, cap: 12, label: '1 medicine' },
};
export const EVENTS: Record<EventId, { title: string; text: string; options: [string, string] }> = {
  orchard: { title: 'The forgotten orchard', text: 'Beyond a broken fence, small golden fruit hangs above the grass. Gathering it takes a little effort, but the camp could use a brighter supper.', options: ['Gather fruit · up to +20 food, −4 health', 'Keep your strength · no change'] },
  axle: { title: 'A song from the axle', text: 'An unfamiliar creak threads through the wheels. A careful patch now could keep the wagon running. Leaving it alone will cost the frame.', options: ['Fit a spare · −1 part, up to +12 wagon', 'Make do · −12 wagon'] },
  stranger: { title: 'A lantern in the dusk', text: 'A lone traveler asks for a meal. In return they offer a few coins and a story of the harbor lights. The choice belongs to your party.', options: ['Share a meal · −12 food, +$9', 'Wish them well · no change'] },
  fever: { title: 'An uneasy night', text: 'One traveler wakes shivering. A dose from the medicine chest may help. Otherwise the fever will leave its mark before morning.', options: ['Use medicine · −1 dose, up to +16 weakest health', 'Watch through the night · −12 weakest health'] },
  ridge: { title: 'The windward ridge', text: 'A gust tugs at the canvas as the trail opens into a wide green valley. The party can secure the load or press through the wind.', options: ['Secure the load · −5 party health', 'Press ahead · −10 wagon'] },
};
export function newJourney(seed = 1847): Journey {
  const normalized = Number.isFinite(seed) ? Math.trunc(seed) >>> 0 : 1847;
  return { version: 1, seed: normalized, rng: normalized, day: 1, miles: 0, food: 180, money: 75, parts: 3,
    medicine: 2, wagon: 100, pace: 'steady', rations: 'filling', status: 'outfitting', weather: 'Clear',
    party: [{ name: 'Ada', role: 'Wayfinder', health: 100 }, { name: 'Ruth', role: 'Carpenter', health: 100 },
      { name: 'Eli', role: 'Cook', health: 100 }, { name: 'Milo', role: 'Storykeeper', health: 100 }],
    visited: [0], market: true, pending: null, journal: ['Day 1 · Briar Landing. Four travelers, one shared horizon.'], ending: '' };
}
export const PACE: Record<Pace, { miles: number; wear: number; health: number }> = {
  gentle: { miles: 18, wear: 1, health: 1 }, steady: { miles: 24, wear: 2, health: 0 }, brisk: { miles: 32, wear: 3, health: -2 },
};
export const RATIONS: Record<Rations, { food: number; health: number }> = {
  lean: { food: 1, health: -2 }, filling: { food: 1.5, health: 0 }, generous: { food: 2, health: 1 },
};
export const foodCost = (s: Journey) => s.party.filter(p => p.health > 0).length * RATIONS[s.rations].food;
export const travelMiles = (s: Journey) => PACE[s.pace].miles;
const clamp = (n: number, max = 100) => Math.max(0, Math.min(max, n));
function note(s: Journey, text: string) { s.journal.push(`Day ${s.day} · ${text}`); s.journal = s.journal.slice(-80); }
function random(s: Journey) { s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0; return s.rng / 4294967296; }
function health(s: Journey, amount: number) {
  for (const p of s.party) if (p.health > 0) {
    p.health = clamp(p.health + amount);
    if (p.health === 0) note(s, `${p.name} died. The empty place beside the fire will be remembered.`);
  }
}
function weakest(s: Journey, amount: number) {
  const p = s.party.filter(p => p.health > 0).sort((a, b) => a.health - b.health)[0];
  if (p) { p.health = clamp(p.health + amount); if (!p.health) note(s, `${p.name} died. Their lantern stays with the party.`); }
}
function day(s: Journey, recovery = 0) {
  const cost = foodCost(s);
  const shortage = s.food < cost;
  const consumed = Math.min(cost, s.food);
  s.food = Math.max(0, s.food - cost); s.day++;
  health(s, shortage ? -9 : recovery + RATIONS[s.rations].health);
  note(s, `Camp used ${consumed} food.${shortage ? ' Hunger costs everyone 9 health.' : ''}`);
}
function finish(s: Journey) {
  if (!s.party.some(p => p.health > 0)) { s.status = 'failed'; s.ending = 'No lanterns left to carry. Your party did not survive the trail.'; }
  else if (s.wagon <= 0) { s.status = 'failed'; s.ending = 'The wagon can go no farther. The journey ends beside the trail.'; }
  else if (s.day > 55) { s.status = 'failed'; s.ending = 'The harbor pass closes for the season. The party turns back before winter.'; }
  else if (s.miles >= 720) { s.status = 'arrived'; s.ending = 'The harbor lights answer your lantern. You made a home on the far side of the journey.'; }
  if (s.status === 'failed' || s.status === 'arrived') { s.pending = null; s.market = false; note(s, s.ending); }
}
export function act(state: Journey, action: Action): Journey {
  if (state.status === 'arrived' || state.status === 'failed') return state;
  if (state.pending && action.type !== 'choice' && action.type !== 'cross') return state;
  const s = structuredClone(state);
  if (action.type === 'buy') {
    const item = SHOP[action.item];
    if (!item || !s.market || s.money < item.price || s[action.item] + item.amount > item.cap) return state;
    s.money -= item.price; s[action.item] += item.amount; note(s, `Bought ${item.label} for $${item.price}.`);
  } else if (action.type === 'start') {
    if (s.status !== 'outfitting') return state;
    s.status = 'traveling'; s.market = false; note(s, 'The wheels turn. Lantern Harbor lies 720 miles ahead.');
  } else if (action.type === 'pace') {
    if (!['gentle', 'steady', 'brisk'].includes(action.value)) return state; s.pace = action.value;
  } else if (action.type === 'rations') {
    if (!['lean', 'filling', 'generous'].includes(action.value)) return state; s.rations = action.value;
  } else if (action.type === 'choice') {
    if (s.pending?.kind !== 'event' || ![0, 1].includes(action.index)) return state;
    const id = s.pending.id;
    if (!action.index) {
      if (id === 'orchard') { s.food = clamp(s.food + 20, 600); health(s, -4); }
      if (id === 'axle') { if (!s.parts) return state; s.parts--; s.wagon = clamp(s.wagon + 12); }
      if (id === 'stranger') { if (s.food < 12) return state; s.food -= 12; s.money = clamp(s.money + 9, 999); }
      if (id === 'fever') { if (!s.medicine) return state; s.medicine--; weakest(s, 16); }
      if (id === 'ridge') health(s, -5);
    } else {
      if (id === 'axle') s.wagon = clamp(s.wagon - 12);
      if (id === 'fever') weakest(s, -12);
      if (id === 'ridge') s.wagon = clamp(s.wagon - 10);
    }
    note(s, `${EVENTS[id].title}: ${EVENTS[id].options[action.index]}.`); s.pending = null;
  } else if (action.type === 'cross') {
    if (s.pending?.kind !== 'river') return state;
    const id = s.pending.id;
    if (!['ferry', 'float', 'ford'].includes(action.method)) return state;
    if (action.method === 'ferry' && s.money < 18 || action.method === 'float' && s.parts < 1) return state;
    if (action.method === 'ferry') s.money -= 18;
    if (action.method === 'float') s.parts--;
    const risk = action.method === 'ferry' ? 0 : action.method === 'float' ? 0.15 : s.weather === 'Storm' ? 0.45 : 0.30;
    const accident = random(s) < risk;
    day(s); s.market = false;
    if (accident) { s.food = Math.max(0, s.food - 20); s.wagon = clamp(s.wagon - 18); health(s, -12); }
    note(s, `${ROUTE[id].name}: ${action.method}. ${accident ? 'Current catches the wagon: −20 food, −18 wagon, −12 party health.' : 'Everyone reaches the far bank safely.'}`);
    s.visited.push(id); s.pending = null;
  } else {
    if (s.status !== 'traveling') return state;
    if (action.type === 'heal') {
      if (!s.medicine || !s.party.some(p => p.health > 0 && p.health < 100)) return state;
      s.medicine--; weakest(s, 20); note(s, 'Medicine restored up to 20 health to the weakest living traveler.');
    } else if (action.type === 'repair') {
      if (!s.parts || s.wagon === 100) return state;
      s.parts--; day(s); s.wagon = clamp(s.wagon + 28); note(s, 'A day with the tools: +28 wagon, −1 spare part.');
    } else if (action.type === 'rest') {
      day(s, 12); note(s, 'A quiet camp day restored up to 12 health, plus the ration effect.');
    } else if (action.type === 'forage') {
      day(s, -4); const found = 12 + Math.floor(random(s) * 14); s.food = clamp(s.food + found, 600); note(s, `Foraged ${found} food. The search cost 4 health, plus the ration effect.`);
    } else if (action.type === 'travel') {
      s.market = false;
      const roll = random(s); s.weather = roll < .18 ? 'Storm' : roll < .4 ? 'Rain' : roll < .6 ? 'Wind' : 'Clear';
      const distance = travelMiles(s) - (s.weather === 'Storm' ? 8 : s.weather === 'Rain' ? 4 : 0);
      day(s, PACE[s.pace].health - (s.weather === 'Storm' ? 1 : 0));
      s.wagon = clamp(s.wagon - PACE[s.pace].wear - (s.weather === 'Storm' ? 1 : 0));
      const next = ROUTE.findIndex((r, i) => r.miles > s.miles && !s.visited.includes(i));
      const before = s.miles; s.miles = Math.min(720, s.miles + distance, next >= 0 ? ROUTE[next].miles : 720);
      note(s, `${s.weather} skies. Traveled ${s.miles - before} miles at ${s.pace} pace.`);
      if (next >= 0 && s.miles === ROUTE[next].miles) {
        note(s, `Reached ${ROUTE[next].name}.`);
        if (ROUTE[next].kind === 'river') s.pending = { kind: 'river', id: next };
        else { s.visited.push(next); s.market = ROUTE[next].kind === 'town'; }
      } else if (s.day % 3 === 0) {
        const ids = Object.keys(EVENTS) as EventId[]; s.pending = { kind: 'event', id: ids[Math.floor(random(s) * ids.length)] };
      }
    } else return state;
  }
  finish(s); return s;
}
export function encodeSave(s: Journey) { return JSON.stringify(s); }
export function decodeSave(raw: string | null): Journey | null {
  try {
    if (!raw || raw.length > 40000) return null;
    const s = JSON.parse(raw) as Journey;
    const number = (n: unknown, max: number) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= max;
    if (!s || s.version !== 1 || !number(s.seed, 4294967295) || !Number.isInteger(s.seed) || !number(s.rng, 4294967295) || !Number.isInteger(s.rng)
      || !Number.isInteger(s.day) || s.day < 1 || s.day > 56 || !Number.isInteger(s.miles) || !number(s.miles, 720)
      || !number(s.food, 600) || !number(s.money, 999) || !Number.isInteger(s.money) || !number(s.parts, 12) || !Number.isInteger(s.parts)
      || !number(s.medicine, 12) || !Number.isInteger(s.medicine) || !number(s.wagon, 100)
      || !['gentle', 'steady', 'brisk'].includes(s.pace) || !['lean', 'filling', 'generous'].includes(s.rations)
      || !['outfitting', 'traveling', 'arrived', 'failed'].includes(s.status) || !['Clear', 'Rain', 'Storm', 'Wind'].includes(s.weather)
      || typeof s.market !== 'boolean' || typeof s.ending !== 'string' || s.ending.length > 500
      || !Array.isArray(s.party) || s.party.length !== 4 || !s.party.every((p, i) => p && p.name === newJourney().party[i].name && p.role === newJourney().party[i].role && number(p.health, 100))
      || !Array.isArray(s.journal) || s.journal.length < 1 || s.journal.length > 80 || !s.journal.every(t => typeof t === 'string' && t.length <= 500)
      || !Array.isArray(s.visited) || s.visited.length < 1 || !s.visited.includes(0) || new Set(s.visited).size !== s.visited.length
      || !s.visited.every(i => Number.isInteger(i) && i >= 0 && i < ROUTE.length && ROUTE[i].miles <= s.miles)) return null;
    if (s.pending !== null && (!s.pending || (s.pending.kind === 'event' ? typeof s.pending.id !== 'string' || !Object.hasOwn(EVENTS, s.pending.id) : s.pending.kind === 'river' ? ![2, 4].includes(s.pending.id) || s.miles !== ROUTE[s.pending.id].miles || s.visited.includes(s.pending.id) : true))) return null;
    const terminal = s.status === 'arrived' || s.status === 'failed';
    const lost = !s.party.some(p => p.health > 0) || s.wagon === 0 || s.day > 55;
    if (s.status === 'arrived' && (s.miles !== 720 || lost) || s.status === 'failed' && !lost
      || !terminal && (lost || s.miles === 720 || s.ending !== '') || terminal && (s.pending !== null || s.market || !s.ending)
      || s.status === 'outfitting' && (s.day !== 1 || s.miles !== 0 || s.pending !== null || !s.market)) return null;
    for (let i = 1; i < ROUTE.length; i++) if (ROUTE[i].miles < s.miles && !s.visited.includes(i)) return null;
    if (s.market && !ROUTE.some((r, i) => r.kind === 'town' && r.miles === s.miles && s.visited.includes(i))) return null;
    if (!terminal && [280, 540].includes(s.miles)) {
      const id = s.miles === 280 ? 2 : 4;
      if (!s.visited.includes(id) && !(s.pending?.kind === 'river' && s.pending.id === id)) return null;
    }
    return s;
  } catch { return null; }
}
