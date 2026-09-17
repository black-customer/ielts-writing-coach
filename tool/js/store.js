/* store.js — 本地数据（学习记录 / 草稿 / 收藏本），基于 localStorage */
const Store = {
  KEY: "iwc_",
  get(k, d) {
    try { const v = localStorage.getItem(this.KEY + k); return v === null ? d : JSON.parse(v); }
    catch (e) { return d; }
  },
  set(k, v) { try { localStorage.setItem(this.KEY + k, JSON.stringify(v)); } catch (e) {} },

  // ---- 训练记录 ----
  addRecord(r) {
    const rs = this.get("records", []);
    rs.unshift(r);
    this.set("records", rs.slice(0, 100));
  },
  removeRecord(i) { const rs = this.get("records", []); rs.splice(i, 1); this.set("records", rs); },

  // ---- 收藏本（词伙/观点） ----
  getStars() { return this.get("stars", []); },
  isStarred(en) { return this.getStars().some(s => s.en === en); },
  toggleStar(item) {
    let stars = this.getStars();
    const idx = stars.findIndex(s => s.en === item.en);
    if (idx >= 0) stars.splice(idx, 1); else stars.unshift(item);
    this.set("stars", stars);
    return idx < 0;
  },
  removeStar(en) {
    let stars = this.getStars().filter(s => s.en !== en);
    this.set("stars", stars);
  },

  // ---- 草稿 ----
  saveDraft(mode, text) { this.set("draft_" + mode, { t: Date.now(), text }); },
  getDraft(mode) { return this.get("draft_" + mode, null); }
};
