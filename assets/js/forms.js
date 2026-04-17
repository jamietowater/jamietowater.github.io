/* CONTACT FORM LOCAL FILE GUARD */
const contactForm=document.getElementById('contact-form');
const formWarn=document.getElementById('form-warn');
const formOk=document.getElementById('form-ok');

if(formOk){
  const params=new URLSearchParams(window.location.search);
  if(params.get('submitted')==='1'){
    formOk.classList.add('show');
    params.delete('submitted');
    const qs=params.toString();
    const cleanUrl=`${window.location.pathname}${qs?`?${qs}`:''}${window.location.hash||'#contact'}`;
    window.history.replaceState({},'',cleanUrl);
  }
}

if(contactForm&&formWarn&&window.location.protocol==='file:'){
  formWarn.classList.add('show');
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    formWarn.classList.add('show');
  });
}
