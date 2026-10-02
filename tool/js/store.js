/* store.js — 本地数据（学习记录 / 草稿 / 收藏本），基于 localStorage */
const Store = {
  KEY: "iwc_",
  get(k, d) {
    try { const v = localStorage.getItem(this.KEY + k); return v === null ? d : JSON.parse(v); }
    catch (e) { return d; }
  },
  set(k, v) { try { localStorage.setItem(this.KEY + k, JSON.stringify(v)); return true; } catch (e) { return false; } },

  // ---- 训练记录 ----
  addRecord(r) {
    const rs = this.get("records", []).filter(old => !(r.essay && old.essay === r.essay && old.question === r.question && old.mode === r.mode && old.ai === r.ai));
    rs.unshift(r);
    return this.set("records", rs.slice(0, 100));
  },
  removeRecord(i) { const rs = this.get("records", []); rs.splice(i, 1); return this.set("records", rs); },

  // ---- 收藏本（词伙/观点） ----
  getStars() { return this.get("stars", []); },
  isStarred(en) { return this.getStars().some(s => s.en === en); },
  toggleStar(item) {
    let stars = this.getStars();
    const idx = stars.findIndex(s => s.en === item.en);
    if (idx >= 0) stars.splice(idx, 1); else stars.unshift(item);
    if (!this.set("stars", stars)) return null;
    return idx < 0;
  },
  removeStar(en) {
    let stars = this.getStars().filter(s => s.en !== en);
    return this.set("stars", stars);
  },

  // ---- 草稿 ----
  saveDraft(mode, text, meta = {}) { return this.set("draft_" + mode, { t: Date.now(), text, ...meta }); },
  getDraft(mode) { return this.get("draft_" + mode, null); },
  archiveDraft(mode, draft) {
    if (!draft?.text?.trim()) return true;
    const history = this.get('draftHistory', []);
    if (!history.some(d => d.mode === mode && d.text === draft.text && d.question === draft.question))
      history.unshift({ ...draft, mode, archivedAt: Date.now() });
    return this.set('draftHistory', history.slice(0, 30));
  },
  importBackup(data) {
    if(!data||Array.isArray(data)||data._app!=='IELTS Writing Coach')throw new Error('不是有效的备份文件。');
    const entries=Object.entries(data).filter(([key])=>!key.startsWith('_'));
    for(const [key,value] of entries){if(!key||typeof value!=='string')throw new Error('备份数据格式不正确。');JSON.parse(value);}
    const previous=entries.map(([key])=>[this.KEY+key,localStorage.getItem(this.KEY+key)]);
    let changed=0;
    try {for(const [key,value] of entries){localStorage.setItem(this.KEY+key,value);changed++;}}
    catch(error){let restored=true;for(const [key,value] of previous.slice(0,changed)){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch(_){restored=false;}}
      throw new Error(restored?'导入失败，原有数据已保留。请释放存储空间后重试。':'导入未完成，部分数据可能已更新。请保留备份文件，释放存储空间后重新导入。');}
  }
};
