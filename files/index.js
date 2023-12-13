window.addEventListener('DOMContentLoaded', function() {
    let allEl = document.getElementsByClassName("separateurData");
    for(let i = 0; i < allEl.length; i++){
        allEl[i].style.display = "none";
    }
});

window.onhashchange = function() {
    // on recupere l'id dans l'url
    let id = window.location.hash.substr(1)
    //on recupere l'el avec l'id id_sep
    let el = document.getElementById(id+"_sep")
    console.log(el)
    if(el){
        //on cache tout les objet avec la classe separateurData
        let allEl = document.getElementsByClassName("separateurData")
        for(let i = 0; i < allEl.length; i++){
            allEl[i].style.display = "none"
        }
        //on affiche l'element d'id id_sep
        el.style.display = "block"
    }
};

