import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PACKAGE_PDF_RECOVERED_PASSAGES } from '../src/features/questionBank/packagePdfRecoveredPassages.js';

const report = JSON.parse(fs.readFileSync(new URL('../docs/pdf-recovery/report.json', import.meta.url)));
assert.equal(report.files.length, 15);
assert.ok(report.files.every(item => item.pages > 0 && item.method === 'pdfjs text layer'));
assert.ok(report.files.every(item => item.recovered > 0));
assert.ok(PACKAGE_PDF_RECOVERED_PASSAGES.length > 0);
assert.ok(PACKAGE_PDF_RECOVERED_PASSAGES.every(item => item.sourceText && item.sourceUrls?.length && item.pageNumbers?.length && item.id));
assert.equal(new Set(PACKAGE_PDF_RECOVERED_PASSAGES.map(item => item.id)).size, PACKAGE_PDF_RECOVERED_PASSAGES.length);
assert.ok(PACKAGE_PDF_RECOVERED_PASSAGES.some(item => item.direction === 'en-zh'));
assert.ok(PACKAGE_PDF_RECOVERED_PASSAGES.some(item => item.direction === 'zh-en'));
console.log(`PDF recovery: ${report.files.length} PDFs, ${PACKAGE_PDF_RECOVERED_PASSAGES.length} recovered records PASS`);
