// Existing screens now live in optional drawers. New defaults are tested in studio.spec.js.
exports.legacySetup=async({page})=>{
  await page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
    const open=()=>document.querySelectorAll('#auxiliaryNav,#optionalTraining,#legacyProgress,#modelBankFold,.optional-learning').forEach(el=>{if(!el.open)el.open=true;});
    open();new MutationObserver(open).observe(document.body,{childList:true,subtree:true});
  }));
};
