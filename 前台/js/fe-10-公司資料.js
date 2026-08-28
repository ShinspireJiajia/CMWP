(function(){
  var btn=document.getElementById('editBtn');
  var fields=document.querySelectorAll('.editable');
  var editing=false;
  btn.addEventListener('click',function(){
    editing=!editing;
    for(var i=0;i<fields.length;i++){
      if(editing){fields[i].removeAttribute('readonly');fields[i].classList.add('is-editing');}
      else{fields[i].setAttribute('readonly','');fields[i].classList.remove('is-editing');}
    }
    btn.textContent=editing?'儲存':'編輯';
    if(editing){fields[0].focus();}
  });
})();
