export const PAST_PAPERS = [
  { id:'paper_2025_spring_001', type:'past-paper', sourceType:'practice', examLevel:'CATTI-2', paperType:'practice', sectionType:'translation-practice', questionType:'paragraph', year:'2025', session:'春季', direction:'en-zh', title:'城市与公共服务', topic:'社会发展', sourceText:'Public services and urban communities', referenceTranslation:'公共服务与城市社区', referenceAnswer:'公共服务与城市社区', verificationStatus:'pending', source:'demo dataset; source verification pending', paperId:null, datasetVersion:1 },
  { id:'paper_2024_autumn_001', type:'past-paper', sourceType:'practice', examLevel:'CATTI-2', paperType:'practice', sectionType:'translation-practice', questionType:'paragraph', year:'2024', session:'秋季', direction:'zh-en', title:'绿色转型与长期发展', topic:'发展议题', sourceText:'绿色转型需要长期规划与公众参与。', referenceTranslation:'Green transition requires long-term planning and public participation.', referenceAnswer:'Green transition requires long-term planning and public participation.', verificationStatus:'questionable', source:'demo dataset; source verification pending', paperId:null, datasetVersion:1 },
  { id:'paper_2023_spring_001', type:'past-paper', sourceType:'practice', examLevel:'CATTI-2', paperType:'practice', sectionType:'translation-practice', questionType:'paragraph', year:'2023', session:'春季', direction:'en-zh', title:'文化交流的新路径', topic:'文化交流', sourceText:'New paths for cultural exchange', referenceTranslation:'文化交流的新路径', referenceAnswer:'文化交流的新路径', verificationStatus:'pending', source:'demo dataset; source verification pending', paperId:null, datasetVersion:1 },
  { id:'paper_2025_autumn_001', type:'past-paper', sourceType:'practice', examLevel:'CATTI-2', paperType:'practice', sectionType:'translation-practice', questionType:'paragraph', year:'2025', session:'秋季', direction:'zh-en', title:'公共文化空间', topic:'公共文化', sourceText:'公共文化空间服务不同年龄的居民。', referenceTranslation:'Public cultural spaces serve residents of different ages.', referenceAnswer:'Public cultural spaces serve residents of different ages.', verificationStatus:'pending', source:'editorially reviewed internal sample; not official CATTI', paperId:null, datasetVersion:1 },
];
export const VALID_DIRECTIONS = ['zh-en','en-zh'];
export const VALID_STATUSES = ['verified','pending','questionable'];
export function validatePastPapers(data = PAST_PAPERS) {
  const ids = new Set();
  return data.length > 0 && data.every((p) => p.id && !ids.has(p.id) && ids.add(p.id) && p.type === 'past-paper' && p.year && p.session && p.title && p.topic && p.sourceText && p.referenceTranslation && VALID_DIRECTIONS.includes(p.direction) && VALID_STATUSES.includes(p.verificationStatus) && (p.sourceType === 'practice' || p.sourceType === 'past-paper') && p.source);
}



