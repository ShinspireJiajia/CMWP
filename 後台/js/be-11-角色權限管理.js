(function(){
  var listView=document.getElementById('listView'),editView=document.getElementById('editView');
  document.addEventListener('click',function(e){
    if(e.target.classList&&e.target.classList.contains('go-edit')){listView.style.display='none';editView.style.display='';}
  });
  document.getElementById('backList').addEventListener('click',function(){editView.style.display='none';listView.style.display='';});
  document.addEventListener('change',function(e){
    if(e.target.classList&&e.target.classList.contains('selall')){
      var row=e.target.closest('.perm-row');var ps=row.querySelectorAll('.perm');
      for(var i=0;i<ps.length;i++)ps[i].checked=e.target.checked;
    }
  });
})();
