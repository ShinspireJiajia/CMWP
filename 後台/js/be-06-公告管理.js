(function(){
  var listView=document.getElementById('listView'),editView=document.getElementById('editView');
  document.addEventListener('click',function(e){
    if(e.target.classList&&e.target.classList.contains('go-edit')){listView.style.display='none';editView.style.display='';}
  });
  document.getElementById('backList').addEventListener('click',function(){editView.style.display='none';listView.style.display='';});
  var tabs=document.querySelectorAll('.lang-tab');
  for(var i=0;i<tabs.length;i++){tabs[i].addEventListener('click',function(){
    for(var j=0;j<tabs.length;j++)tabs[j].classList.remove('is-selected');
    this.classList.add('is-selected');
    document.getElementById('p-zh').style.display=(this.getAttribute('data-lang')=='zh'?'':'none');
    document.getElementById('p-en').style.display=(this.getAttribute('data-lang')=='en'?'':'none');
  });}
})();
