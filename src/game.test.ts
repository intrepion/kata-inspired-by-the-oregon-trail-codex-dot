import { describe, it, expect } from 'vitest';
import { newJourney, act } from './game';
describe('outfitting', () => {
  it('buys a food bundle atomically and refuses an unaffordable purchase', () => {
    const initial = newJourney(42);
    const bought = act(initial, { type: 'buy', item: 'food' });
    expect(bought.food).toBe(220);
    expect(bought.money).toBe(63);
    expect(initial.food).toBe(180);
    expect(act({ ...initial, money: 11 }, { type: 'buy', item: 'food' })).toEqual({ ...initial, money: 11 });
  });
});

import { decodeSave, encodeSave, type Journey, type Action } from './game';
const started = (seed = 1847) => act(newJourney(seed), { type: 'start' });
function advance(s: Journey, count = 1) {
  for (let i = 0; i < count; i++) s = act(s, { type: 'travel' });
  return s;
}
describe('daily journey', () => {
  it('charges the living party six food on a filling day', () => {
    const s = advance(started());
    expect(s.food).toBe(174); expect(s.day).toBe(2); expect(s.miles).toBe(24); expect(s.wagon).toBe(98);
  });
  it('trades speed for wagon wear and health, and food for recovery', () => {
    const s = { ...started(), party: started().party.map(p => ({ ...p, health: 80 })) };
    const gentle = advance(act(s, { type: 'pace', value: 'gentle' }));
    const brisk = advance(act(s, { type: 'pace', value: 'brisk' }));
    expect(gentle.miles).toBe(18); expect(brisk.miles).toBe(32);
    expect(gentle.party[0].health).toBe(81); expect(brisk.party[0].health).toBe(78);
    const lean = advance(act(s, { type: 'rations', value: 'lean' }));
    const generous = advance(act(s, { type: 'rations', value: 'generous' }));
    expect(lean.food).toBe(176); expect(generous.food).toBe(172);
    expect(lean.party[0].health).toBe(78); expect(generous.party[0].health).toBe(81);
  });
  it('rest and repair spend a day and food; medicine treats only a living traveler', () => {
    const s = { ...started(), wagon: 50, party: started().party.map((p, i) => ({ ...p, health: i === 0 ? 0 : 50 })) };
    const rest = act(s, { type: 'rest' });
    expect(rest.food).toBe(175.5); expect(rest.party[0].health).toBe(0); expect(rest.party[1].health).toBe(62);
    const repair = act(s, { type: 'repair' });
    expect(repair.wagon).toBe(78); expect(repair.parts).toBe(2); expect(repair.day).toBe(2);
    const healed = act(s, { type: 'heal' });
    expect(healed.party[0].health).toBe(0); expect(healed.party[1].health).toBe(70); expect(healed.medicine).toBe(1); expect(healed.day).toBe(1);
    expect(act({ ...s, parts: 0 }, { type: 'repair' })).toEqual({ ...s, parts: 0 });
  });
  it('starvation reduces health and never makes food negative', () => {
    const s = act({ ...started(), food: 0, party: started().party.map(p => ({ ...p, health: 8 })) }, { type: 'rest' });
    expect(s.food).toBe(0); expect(s.party.every(p => p.health === 0)).toBe(true); expect(s.status).toBe('failed');
  });
  it('journals the actual food consumed when supplies run short', () => {
    const s = act({ ...started(), food: 2 }, { type: 'rest' });
    expect(s.journal.some(t => t.includes('Camp used 2 food.'))).toBe(true);
  });
});
describe('encounters and rivers', () => {
  it('replays a seed identically and blocks interrupted events', () => {
    const a = advance(started(), 2); const b = advance(started(), 2);
    expect(a).toEqual(b); expect(a.pending?.kind).toBe('event');
    expect(act(a, { type: 'travel' })).toEqual(a); expect(act(a, { type: 'rest' })).toEqual(a);
  });
  it('pays an encounter reward only once and refuses unaffordable choices', () => {
    const s: Journey = { ...started(), pending: { kind: 'event', id: 'stranger' } };
    const rewarded = act(s, { type: 'choice', index: 0 });
    expect(rewarded.food).toBe(168); expect(rewarded.money).toBe(84); expect(rewarded.pending).toBeNull();
    expect(act(rewarded, { type: 'choice', index: 0 })).toEqual(rewarded);
    expect(act({ ...s, food: 11 }, { type: 'choice', index: 0 })).toEqual({ ...s, food: 11 });
    expect(act(s, { type: 'choice', index: 2 })).toEqual(s);
  });
  it('ferry costs eighteen dollars and a day, never loses cargo, resolves once', () => {
    const s: Journey = { ...started(), miles: 280, visited: [0, 1], pending: { kind: 'river', id: 2 } };
    const crossed = act(s, { type: 'cross', method: 'ferry' });
    expect(crossed.money).toBe(57); expect(crossed.food).toBe(174); expect(crossed.wagon).toBe(100);
    expect(crossed.day).toBe(2); expect(crossed.visited).toContain(2);
    expect(act(crossed, { type: 'cross', method: 'ferry' })).toEqual(crossed);
    expect(act({ ...s, money: 17 }, { type: 'cross', method: 'ferry' })).toEqual({ ...s, money: 17 });
  });
  it('ford accidents apply stated losses; floating uses one part', () => {
    const s: Journey = { ...started(0), miles: 280, visited: [0, 1], pending: { kind: 'river', id: 2 } };
    const ford = act(s, { type: 'cross', method: 'ford' });
    expect(ford.food).toBe(154); expect(ford.wagon).toBe(82); expect(ford.party[0].health).toBe(88);
    const floating = act(s, { type: 'cross', method: 'float' });
    expect(floating.parts).toBe(2); expect(floating.wagon).toBe(100);
    expect(act({ ...s, parts: 0 }, { type: 'cross', method: 'float' })).toEqual({ ...s, parts: 0 });
  });
  it('cannot shop between settlements or exceed inventory limits', () => {
    expect(act(started(), { type: 'buy', item: 'food' })).toEqual(started());
    const s = { ...newJourney(), food: 590 };
    expect(act(s, { type: 'buy', item: 'food' })).toEqual(s);
  });
});
describe('endings and normal loadout viability', () => {
  it.each(Array.from({ length: 30 }, (_, i) => i))('can finish seed %i with normal starting supplies and sensible decisions', seed => {
    let s = started(seed);
    for (let i = 0; i < 150 && s.status === 'traveling'; i++) {
      if (s.pending?.kind === 'river') s = act(s, { type: 'cross', method: 'ferry' });
      else if (s.pending?.kind === 'event') s = act(s, { type: 'choice', index: s.pending.id === 'orchard' ? 0 : 1 });
      else if (s.market && s.food < 90 && s.money >= 12) s = act(s, { type: 'buy', item: 'food' });
      else if (s.wagon < 40 && s.parts) s = act(s, { type: 'repair' });
      else if (s.food < 18) s = act(s, { type: 'forage' });
      else s = act(s, { type: 'travel' });
      expect(s.food).toBeGreaterThanOrEqual(0); expect(s.wagon).toBeGreaterThanOrEqual(0);
    }
    expect(s.status).toBe('arrived'); expect(s.day).toBeLessThanOrEqual(55);
    expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('fails on a broken wagon or deadline and freezes every ending command', () => {
    const broken = act({ ...started(), wagon: 1 }, { type: 'travel' });
    const late = act({ ...started(), day: 55 }, { type: 'rest' });
    expect(broken.status).toBe('failed'); expect(late.status).toBe('failed');
    const commands: Action[] = [{ type: 'travel' }, { type: 'rest' }, { type: 'repair' }, { type: 'buy', item: 'food' }, { type: 'heal' }, { type: 'pace', value: 'brisk' }];
    for (const action of commands) expect(act(broken, action)).toEqual(broken);
    expect(newJourney(42).status).toBe('outfitting'); expect(newJourney(42).day).toBe(1);
  });
});
describe('validated saves', () => {
  it('round-trips departure and interrupted encounters', () => {
    for (const s of [newJourney(), advance(started(), 2)]) expect(decodeSave(encodeSave(s))).toEqual(s);
  });
  it('rejects malformed, unknown version, impossible resources and inconsistent gates', () => {
    for (const raw of [null, '', '{}', 'oops', JSON.stringify({ ...started(), version: 2 }), JSON.stringify({ ...started(), food: -1 }), JSON.stringify({ ...started(), day: 999 }), JSON.stringify({ ...started(), miles: 300 }), JSON.stringify({ ...started(), status: 'arrived' }), JSON.stringify({ ...started(), pending: { kind: 'river', id: 99 } }), JSON.stringify({ ...started(), party: [] })]) expect(decodeSave(raw)).toBeNull();
  });
});
describe('review regressions', () => {
  it('rejects event IDs that only coerce to valid property names', () => {
    expect(decodeSave(JSON.stringify({ ...started(), pending: { kind: 'event', id: ['stranger'] } }))).toBeNull();
  });
  it('does not promise uncapped medicine recovery', () => {
    const s = act({ ...started(), party: started().party.map(p => ({ ...p, health: 95 })) }, { type: 'heal' });
    expect(s.party[0].health).toBe(100);
    expect(s.journal.at(-1)).toContain('up to 20 health');
  });
});
describe('weather and clamped encounter effects', () => {
  it('storms reduce miles and charge extra wear and health', () => {
    const s = advance(started(5000));
    expect(s.weather).toBe('Storm'); expect(s.miles).toBe(16); expect(s.wagon).toBe(97); expect(s.party[0].health).toBe(99);
  });
  it('orchard rewards stop at capacity and cannot be collected twice', () => {
    const s: Journey = { ...started(), food: 595, pending: { kind: 'event', id: 'orchard' } };
    const found = act(s, { type: 'choice', index: 0 });
    expect(found.food).toBe(600); expect(found.party[0].health).toBe(96);
    expect(act(found, { type: 'choice', index: 0 })).toEqual(found);
  });
  it('pending river saves round-trip and block camp commands', () => {
    const s: Journey = { ...started(), miles: 280, visited: [0, 1], pending: { kind: 'river', id: 2 } };
    expect(decodeSave(encodeSave(s))).toEqual(s); expect(act(s, { type: 'repair' })).toEqual(s);
  });
});
