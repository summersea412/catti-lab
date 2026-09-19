import { PAST_PAPER_SOURCE_REGISTRY } from './sourceRegistry.js';
import { trainingExercise,validateSourceRegistry,registryStats } from './sourceRegistryService.js';
export {PAST_PAPER_SOURCE_REGISTRY,validateSourceRegistry,registryStats};
// Only imported complete bodies are exposed to practice consumers; index entries
// and the former demo questions are never represented as real exam text.
export const PAST_PAPERS=PAST_PAPER_SOURCE_REGISTRY.flatMap(r=>r.materials.map(p=>trainingExercise(p)).filter(Boolean));
export const VALID_DIRECTIONS=['zh-en','en-zh'];
export const VALID_STATUSES=['pending','questionable','verified'];
export function validatePastPapers(data=PAST_PAPERS){const ids=new Set();return Array.isArray(data)&&data.every(p=>p.id&&!ids.has(p.id)&&ids.add(p.id)&&p.type==='past-paper'&&p.sourceText?.trim()&&(p.subject==='comprehensive'||VALID_DIRECTIONS.includes(p.direction))&&p.sourceURLs.length)}
export const trainingPaperCount=()=>PAST_PAPERS.length;
