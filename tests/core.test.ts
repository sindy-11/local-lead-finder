import test from 'node:test';
import assert from 'node:assert/strict';
import { score, potential, websiteStatus } from '../lib/quality';
import { csv } from '../lib/export';
import { searchSchema, leadSchema } from '../lib/validation';
import { demoBusinesses } from '../providers/demo';
const businesses=demoBusinesses({city:'Алматы',category:'TATTOO',limit:50,mode:'demo'});
test('demo records are explicit, bounded, deterministic and never fabricate Maps coordinates',()=>{
  assert.equal(businesses.length,12);assert.ok(businesses.every(b=>b.source==='demo'&&b.name?.includes('DEMO')&&b.mapsUrl===null&&b.latitude===null));
  assert.equal(new Set(businesses.map(b=>b.sourceId)).size,12);assert.deepEqual(businesses,demoBusinesses({city:'Алматы',category:'TATTOO',limit:50,mode:'demo'}));
});
test('score is transparent and does not equate missing website to verified absence',()=>{
  assert.equal(score({...businesses[0],phone:'+7000'}),9);assert.equal(potential({...businesses[0],businessStatus:'CLOSED_PERMANENTLY'}),false);
  assert.equal(potential({...businesses[0],website:'https://example.com'}),false);
  assert.equal(websiteStatus({...businesses[0],id:'x',createdAt:'',updatedAt:'',noWebsiteListed:true,lead:null}),'NO WEBSITE LISTED');
});
test('requests reject unsafe links and unbounded or empty searches',()=>{
  assert.equal(searchSchema.safeParse({city:'',category:'TATTOO',limit:50,mode:'demo'}).success,false);
  assert.equal(searchSchema.safeParse({city:'Алматы',category:'TATTOO',limit:101,mode:'live'}).success,false);
  assert.equal(leadSchema.safeParse({instagram:'javascript:alert(1)'}).success,false);
  assert.equal(leadSchema.safeParse({email:'bad'}).success,false);
});
test('CSV supports Cyrillic, quotes and neutralizes Excel formulas',()=>{
  const result=csv([['Алматы','A"B','=HYPERLINK("bad")','+7000',4.8]]);
  assert.ok(result.startsWith('\uFEFF'));assert.ok(result.includes('"A""B"'));assert.ok(result.includes('"\'=HYPERLINK'));assert.ok(result.includes('"\'+7000"'));assert.ok(result.includes('Алматы'));
});
