const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function storage(){const values=new Map();let failAt=-1,calls=0;const localStorage={getItem:k=>values.get(k)??null,setItem(k,v){if(++calls===failAt)throw new Error('quota');values.set(k,v);},removeItem:k=>values.delete(k)};const c=vm.createContext({localStorage});vm.runInContext(fs.readFileSync('tool/js/store.js','utf8'),c);return {run:s=>vm.runInContext(s,c),failNext(n){failAt=calls+n;},values};}
test('归档保存题目和图表元数据，失败不会清除旧稿',()=>{
  const e=storage();e.run("Store.saveDraft('t1','Answer',{question:'Chart',chartKey:'q1'});Store.archiveDraft('t1',Store.getDraft('t1'))");
  assert.equal(e.run("Store.get('draftHistory')[0].chartKey"),'q1');e.failNext(1);assert.equal(e.run("Store.archiveDraft('t2',{text:'Second'})"),false);assert.equal(e.run("Store.getDraft('t1').text"),'Answer');
});
test('备份先验证全部内容，失败回滚已写项目，旧格式保持兼容',()=>{
  const e=storage();e.run("Store.set('records',[{title:'Old'}]);Store.set('stars',[])");e.failNext(2);
  assert.throws(()=>e.run("Store.importBackup({_app:'IELTS Writing Coach',records:'[]',stars:'[1]'})"),/原有数据已保留/);
  assert.equal(e.run("Store.get('records')[0].title"),'Old');assert.throws(()=>e.run("Store.importBackup({_app:'IELTS Writing Coach',records:'[]',stars:'broken'})"));assert.equal(e.run("Store.get('records')[0].title"),'Old');
  e.run("Store.importBackup({_app:'IELTS Writing Coach',draft_t2:'{\"text\":\"Legacy\"}'})");assert.equal(e.run("Store.getDraft('t2').text"),'Legacy');
});
test('56 篇范文的逐段引用与表达保持准确，224 条指令不把模板换算为分数',()=>{
  const c=vm.createContext({});vm.runInContext(fs.readFileSync('tool/js/data-model-essays.js','utf8'),c);const essays=vm.runInContext('ModelEssays',c);assert.equal(Object.keys(essays).length,56);
  for(const [key,e] of Object.entries(essays)){
    const paras=e.essay.split(/\n\s*\n/);assert.equal(paras.length,4,key);
    for(const [pk,p] of Object.entries(e.paraTeach)){assert.equal(p.modelPara,paras[Number(pk)-2],`${key} paragraph ${pk}`);assert.doesNotMatch(p.guideQ,/扣分|失分|加分|高分|固定动作|无懈可击|TR.*缺一半|高一档/,key);for(const x of p.expressions)assert.ok(e.essay.includes(x.en.replace(/\.{3}$/,'')),`${key}: ${x.en}`);}
  }
});
test('八类短练习的示例和行动完整，预生成读图与审题课覆盖对应题目',()=>{
  const c=vm.createContext({});for(const name of ['learning-lessons','data-tutor-precache-t2','data-tutor-precache-t1','data-model-essays'])vm.runInContext(fs.readFileSync(`tool/js/${name}.js`,'utf8'),c);
  const lessons=vm.runInContext('LearningLessons',c);assert.equal(Object.keys(lessons).length,8);for(const l of Object.values(lessons))for(const field of ['context','weak','stronger','why','try','smaller'])assert.ok(l[field]?.trim(),field);
  const models=vm.runInContext('ModelEssays',c),t1=vm.runInContext('TutorPrecacheT1',c),t2=vm.runInContext('TutorPrecacheT2',c);for(const key of Object.keys(models))assert.ok((key.endsWith('T1')?t1:t2)[key],key);
});
test('资料库无空表达和同组重复，中文释义完整',()=>{
  const c=vm.createContext({});for(const name of ['data-collocations','data-topics'])vm.runInContext(fs.readFileSync(`tool/js/${name}.js`,'utf8'),c);
  const coll=vm.runInContext('Collocations',c);for(const [name,items] of Object.entries(coll.BY_TOPIC)){const seen=new Set();for(const item of items){assert.ok(item.en&&item.zh,name);const key=item.en.trim().toLowerCase();assert.ok(!seen.has(key),`${name}: ${key}`);seen.add(key);}}
  const topics=vm.runInContext('TopicsLibrary',c);for(const topic of topics)for(const name of ['pro','con','neutral']){const seen=new Set();for(const item of topic[name]||[]){assert.ok(item.en?.trim(),topic.name);assert.ok(!seen.has(item.en.trim().toLowerCase()),`${topic.name}: duplicate`);seen.add(item.en.trim().toLowerCase());}}
});
