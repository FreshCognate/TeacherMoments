import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { setupMongo } from '../../../../tests/with-mongo.js';
import getScenarioSlidesAndBlocksByRef from '../helpers/getScenarioSlidesAndBlocksByRef.js';

const db = setupMongo();

describe('getScenarioSlidesAndBlocksByRef (in-memory mongo)', () => {
  beforeEach(() => {});

  it('returns slides and blocks keyed by ref for the scenario', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [slideA, slideB] = await db.models.Slide.create([
      { scenario, stemRef, sortOrder: 0, name: 'A' },
      { scenario, stemRef, sortOrder: 1, name: 'B' }
    ]);

    const [blockA] = await db.models.Block.create([
      { scenario, slideRef: slideA.ref, sortOrder: 0, name: 'BlockA' }
    ]);

    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: scenario }, { models: db.models });

    expect(Object.keys(result.slidesByRef).sort()).toEqual([String(slideA.ref), String(slideB.ref)].sort());
    expect(String(result.slidesByRef[String(slideA.ref)].name)).toBe('A');
    expect(Object.keys(result.blocksByRef)).toEqual([String(blockA.ref)]);
  });

  it('returns empty maps when nothing matches', async () => {
    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: new mongoose.Types.ObjectId() }, { models: db.models });
    expect(result).toEqual({ slidesByRef: {}, blocksByRef: {} });
  });

  it('excludes deleted slides and blocks', async () => {
    const scenario = new mongoose.Types.ObjectId();
    const stemRef = new mongoose.Types.ObjectId();

    const [active] = await db.models.Slide.create([
      { scenario, stemRef, sortOrder: 0, name: 'Active' },
      { scenario, stemRef, sortOrder: 1, name: 'Deleted', isDeleted: true }
    ]);

    const result = await getScenarioSlidesAndBlocksByRef({ scenarioId: scenario }, { models: db.models });
    expect(Object.keys(result.slidesByRef)).toEqual([String(active.ref)]);
  });
});
