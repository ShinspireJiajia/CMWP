(function(){
  var listView=document.getElementById('listView'),editView=document.getElementById('editView');
  var tbody=document.querySelector('#listView table tbody');
  var SUF='@starlux-airlines.com';
  var eZh=document.getElementById('e-zh'),eEn=document.getElementById('e-en'),eEmail=document.getElementById('e-email');
  var eEmailPreview=document.getElementById('e-email-preview');
  var editLu=document.getElementById('editLu'),editModeLabel=document.getElementById('editModeLabel'),delBtn=document.getElementById('delBtn');
  var currentTr=null;

  function updateEmailPreview(){
    eEmailPreview.textContent=eEmail.value?eEmail.value+SUF:'—';
  }
  eEmail.addEventListener('input',updateEmailPreview);

  function openEdit(tr){
    currentTr=tr||null;
    if(tr){
      var link=tr.querySelector('.go-edit');
      eZh.value=link.getAttribute('data-zh');
      eEn.value=link.getAttribute('data-en');
      eEmail.value=link.getAttribute('data-email');
      editModeLabel.textContent='最後修改：';
      editLu.textContent=link.getAttribute('data-lu')+'　'+link.getAttribute('data-lu2');
      delBtn.style.display='';
    }else{
      eZh.value='';eEn.value='';eEmail.value='';
      editModeLabel.textContent='新增服務場站';
      editLu.textContent='';
      delBtn.style.display='none';
    }
    updateEmailPreview();
    listView.style.display='none';editView.style.display='';
  }

  document.getElementById('addNew').addEventListener('click',function(){openEdit(null);});

  tbody.addEventListener('click',function(e){
    if(e.target.classList.contains('go-edit')){openEdit(e.target.closest('tr'));}
  });

  document.getElementById('backList').addEventListener('click',function(){
    editView.style.display='none';listView.style.display='';
  });

  document.getElementById('saveBtn').addEventListener('click',function(){
    var zh=eZh.value,en=eEn.value,email=eEmail.value;
    var lu='2320262',lu2='2026/5/31 10:23'; // lu=最後修改者, lu2=最後修改時間
    if(currentTr){
      var link=currentTr.querySelector('.go-edit');
      currentTr.children[0].textContent=zh;
      currentTr.children[1].textContent=en;
      currentTr.children[2].textContent=email+SUF;
      currentTr.children[3].innerHTML=lu+'<br>'+lu2;
      link.setAttribute('data-zh',zh);link.setAttribute('data-en',en);link.setAttribute('data-email',email);
      link.setAttribute('data-lu',lu);link.setAttribute('data-lu2',lu2);
    }else{
      var tr=document.createElement('tr');
      tr.innerHTML='<td style="font-weight:600"></td><td></td><td></td><td class="muted"></td><td><span class="lnk go-edit">編輯</span></td>';
      tr.children[0].textContent=zh;
      tr.children[1].textContent=en;
      tr.children[2].textContent=email+SUF;
      tr.children[3].innerHTML=lu+'<br>'+lu2;
      var newLink=tr.querySelector('.go-edit');
      newLink.setAttribute('data-zh',zh);newLink.setAttribute('data-en',en);newLink.setAttribute('data-email',email);
      newLink.setAttribute('data-lu',lu);newLink.setAttribute('data-lu2',lu2);
      tbody.appendChild(tr);
    }
    editView.style.display='none';listView.style.display='';
  });

  delBtn.addEventListener('click',function(){
    if(currentTr){currentTr.parentNode.removeChild(currentTr);currentTr=null;}
    editView.style.display='none';listView.style.display='';
  });
})();
