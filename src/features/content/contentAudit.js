import {buildContentRegistry} from './contentRegistry.js';
import {SENTENCE_EXERCISES} from '../exercises/sentenceDataset.js';
import {PARAGRAPH_EXERCISES} from '../questionBank/paragraphDataset.js';
import {EXTENDED_EXERCISES} from '../translation/extendedDataset.js';
import {COMPREHENSIVE_EXERCISES,VOCABULARY_EXERCISES,GRAMMAR_EXERCISES,READING_PASSAGES,READING_QUESTIONS,CLOZE_PASSAGES,CLOZE_BLANKS} from '../comprehensive/comprehensiveDataset.js';
import {CATTI_PRACTICE_SETS} from '../translation/practiceSets.js';
export function getContentRegistry(){return buildContentRegistry({sentence:SENTENCE_EXERCISES,paragraph:PARAGRAPH_EXERCISES,extended:EXTENDED_EXERCISES,comprehensive:COMPREHENSIVE_EXERCISES})}
export function contentAudit(){const r=getContentRegistry();return {registry:r,counts:{vocabulary:VOCABULARY_EXERCISES.length,grammar:GRAMMAR_EXERCISES.length,readingPassages:READING_PASSAGES.length,readingQuestions:READING_QUESTIONS.length,clozePassages:CLOZE_PASSAGES.length,clozeBlanks:CLOZE_BLANKS.length,sentence:SENTENCE_EXERCISES.length,paragraph:PARAGRAPH_EXERCISES.length,extended:EXTENDED_EXERCISES.length,practiceSets:CATTI_PRACTICE_SETS.length},difficulty:r.byDifficulty,topics:r.byTopic,reviewStatus:r.byReviewStatus,duplicates:r.duplicateWarnings}}
