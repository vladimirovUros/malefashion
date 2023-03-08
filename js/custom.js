const  BASEURL = "data/";
function ajaxCallBack(nazivFajla, rezultat){
    $.ajax({
        url: BASEURL + nazivFajla,
        method: "get",
        dataType: "json",
        success: rezultat,
        error: function(jqXHR, exception){
            // console.log(jqXHR);
            var msg = '';
            if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
    })
}
setTimeout(function() {
    document.getElementById("preloader").style.display = "none";
}, 1000);
document.getElementById("preloader").style.display = "block";
//KAO STO VIDITE NAPRAVIO SAM OVDE DVE FUNCKIJE I KADA SAM NA KRAJU HTEO DA ZAMENIM SVE SA OVE DVE FUNKCIJE DA SE KOD NE BI PONAVLJAO 
//IZBACIVALO JE GRESKU da ne prepoznaje neki token i onda kada ispravim jedno ona povuce sa sobom jos 10 drugih i sve tako u krug
//PA sam uspeo da vratim nekako sve na pocetak...
function sacuvajLS(nazivLS, vrednost){
    localStorage.setItem(nazivLS, JSON.stringify(vrednost));
}
function dohvatiIzLS(nazivLS){
    return JSON.parse(localStorage.getItem(nazivLS));
}
ajaxCallBack("meni.json", function(data){
    ispisiMeni(data);
    ispisiMobilniMeni(data);
});
if(JSON.parse(localStorage.getItem("korpa")) == null){
    localStorage.setItem("korpa", JSON.stringify([]));
}
let broj = document.querySelectorAll('.broj-proizvoda-u-kartici');
if(JSON.parse(localStorage.getItem("korpa")).length > 9){
    broj.forEach(br => {
        br.style.left = "1px";
    })
}
else{
    broj.forEach(br => {
        br.style.left = "5px";
    })
}
if(JSON.parse(localStorage.getItem("omiljeniProizvodi")) == null){
    localStorage.setItem("omiljeniProizvodi", JSON.stringify([]));
}

function ukupnaCenaPrikaz(){
    let ukupnaCena = localStorage.getItem("ukupnaCena");
    let ceneUKorpi = document.querySelectorAll('.ukupnaCenauKorpi');
    if(localStorage.getItem("ukupnaCena") != null){
            if(localStorage.getItem("valuta") == null){
                ceneUKorpi.forEach(el =>{
                    el.innerHTML = `$${ukupnaCena}`
                });
            }
            if(localStorage.getItem("valuta") == "USD"){
                ceneUKorpi.forEach(el =>{
                    el.innerHTML = `$${ukupnaCena}`
                });
            }
            if(localStorage.getItem("valuta") == "EUR"){
                ceneUKorpi.forEach(el =>{
                    el.innerHTML = `${ukupnaCena}&euro;`
                });
            }
        
    }
    else{    
        if(localStorage.getItem("valuta") == "USD"){
            ceneUKorpi.forEach(el =>{
                el.innerHTML = `$0.00`
            });
        }
        if(localStorage.getItem("valuta") == "EUR"){
            ceneUKorpi.forEach(el =>{
                el.innerHTML = `0.00&euro;`
            });
        }
        else{
            ceneUKorpi.forEach(el =>{
                el.innerHTML = `$0.00`
            });
        }
    }
};
function brojProizvodaUKorpi(){
    let broj = document.querySelectorAll('.broj-proizvoda-u-kartici');
    if(JSON.parse(localStorage.getItem("korpa")) !== null && JSON.parse(localStorage.getItem("korpa")).length > 0){
        if(JSON.parse(localStorage.getItem("korpa")).length > 9){
            broj.forEach(br => {
                br.style.left = "1px";
            })
        }
        else{
            broj.forEach(br => {
                br.style.left = "5px";
            })
        }
        broj.forEach(br => {
            br.innerHTML = JSON.parse(localStorage.getItem("korpa")).length;
        }) 
    }
    else{
        broj.forEach(br => {
            br.innerHTML = "0";
        })
    }
};
function promeniUkupnuCenuUKorpi(){
    if(localStorage.getItem("valuta") != null){
        promeniCeneValuta(localStorage.getItem("valuta"));
        let valuteSpan = document.querySelectorAll('.valuta');
        let valuteUl = document.querySelectorAll('.valute');
        valuteSpan.forEach(span => {
            if(localStorage.getItem("valuta") == "USD"){
                localStorage.removeItem("valuta");
                span.innerHTML = `USD <i class="arrow_carrot-down"></i>`;
                valuteUl.forEach(ul => {
                    ul.innerHTML = `<li>EUR</li>`;
                })
            }
            if(localStorage.getItem("valuta") == "EUR"){
                span.innerHTML = `EUR <i class="arrow_carrot-down"></i>`;
                valuteUl.forEach(ul => {
                    ul.innerHTML = `<li>USD</li>`;
                })
            }   
        })
    }
        return true;
}
function menjanjeValute(){
    let valuteSpan = document.querySelectorAll('.valuta');
    let valuteUl = document.querySelectorAll('.valute');
    let valuta = document.querySelectorAll('.valute li');
    let cenauKorpi = document.querySelectorAll('.ukupnaCenauKorpi');
        valuta.forEach(val => {
            val.addEventListener('click', function(){
                localStorage.setItem("valuta", val.innerHTML);
                if(val.innerHTML == "USD"){
                    valuteUl.forEach(ul => {
                        ul.innerHTML = `<li>EUR</li>`;
                    })
                    cenauKorpi.forEach(cena => {
                            let pozicijaEuro = cena.innerHTML.indexOf('€');
                            let cenaEuro = Number(cena.innerHTML.substring(0,pozicijaEuro));
                            let novaCena = cenaEuro * 1.0692;
                            cena.innerHTML = `$${novaCena.toFixed(2)}`;
                        })
                   
                }
                if(val.innerHTML == "EUR"){
                    valuteUl.forEach(ul => {
                        ul.innerHTML = `<li>USD</li>`;
                    })
                    cenauKorpi.forEach(cena => {
                        let cenaBroj = Number(cena.innerHTML.slice(1));
                        let novaCena = cenaBroj * 0.93528;
                        cena.innerHTML = `${novaCena.toFixed(2)}&euro;`;
                    })
                }
                valuteSpan.forEach(span => {
                    console.log(val.innerHTML );
                    span.innerHTML = `${val.innerHTML} <i class="arrow_carrot-down"></i>`;
                })
                if(window.location.pathname == '/index.html'){
                    ispisProizvodeSekcije();
                }
                if(window.location.pathname == '/shop.html'){
                    promeniIzgledProizvoda();
                }
                if(window.location.pathname == '/shopping-cart.html'){
                   promeniProizvodeKorpa();
                   menjanjeKolicineUKorpi();
                   ukupnaCenaUKorpi();
                   brisanjeProizvoda("korpa");
                }
                let ukupnaCenaKorpa = localStorage.getItem("ukupnaCena");
                if(val.innerHTML == "USD"){
                    ukupnaCenaKorpa = ukupnaCenaKorpa * 1.0692;
                    localStorage.setItem("ukupnaCena", Number(ukupnaCenaKorpa).toFixed(2))
                }
                if(val.innerHTML == "EUR"){
                    ukupnaCenaKorpa = ukupnaCenaKorpa * 0.93528;
                    localStorage.setItem("ukupnaCena", Number(ukupnaCenaKorpa).toFixed(2))
                }
                menjanjeValute();
            })
        })
}
function promeniCeneValuta(valuta){
    let cenauKorpi = document.querySelectorAll('.ukupnaCenauKorpi');
    if(valuta == "EUR"){
        cenauKorpi.forEach(cena => {
            let cenaBroj = Number(cena.innerHTML.slice(1));
            let novaCena = cenaBroj * 0.93528;
            cena.innerHTML = `${novaCena.toFixed(2)}&euro;`;
        })
    }
    if(valuta == "USD"){
        // cenauKorpi.forEach(cena => {
        //     let pozicijaEuro = cena.innerHTML.indexOf('€');
        //     let cenaEuro = Number(cena.innerHTML.substring(0,pozicijaEuro));
        //     let novaCena = cenaEuro * 1.0692;
        //     cena.innerHTML = `$${novaCena.toFixed(2)}`;
        // })
        return true;
    }
}
brojProizvodaUKorpi();
promeniUkupnuCenuUKorpi();
menjanjeValute();

let hamburgerDugme = document.querySelector('.canvas__open i');
hamburgerDugme.addEventListener('click', function(){
    let meniTelefon = document.querySelector('#mobile-menu-wrap .slicknav_nav ul li');
    document.querySelector('.offcanvas-menu-wrapper').classList.add("active");
    document.querySelector('.offcanvas-menu-overlay').classList.add("active");
    if(!meniTelefon){        
        ispisiMobilniMeni();
    }
});
let zatvori = document.querySelector('.zatvoriMeni');
    zatvori.addEventListener('click', function(){
        document.querySelector('.offcanvas-menu-wrapper').classList.remove("active");
        document.querySelector('.offcanvas-menu-overlay').classList.remove("active");
})
ajaxCallBack("boja.json", function(data){ 
    localStorage.setItem("boja", JSON.stringify(data))
});
ajaxCallBack("proizvodi.json", function(proizvodi){
    localStorage.setItem("proizvodi", JSON.stringify(proizvodi));
});
ajaxCallBack("sekcije.json", function(data){
    localStorage.setItem("sekcije",JSON.stringify(data));
 });
document.querySelector('.offcanvas-menu-overlay').addEventListener('click', function(){ 
    document.querySelector('.offcanvas-menu-wrapper').classList.remove("active");
    document.querySelector('.offcanvas-menu-overlay').classList.remove("active");
})
function ispisiMobilniMeni(nizMeni){  
        let meniTelefon = document.querySelector('#mobile-menu-wrap .slicknav_nav ul');
        nizMeni.forEach(link => 
        meniTelefon.innerHTML += `
        <li class=""><a href="${link.url}" role="menuitem">${link.naziv}</a></li>
        `);
};
function ispisiMeni(meni){
    let ulMeni = document.querySelector(".header__menu ul");
    // console.log(ulMeni);
    ulMeni.innerHTML = "";
    meni.forEach(element => {
        ulMeni.innerHTML += `<li><a href="${element.url}">${element.naziv}</a></li>`;
    });
}
function stampanjeProizvoda(proizvodi, proizvodiWrapper, proizvodKlasa){
    let produkti = document.querySelector(proizvodiWrapper);
    produkti.innerHTML = "";
    let valuta = localStorage.getItem("valuta");
    if(valuta){
        if(valuta == "USD"){
            proizvodi = proizvodi;
        }
        if(valuta == "EUR"){
            for(let p of proizvodi){
                p.cena.aktuelnaCena *= 0.93528;
                if(p.cena.staraCena == null){
                    p.cena.staraCena == null;
                }
                else{
                    p.cena.staraCena *= 0.93528;
                    p.cena.staraCena = p.cena.staraCena.toFixed(2);
                }             
                p.cena.aktuelnaCena = p.cena.aktuelnaCena.toFixed(2);
                
            }
        }
    }
    for(let p of proizvodi){
        produkti.innerHTML += `<div class=${proizvodKlasa}>
        <div class="product__item">
            <div class="product__item__pic set-bg" data-setbg="${p.slike.veca}">
                <ul class="product__hover">
                    <li><a href="#" data-proizvodid="${p.id}"><img src="img/icon/heart.png" alt="heart"></a></li>
                </ul>
                <div class="opis-proizvoda">
                <p>${p.opis}<p>
                </div>
            </div>
            <div class="product__item__text">
                <h6>${p.naziv}</h6>
                <a href="#" class="add-cart" data-proizvodid="${p.id}">+ Add To Cart</a>
                <div class="rating">
                ${ispisiRejting(p)}
                </div>
                 ${ispisiCenu(p)}
                <div class="product__color__select">
                ${ispisiBojuProizvoda(p)}
                </div>
            </div>
        </div>
        
    </div>`
    }
}
function ispisiRejting(proizvod){
    let vrednost = "";
    for(let i=0; i < proizvod.ocena; i++){
        vrednost += `<i class="fa fa-star zvezdica"></i>`
    }
    return vrednost;
}
function opisProizvoda(){
    let proizvodiOkvir = document.querySelectorAll('.product__item');
    proizvodiOkvir.forEach(okvir => 
        okvir.addEventListener('mouseenter', function(){
            okvir.children[0].children[1].classList.add("aktivni-opis");
        }))    
    proizvodiOkvir.forEach(okvir => 
        okvir.addEventListener('mouseleave', function(){
            okvir.children[0].children[1].classList.remove("aktivni-opis")
        }))  
}
function ispisiCenu(proizvod){
    let vrednost = "";
    let valuta = localStorage.getItem("valuta");
    if(valuta){
        if(proizvod.cena.staraCena == null){
            if(valuta == "USD"){
                vrednost = `<div class="productPrice"><h5 data-proizvodid="${proizvod.id}">$${proizvod.cena.aktuelnaCena}</h5></div>`;
            }
            if(valuta == "EUR"){
                vrednost = `<div class="productPrice"><h5 data-proizvodid="${proizvod.id}">${proizvod.cena.aktuelnaCena}&euro;</h5></div>`;
            }
            
        }
        else{
            if(valuta == "USD"){
                vrednost = `<div class="productPrice"><h5 class="cena"><del>$${proizvod.cena.staraCena}</del></h5> <h5 data-proizvodid="${proizvod.id}">$${proizvod.cena.aktuelnaCena}</h5></div>`;
            }
            if(valuta == "EUR"){
                vrednost = `<div class="productPrice"><h5 class="cena"><del>${proizvod.cena.staraCena}&euro;</del></h5> <h5 data-proizvodid="${proizvod.id}">${proizvod.cena.aktuelnaCena}&euro;</h5></div>`;
            }
           
        }
    }
    else{
        if(proizvod.cena.staraCena == null){        
                vrednost = `<div class="productPrice"><h5 data-proizvodid="${proizvod.id}">$${proizvod.cena.aktuelnaCena}</h5></div>`;
        }
        else{
                vrednost = `<div class="productPrice"><h5 class="cena"><del>$${proizvod.cena.staraCena}</del></h5> <h5 data-proizvodid="${proizvod.id}">$${proizvod.cena.aktuelnaCena}</h5></div>`;           
        }
    }
   
    return vrednost;
}
function ispisiBojuProizvoda(proizvod){
    let nizBoja = JSON.parse(localStorage.getItem("boja"));
    for(let i=0; i<nizBoja.length; i++){
        if(nizBoja[i].id == proizvod.bojaID){
            return `<label for="pc-${proizvod.bojaID}" class="${nizBoja[i].naziv}">
            <input type="radio" id="pc-${proizvod.bojaID}">
        </label>`
        };
    };
};
function dodajBG(klasa){
        let pozadinaProizvoda = document.querySelectorAll(klasa);
        pozadinaProizvoda.forEach(element=>{
            let pozadina = element.getAttribute("data-setbg");
            element.style.backgroundImage = `url("${pozadina}")`;
        });
}
function ispisKategorija(kategorija){
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
    let kategorijeIspis = document.getElementById("uv-categoriesSidebar");
    kategorijeIspis.innerHTML = "";
    kategorija.forEach(element=>{
        kategorijeIspis.innerHTML += `<li><input type="checkbox" value="${element.id}">${element.naziv}<span class="brojProizvodaKat" data-katid="${element.id}">${prebrojProizvodeKategorije(proizvodi,element.id, "kategorijaID")}</span></li>`;
    });
}
function ispisBrendova(brendovi){
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
    let brendoviIspis = document.getElementById("uv-brandSidebar");
    brendoviIspis.innerHTML = "";
    brendovi.forEach(element=>{
        brendoviIspis.innerHTML += `<li><input type="checkbox" value="${element.id}">${element.naziv}<span class="brojProizvodaBrend" data-brendid="${element.id}">${prebrojProizvodeKategorije(proizvodi,element.id, "brendID")}</span></li>`;
    })
}
function ispisRejtingaSidebar(){
   let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
   let rejtingIspis = document.getElementById("uv-ratingSidebar");
   rejtingIspis.innerHTML = "";
   rejtingIspis.innerHTML = `<li><input type="radio" value="0" name="rejting">None</li>`;
   for(let i =1;i<6;i++){
    rejtingIspis.innerHTML += `<li><input type="radio" value="${i}" name="rejting"><span class="uv-zvezdice">${dodajZvezdice(i)}</span><span class="brojProizvodaRejting" data-rejtingid="${i}">${prebrojProizvodeKategorije(proizvodi,i, "ocena")}</span></li>`;
   }
}
function dodajZvezdice(broj){
    let vrednost = "";
    for(let i=0;i<broj;i++){
        vrednost += `<i class="fa fa-star zvezdica"></i>`;
    }
    return vrednost;
}
function promeniBrojProizvoda(proizvodi,klasa,dataNaziv,svojstvo){
    let brojevi = document.querySelectorAll(klasa);
    brojevi.forEach(element => 
        element.innerHTML = `${prebrojProizvodeKategorije(proizvodi,element.getAttribute(dataNaziv),svojstvo)}`)
    if(svojstvo == 'pol'){
        let polovi = document.querySelectorAll('.shop__sidebar__tags .brojProizvodaPol');
        polovi.forEach(pol =>
            pol.innerHTML =  `${prebrojProizvodeKategorije(proizvodi,pol.getAttribute(dataNaziv),svojstvo)}`)
    }
}
function prebrojProizvodeKategorije(proizvodi,elementID, tipFiltriranja){
    let brojac=0;
    if(tipFiltriranja == "kategorijaID"){
        for(let i=0; i<proizvodi.length; i++){
            if(proizvodi[i].kategorijaID == elementID){
                brojac++;
            }
        }
        return `(${brojac})`;
    }

    if(tipFiltriranja == "brendID"){
        for(let i=0; i<proizvodi.length; i++){
            if(proizvodi[i].brendID == elementID){
                brojac++;
            }
        }
        return `(${brojac})`;
    }
    if(tipFiltriranja == "ocena"){
        for(let i=0; i<proizvodi.length; i++){
            if(proizvodi[i].ocena == elementID){
                brojac++;
            }
        }
        return `(${brojac})`;
    }
    if(tipFiltriranja == "pol"){
        for(let i=0; i<proizvodi.length; i++){
            if(proizvodi[i].pol == elementID){
                brojac++;
            }
        }
        return `(${brojac})`;
    }
}
function prebrojProizvodePolovi(pol){
    let brojac=0;
    let muskiLabel = document.getElementById("labelM");
    let zenskiLabel = document.getElementById("labelŽ");
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
    if(pol == "Male"){
        for(let i=0; i < proizvodi.length; i++){
            if(proizvodi[i].pol == 1){
                brojac++;
            }
        }
        muskiLabel.innerHTML = `Male <span class="brojProizvodaPol" data-polid="1">(${brojac})</span>`;
    }
    if(pol == "Female"){
        for(let i=0; i < proizvodi.length; i++){
            if(proizvodi[i].pol == 2){
                brojac++;
            }
        }
        zenskiLabel.innerHTML =  `Female <span class="brojProizvodaPol" data-polid="2">(${brojac})</span>`;
    }
}
function ispisVelicinaProizvoda(velicina){
    let velicinaIspis = document.getElementById("uv-sizeSidebar");
    velicinaIspis.innerHTML = "";
    velicina.forEach(element=>{
        velicinaIspis.innerHTML += `<label for="${element.naziv}">${element.naziv} <input type="checkbox" id="${element.naziv}" value="${element.id}"></label>`;
    });
}
function ispisBojaProizvodi(boja){
    let bojaIspis = document.getElementById("uv-colorSidebar");
    bojaIspis.innerHTML = "";
    boja.forEach(element=>{
        bojaIspis.innerHTML += `<label class="c-${element.id}" for="sp-${element.id}"><input type="radio" id="sp-${element.id}" value="${element.id}"></label>`;
    });
}
function ispisiSlider(){
    let nizNaslova = ["Summer Collections 2023", "Spring Collections 2023"];
    let nizSrc = ["img/hero/hero-1.jpg", "img/hero/hero-2.jpg"];
    let nizPodnaslov = ["SUMMER COLLECTION", "SPRING COLLECTION"];
    let nizTekst = ["Experience the essence of summer with our latest collection. Our specialist label has curated a range of luxury essentials that capture the spirit of the season.", "Welcome the season of renewal with our latest collection. Our specialist label has carefully selected a range of luxury essentials that embody the freshness and vitality of spring."];

    let slajder = document.getElementById("uv-Slider");
    for(let i=0; i<nizSrc.length; i++){
    slajder.innerHTML += `<div class="hero__items set-bg" data-setbg="${nizSrc[i]}">
                            <div class="container">
                                <div class="row">
                                    <div class="col-xl-5 col-lg-7 col-md-8">
                                        <div class="hero__text">
                                            <h6>${nizPodnaslov[i]}</h6>
                                            <h2>${nizNaslova[i]}</h2>
                                            <p>${nizTekst[i]}</p>
                                            <a href="shop.html" class="primary-btn">Shop now <span class="arrow_right"></span></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
    }
    slajder.innerHTML += `<div class="owl-nav">
                            <button type="button" role="presentation" class="owl-prev"><span class="arrow_left"><span></span></span></button>
                            <button type="button" role="presentation" class="owl-next"><span class="arrow_right"><span></span></span></button>
                        </div>`
    let heroItems = document.querySelectorAll(".hero__items");
    heroItems.forEach(element => {
        element.style.display = "none";
    });

    heroItems[0].style.display = "block";

    let pozadinaProizvoda = document.querySelectorAll(".hero__items.set-bg");
    let leftBtn = document.querySelector('.owl-prev');
    let rightBtn = document.querySelector('.owl-next');
    let slideNumber = 0;
    let sliderH6 = document.querySelectorAll('.hero__text h6');
    let sliderH2 = document.querySelectorAll('.hero__text h2');
    let sliderP = document.querySelectorAll('.hero__text p');
    let sliderBtn = document.querySelectorAll('.hero__text a')

    rightBtn.addEventListener('click', () => {
        heroItems[slideNumber].style.display = 'none';
        $('.hero__text h6').css({opacity: 0});
        $('.hero__text h2').css({opacity: 0});
        $('.hero__text p').css({opacity: 0});
        $('.hero__text a').css({opacity: 0});
        $('.hero__items').css({opacity: 0});
        slideNumber++;
        if (slideNumber === heroItems.length) {
            slideNumber = 0;
        }
        heroItems[slideNumber].style.display = 'block'; 
        $(heroItems[slideNumber]).animate({opacity: 1}, 500);
        $(sliderH6[slideNumber]).animate({opacity: 1}, 1000);
        $(sliderH2[slideNumber]).animate({opacity: 1}, 1300);
        $(sliderP[slideNumber]).animate({opacity: 1}, 1700);
        $(sliderBtn[slideNumber]).animate({opacity: 1}, 2000);
    
    });

    leftBtn.addEventListener('click', () => {
        heroItems[slideNumber].style.display = 'none';
        slideNumber--;
        if (slideNumber < 0) {
            slideNumber = heroItems.length - 1;
        }
        heroItems[slideNumber].style.display = 'block';
      
    });
}
function instagramSlikeIspis(){
    let instaWrapper = document.querySelector('.instagram .instagram__pic');
    for(let i=1; i<7;i++ ){
        instaWrapper.innerHTML +=
       `<div class="instagram__pic__item set-bg" data-setbg="img/instagram/instagram-${i}.jpg"></div>`;
    }
}
function aboutUsIspis(){
    let naslov = ["Who We Are ?", "How We Started ?", "Why Should You Shoose Us ?"]
    let tekst = ["We are a company that specializes in providing high-quality products to our customers. Today, we continue to uphold our original mission, striving to bring our customers the very best in quality and value.", "Our company was founded with a simple goal in mind: to provide customers with access to top-quality products at an affordable price. We started small, but through hard work and a dedication to our craft, we have grown.", "When you choose our company, you can trust that you are getting the very best. We are committed to providing our customers with the highest quality products, and we stand behind everything we sell and give you."]
    let aboutWrapper = document.querySelector("#uv-aboutUs");
    for(let i=0; i<3;i++){
        aboutWrapper.innerHTML += `<div class="$col-lg-4 col-md-4 col-sm-6">
                                        <div class="about__item">
                                            <h4>${naslov[i]}</h4>
                                            <p>${tekst[i]}</p>
                                        </div>
                                    </div>`;
    };
}
function aboutUsZaposleniIspis(){
    // let nizSlike = ["img/about/team-1.jpg", ]
    let nizTekst = ["John Smith", "Christine Wise", "Sean Robbins", "Lucy Myers"];
    let nizSpan = ["Fashion Design", "C.E.O", "Manager", "Delivery"];
    let nizAlt = ["Zaposleni dizajner", "Vlasnik", "Menadzer", "Dostavljač"];

    let aboutWrapper = document.querySelector("#uv-aboutUsZaposleni");
    for(let i=0; i<nizTekst.length;i++){
        aboutWrapper.innerHTML += `<div class="col-lg-3 col-md-6 col-sm-6">
                                        <div class="team__item">
                                            <img src="img/about/team-${i}.jpg" alt="${nizAlt[i]}">
                                            <h4>${nizTekst[i]}</h4>
                                            <span>${nizSpan[i]}</span>
                                        </div>
                                    </div>`;
    };
};
function aboutUsPartneri(){
    let nizAlt = ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5", "Partner 6", "Partner 7", "Partner 8"];

    let aboutWrapper = document.querySelector("#uv-aboutUsPartneri");

    for(let i=0; i<nizAlt.length;i++){
        aboutWrapper.innerHTML += `<div class="col-lg-3 col-md-4 col-sm-4 col-6">
                                        <a href="#" class="client__item"><img src="img/clients/client-${i}.png" class="hover" alt="${nizAlt[i]}"></a> 
                                    </div>`;
    };
}
function filterProizovdiPocetna(id){
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
    proizvodi = proizvodi.filter(proizvod => proizvod.sekcijaID == id);
    stampanjeProizvoda(proizvodi,".product__filter","col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals");
    dodajBG(".product__item__pic.set-bg");
    dodajUKorpu();
    dodajUOmiljene();
}
function ispisProizvodeSekcije(){
    // let sekcije = JSON.parse(localStorage.getItem("sekcije"));
    let aktivniFilter = document.querySelector('.filter__controls .active');
    filterProizovdiPocetna(aktivniFilter.getAttribute("data-secid"));
    
    let filteriPocetna = document.querySelectorAll('.filter__controls li');
    filteriPocetna.forEach(filter => filter.addEventListener('click', function(){
    filteriPocetna.forEach(filter => filter.classList.remove("active"));
    filter.classList.add("active");
    filterProizovdiPocetna(filter.getAttribute("data-secid"))
    let divProizvodi = document.querySelectorAll('.product__item');
    divProizvodi.forEach(div => div.parentElement.classList.add("uv-proizvodi-okvir"));
    })
    )
}
function tajmerZaTorbu(){
    var odbrojavanje = new Date("Mart 11, 2023 23:59:59").getTime();

    var x = setInterval(function() {
    var danasnjiDatumUms = new Date().getTime();
    var razlika = odbrojavanje - danasnjiDatumUms;
    var dani = Math.floor(razlika / (1000 * 60 * 60 * 24));
    var sati = Math.floor((razlika % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minuti = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
    var sekunde = Math.floor((razlika % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML = ` 
  <div class="cd-item">
    <span>${dani}</span>
    <p>Days</p>
  </div>
  <div class="cd-item">
    <span>${sati}</span>
    <p>Hours</p>
  </div>
  <div class="cd-item">
    <span>${minuti}</span>
    <p>Minutes</p>
  </div>
  <div class="cd-item">
    <span>${sekunde}</span>
    <p>Seconds</p>
  </div>`;

  if (razlika < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "EXPIRED";
  }
}, 1000);
}
function brojacBrojki(){
    let divProizvodi = document.querySelectorAll('.counter .row .counter__item');
    divProizvodi.forEach(div => div.parentElement.classList.add("uv-proizvodi-okvir"));
    let hit = false;
        if(this.window.innerWidth > 991){
            window.addEventListener("scroll", () => {
                let height = window.scrollY;
                // console.log(height);
                if (height < 2000 && height > 1300 && hit == false) {
                  hit = true;
                  let stats = document.querySelectorAll(".cn_num");
                  let statsVal = [];
                  stats.forEach((element) => {
                    statsVal.push(element.innerHTML);
                  });
                  for (let i in statsVal) {
                    var tren = 0;
                    setInterval(() => {
                      if (tren <= statsVal[i]) {
                        stats[i].innerHTML = tren++;
                      }
                    }, 2000 / statsVal);
                  }
                }
              });
        }
        else{
            window.addEventListener("scroll", () => {
                let height = window.scrollY;
                console.log(height);
                if (height < 2000 && height > 1700 && hit == false) {
                  hit = true;
                  let stats = document.querySelectorAll(".cn_num");
                  let statsVal = [];
                  stats.forEach((element) => {
                    statsVal.push(element.innerHTML);
                  });
                  for (let i in statsVal) {
                    var tren = 0;
                    setInterval(() => {
                      if (tren <= statsVal[i]) {
                        stats[i].innerHTML = tren++;
                      }
                    }, 2000 / statsVal);
                  }
                }
              });         
        }
}
window.onscroll = function(){
    skrolovanje();
}
function skrolovanje() {
    var scrollArrow = $(window).scrollTop();

    if (scrollArrow >= 500) { // Promenjen uslov
        $("#scroll").addClass("d-block");
        $("#scroll").removeClass("d-none");
    } else {
        $("#scroll").removeClass("d-block");
        $("#scroll").addClass("d-none");
    }
}
function promeniIzgledProizvoda(){
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
   
    proizvodi = filtrirajProizvode(proizvodi, 'kategorija', 'kategorijaID');
    proizvodi = filtrirajProizvode(proizvodi, 'brend', 'brendID');
    proizvodi = filtrirajProizvode(proizvodi, 'cena', 'cena.aktuelnaCena');
    proizvodi = filtrirajProizvode(proizvodi, 'velicina', 'velicinaID');
    proizvodi = filtrirajProizvode(proizvodi, 'rejting', 'ocena');
    proizvodi = filtrirajProizvode(proizvodi, 'boja', 'bojaID');
    proizvodi = filtrirajProizvode(proizvodi, 'pol', 'pol');
    proizvodi = sortiranjProizvode(proizvodi);
    proizvodi = pretraziProizvode(proizvodi);

    if(proizvodi.length == 0){
        document.querySelector('#prazanNiz').style.display = "block";
        document.querySelector('#prazanNiz').classList.add("alert","alert-danger");
        document.querySelector('#prazanNiz').innerHTML = 'Nažalost nemamo proizvode za izabrani kriterijum.';
    }
    else{
        document.querySelector('#prazanNiz').style.display = "none";
        document.querySelector('#prazanNiz').className = "";
    }
    stampanjeProizvoda(proizvodi,"#allProducts","col-lg-4 col-md-6 col-sm-6 ");
    promeniBrojProizvoda(proizvodi,'.brojProizvodaKat','data-katid',"kategorijaID");
    promeniBrojProizvoda(proizvodi,'.brojProizvodaBrend','data-brendid',"brendID");
    promeniBrojProizvoda(proizvodi,'.brojProizvodaRejting','data-rejtingid',"ocena");
    promeniBrojProizvoda(proizvodi,'.brojProizvodaPol','data-polid',"pol");
    dodajBG(".set-bg");
    opisProizvoda();
    dodajUKorpu();
    dodajUOmiljene();
}
function filtrirajProizvode(proizvodi,tipFiltera,svojstvo){
    let filtriraniProizvodi;
    let nizKategorija = [];
    let nizBrendova = [];
    let nizVelicina = [];
    let kategorije = document.querySelectorAll('#uv-categoriesSidebar input');
    let brendovi = document.querySelectorAll('#uv-brandSidebar input');
    let velicine =  document.querySelectorAll('.shop__sidebar__size label');
    let rejtinzi = document.querySelectorAll('#uv-ratingSidebar input');
    let boje =  document.querySelectorAll('#uv-colorSidebar label');
    let polovi = document.querySelectorAll('.shop__sidebar__tags input');
    if(tipFiltera == 'kategorija'){
        kategorije.forEach(kategorija => {
            if(kategorija.checked == true){
                nizKategorija.push(kategorija.value);
            }
        });
        if(nizKategorija.length == 0){
            filtriraniProizvodi = proizvodi;
        }
        else{
            filtriraniProizvodi = proizvodi.filter(proizvod => nizKategorija.some(elementNiza => proizvod[svojstvo] == elementNiza));
        }
    }
    if(tipFiltera == 'brend'){
        brendovi.forEach(brend => {
            if(brend.checked == true){
                nizBrendova.push(brend.value);
            }
        });
        if(nizBrendova.length == 0){
            filtriraniProizvodi = proizvodi;
        }
        else{
            filtriraniProizvodi = proizvodi.filter(proizvod => nizBrendova.some(elementNiza => proizvod[svojstvo] == elementNiza));
        }
    }
    if(tipFiltera == 'cena'){
        let aktivnaCena = document.querySelector('.aktivnaCena');
        if(aktivnaCena){
            let levaCena = parseFloat(aktivnaCena.children[0].innerHTML);
            let desnaCena = parseFloat(aktivnaCena.children[1].innerHTML);
            filtriraniProizvodi = proizvodi.filter(proizvod => proizvod.cena.aktuelnaCena >= levaCena);      
            filtriraniProizvodi = filtriraniProizvodi.filter(proizvod => proizvod.cena.aktuelnaCena <= desnaCena);    
        }
        else{
            filtriraniProizvodi = proizvodi;
        }
    }
    if(tipFiltera == 'velicina'){
        velicine.forEach(velicina => {
            if(velicina.classList.contains("aktivnaVelicina")){
                nizVelicina.push(Number(velicina.children[0].value));
            }
        });
        if(nizVelicina.length == 0){
            filtriraniProizvodi = proizvodi;
        }
        else{
            filtriraniProizvodi = proizvodi.filter(proizvod => nizVelicina.some(elementNiza => proizvod.velicinaID.includes(elementNiza)));
        }
    }
   
    if(tipFiltera == 'rejting'){
        let niz = [];
        rejtinzi.forEach(rejting => {
            if(rejting.checked == true){
                niz.push(rejting.value)
                filtriraniProizvodi = proizvodi.filter(proizvod => proizvod[svojstvo] == rejting.value);
            }
        });
        if(niz.length == 0){
            filtriraniProizvodi = proizvodi;
        }
    }
    if(tipFiltera == 'boja'){
        let niz = [];
        boje.forEach(boja => {
            if(boja.classList.contains("aktivnaBoja")){
                niz.push(Number(boja.children[0].value))
                filtriraniProizvodi = proizvodi.filter(proizvod => proizvod[svojstvo] == boja.children[0].value);
            }
        });
        if(niz.length == 0){
            filtriraniProizvodi = proizvodi;
        }
    }
    if(tipFiltera == 'pol'){
        let niz = [];
        polovi.forEach(pol => {
            if(pol.checked == true){
                niz.push(pol.value)
                filtriraniProizvodi = proizvodi.filter(proizvod => proizvod[svojstvo] == pol.value);
            }
        });
        if(niz.length == 0){
            filtriraniProizvodi = proizvodi;
        }
    }

    return filtriraniProizvodi;
}
function sortiranjProizvode(proizvodi){
  let vrednost = document.querySelector('#uv-sortiranje').value;
  if(vrednost == 'default'){
    return proizvodi;
  }
  if(vrednost == 'name-asc'){
    proizvodi.sort(function(a, b){
      return a.naziv.localeCompare(b.naziv);
    });
  }
  if(vrednost == 'name-desc'){
    proizvodi.sort(function(a, b){
      return b.naziv.localeCompare(a.naziv);
    });
  }
  if(vrednost == 'price-asc'){
    proizvodi.sort(function(a, b){
      return a.cena.aktuelnaCena - b.cena.aktuelnaCena;
    });
  }
  if(vrednost == 'price-desc'){
    proizvodi.sort(function(a, b){
      return b.cena.aktuelnaCena - a.cena.aktuelnaCena;
    });
  }
  if(vrednost == 'most-popular'){
    proizvodi.sort(function(a, b){
      return b.ocena - a.ocena;
    });
  }
  return proizvodi;
}
function pretraziProizvode(proizvodi){
    let vrednost = document.querySelector('.shop__sidebar__search input').value;
    console.log(proizvodi);
    console.log(vrednost)
    if(vrednost == ''){
      return proizvodi;
    }
    else{
      return proizvodi.filter(proizvod => proizvod.naziv.toLowerCase().includes(vrednost.toLowerCase()));
    }
}
function dodajUKorpu(){
    let btnZaDodavanje = document.querySelectorAll('.add-cart');
    // let nizZaKorpu = [];
    btnZaDodavanje.forEach(btn => 
        btn.addEventListener('click',function(e){
            e.preventDefault();
           
            let idProizvoda = btn.getAttribute("data-proizvodid");
            let cenaPr;
            if(localStorage.getItem("valuta")){
                if(localStorage.getItem("valuta") == "USD"){
                    cenaPr = Number(document.querySelector(`h5[data-proizvodid="${idProizvoda}"]`).innerHTML.slice(1));
                }
                if(localStorage.getItem("valuta") == "EUR"){
                    let cenaProiz =  document.querySelector(`h5[data-proizvodid="${idProizvoda}"]`);
                    let pozicijaEuro = cenaProiz.innerHTML.indexOf('€');
                    cenaPr = Number(cenaProiz.innerHTML.substring(0,pozicijaEuro));
                }
            }
            else{
                cenaPr = Number(document.querySelector(`h5[data-proizvodid="${idProizvoda}"]`).innerHTML.slice(1));
            }
           
           
            let korpa = JSON.parse(localStorage.getItem("korpa"));
            let modal =  document.querySelector('.modal');
            let modalNaslov = document.querySelector('.modal-title');
            let modBody =  document.querySelector('.modal-body');
            let modalTekst = document.querySelector('.modal-body p');
            let overlay = document.querySelector('#overlay-modal');
            let brojac = 0;
            if(korpa != null){     
               for(let i of korpa){
                if(i.id == idProizvoda){
                brojac++;
                }
            }  
            }
            if(brojac == 0){
                modBody.style.display = "flex";
                modBody.style.textAlign = "center";
                modBody.innerHTML = `
                <img src="img/shopping-cart.png" alt="cart">
                <p>You have added a product to the cart! To view the contents of the basket, click the cart icon.</p>
                `;
                modalTekst.style.display = "block";
                modalNaslov.innerHTML = `You added product to the cart!`;
                modal.style.opacity = "1";
                modal.style.display = "block";
                overlay.style.display = "block";
                setTimeout(function(){
                    modal.style.opacity = "0";
                    modal.style.display = "none";
                    overlay.style.display = "none";
                }, 2000)
                korpa.push({"id": idProizvoda,"kolicina": 1});
                localStorage.setItem("korpa", JSON.stringify(korpa));
                //= Number(document.querySelector('.ukupnaCenauKorpi').innerHTML.slice(1));
                //parentElement.children[2].children[1]
                let prikazCene;
                if(localStorage.getItem("ukupnaCena") == null){
                    prikazCene = 0;             
                }
                else{
                    prikazCene = Number(localStorage.getItem("ukupnaCena"));
                }
                
                let ukupnaCenaKorpa = document.querySelectorAll('.ukupnaCenauKorpi');
                // if(localStorage.getItem("valuta") == "USD"){
                //     ukupnaCenaKorpa.forEach(el =>)
                //     prikazCene = Number(ukupnaCenaKorpa.innerHTML.slice(1));
                // }
                // if(localStorage.getItem("valuta") == "EUR"){
                //     let pozEuro = ukupnaCenaKorpa.indexOf('€');
                //     prikazCene = Number(ukupnaCenaKorpa.innerHTML.substring(0,pozEuro));
                // }
                // if(localStorage.getItem("valuta") == null){
                //     prikazCene = Number(ukupnaCenaKorpa.innerHTML.slice(1));
                // }
              
                prikazCene = prikazCene + cenaPr;
                console.log(prikazCene);
                console.log(typeof prikazCene);
                ukupnaCenaKorpa.forEach(cena => {
                    if(localStorage.getItem("valuta") == "USD"){
                        cena.innerHTML = `$${prikazCene.toFixed(2)}`;
                    }
                    if(localStorage.getItem("valuta") == "EUR"){
                        cena.innerHTML = `${prikazCene.toFixed(2)}&euro;`;
                    }
                    if(localStorage.getItem("valuta") == null){
                        cena.innerHTML = `$${prikazCene.toFixed(2)}`;
                    }
                })
                localStorage.setItem("ukupnaCena", `${Number(prikazCene).toFixed(2)}`);
                brojProizvodaUKorpi();
                // ukupnaCenaPrikaz();
            }
            else{
                modBody.style.display = "none";
                modalNaslov.innerHTML = `Your product is already in cart!`;
                modal.style.opacity = "1";
                modal.style.display = "block";
                overlay.style.display = "block";
                setTimeout(function(){
                    modal.style.opacity = "0";
                    modal.style.display = "none";
                    overlay.style.display = "none";
                }, 2000)
            }
          
    })
    )
}
function dodajUOmiljene(){
    let btnsZaDodavanje = document.querySelectorAll('.product__hover a');
    btnsZaDodavanje.forEach(btn => {
        btn.addEventListener('click',function(e){
            e.preventDefault();
            let proizvodId = btn.getAttribute("data-proizvodid");
            let listaOmiljenih = JSON.parse(localStorage.getItem("omiljeniProizvodi"));
            let modal =  document.querySelector('.modal');
            let modalSlika = document.querySelector('.modal img');
            let modalNaslov = document.querySelector('.modal-title');
            let modBody =  document.querySelector('.modal-body');
            let modalTekst = document.querySelector('.modal-body p');
            let overlay = document.querySelector('#overlay-modal');
            let brojac = 0;
            if(listaOmiljenih != null){     
                for(let i of listaOmiljenih){
                 if(i.id == proizvodId){
                 brojac++;
                 }
             }  
             }
             if(brojac == 0){
                modBody.style.display = "flex";
                modBody.style.textAlign = "center";
                modBody.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" id="heart" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p>You have added a product to the wishlist! To view the contents of the favourite list, click the heart icon.</p>
                `;
                modalNaslov.innerHTML = `You added product to the wishlist!`;
                modal.style.opacity = "1";
                modal.style.display = "block";
                overlay.style.display = "block";
                const heart = document.getElementById('heart'); 
                    if(heart.classList.contains('like')) {
                    heart.classList.remove('like');
                    heart.classList.add('unlike');
                    } else {
                    heart.classList.remove('unlike');
                    heart.classList.add('like');
                    }
                setTimeout(function(){
                    modal.style.opacity = "0";
                    modal.style.display = "none";
                    overlay.style.display = "none";
                }, 3000)
                listaOmiljenih.push({"id": proizvodId});
                 localStorage.setItem("omiljeniProizvodi", JSON.stringify(listaOmiljenih));
             }
             else{
                modBody.style.display = "none";
                modalNaslov.innerHTML = `Your product is already in wishlist!`;
                modal.style.opacity = "1";
                modal.style.display = "block";
                overlay.style.display = "block";
                setTimeout(function(){
                    modal.style.opacity = "0";
                    modal.style.display = "none";
                    overlay.style.display = "none";
                }, 2000)
             }
        })
    })
}
function ispisiProizvodeKorpa(proizvodi){
    let korpa = JSON.parse(localStorage.getItem("korpa"));
    let cartWrapper = document.querySelector('.shopping__cart__table tbody');
    cartWrapper.innerHTML = "";
    for(let proizvod of korpa){
    for(let pr of proizvodi){
            if(proizvod.id == pr.id){
                if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
                    cartWrapper.innerHTML +=  `<tr>
                    <td class="product__cart__item">
                        <div class="product__cart__item__pic">
                            <img src="${pr.slike.manja}" alt="">
                        </div>
                        <div class="product__cart__item__text">
                            <h6>${pr.naziv}</h6>
                            <h5 data-proizvodid="${pr.id}">$${pr.cena.aktuelnaCena}</h5>
                        </div>
                    </td>
                    <td class="quantity__item">
                        <div class="quantity">
                            <div class="pro-qty-2 d-flex align-items-center">
                                <span class="fa fa-angle-left dec qtybtn smanjiKolicinu" data-proizvodid="${pr.id}"></span>
                                <span id="kolicina">${proizvod.kolicina}</span>
                                <span class="fa fa-angle-right inc qtybtn povecajKolicinu" data-proizvodid="${pr.id}"></span>
                            </div>
                        </div>
                    </td>
                    <td class="cart__price" data-proizvodid="${pr.id}">$${pr.cena.aktuelnaCena}</td>
                    <td class="cart__close"><i class="fa fa-close obrisiProizvod" data-proizvodid="${pr.id}"></i></td>
                </tr>`;
                }
                if(localStorage.getItem("valuta") == "EUR"){
                    cartWrapper.innerHTML +=  `<tr>
                    <td class="product__cart__item">
                        <div class="product__cart__item__pic">
                            <img src="${pr.slike.manja}" alt="">
                        </div>
                        <div class="product__cart__item__text">
                            <h6>${pr.naziv}</h6>
                            <h5 data-proizvodid="${pr.id}">${pr.cena.aktuelnaCena}&euro;</h5>
                        </div>
                    </td>
                    <td class="quantity__item">
                        <div class="quantity">
                            <div class="pro-qty-2 d-flex align-items-center">
                                <span class="fa fa-angle-left dec qtybtn smanjiKolicinu" data-proizvodid="${pr.id}"></span>
                                <span id="kolicina">${proizvod.kolicina}</span>
                                <span class="fa fa-angle-right inc qtybtn povecajKolicinu" data-proizvodid="${pr.id}"></span>
                            </div>
                        </div>
                    </td>
                    <td class="cart__price" data-proizvodid="${pr.id}">${pr.cena.aktuelnaCena}&euro;</td>
                    <td class="cart__close"><i class="fa fa-close obrisiProizvod" data-proizvodid="${pr.id}"></i></td>
                </tr>`;
                }
            }
        }
    }
}
function promeniProizvodeKorpa(){
    let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
        if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
            proizvodi = proizvodi;
        }
        if(localStorage.getItem("valuta") == "EUR"){
            for(let p of proizvodi){
                p.cena.aktuelnaCena = Number(p.cena.aktuelnaCena) * 0.93528;
                p.cena.aktuelnaCena = p.cena.aktuelnaCena.toFixed(2);
            }
        }
        ispisiProizvodeKorpa(proizvodi);
}
if(window.location.pathname == "/index.html"){
    ispisiSlider();
    instagramSlikeIspis();
    window.onload = function(){
        ukupnaCenaPrikaz();
        tajmerZaTorbu();
        dodajBG(".hero__items.set-bg");
        dodajBG(".product__item__pic.set-bg");
        dodajBG(".instagram__pic__item.set-bg");
        dodajBG(".blog__item__pic.set-bg");
       ispisProizvodeSekcije();    
       opisProizvoda();
       let divProizvodi = document.querySelectorAll('.product__item');
        divProizvodi.forEach(div => div.parentElement.classList.add("uv-proizvodi-okvir"));
       var trenutniFilter = 1;
       let filteriPocetna = document.querySelectorAll('.filter__controls li');   
       filteriPocetna.forEach(filter => filter.addEventListener('click', 
            function(){
                trenutniFilter = parseInt(filter.getAttribute("data-secid"));
                opisProizvoda();
                if(trenutniFilter == filteriPocetna.length)
                {
                    trenutniFilter = 0;
                }
            }));
        setInterval(function(){
            filteriPocetna.forEach(filter => filter.classList.remove("active"));
            filteriPocetna[trenutniFilter].classList.add("active");
            let aktivniFilter = document.querySelector('.filter__controls .active');
            filterProizovdiPocetna(aktivniFilter.getAttribute("data-secid"));           
            let divProizvodi = document.querySelectorAll('.product__item');
            divProizvodi.forEach(div => div.parentElement.classList.add("uv-proizvodi-okvir"));
            opisProizvoda();   
            trenutniFilter++;
            if(trenutniFilter == filteriPocetna.length)
            {
                trenutniFilter = 0;
            }        
        }, 5000);     
    };
}
if(window.location.pathname == "/shop.html"){
    // ajaxCallBack("proizvodi.json", function(proizvodi){
        let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
        stampanjeProizvoda(proizvodi,"#allProducts","col-lg-4 col-md-6 col-sm-6 ");
        //  });
    ajaxCallBack("kategorije.json", function(kategorija){
        ispisKategorija(kategorija);
    });

    ajaxCallBack("brendovi.json", function(brendovi){
        ispisBrendova(brendovi);
    });

    ajaxCallBack("velicina.json", function(velicina){
        ispisVelicinaProizvoda(velicina);
    });

    ajaxCallBack("boja.json", function(boje){
        ispisBojaProizvodi(boje);
    });
    prebrojProizvodePolovi("Male");//svaki put kad se klikne nesto ova f-ja se poziva
    ispisRejtingaSidebar();
    prebrojProizvodePolovi("Female"); //probaj dal je moguce samo jedna funckija...
    document.querySelector('#prazanNiz').style.display = "none";
    window.onload = function(){
        ukupnaCenaPrikaz();
        dodajBG(".set-bg");
        let divProizvodi = document.querySelectorAll('.product__item');
        divProizvodi.forEach(div => div.parentElement.classList.add("uv-proizvodi-okvir"));
        opisProizvoda();
        dodajUKorpu();
        dodajUOmiljene();
        let catInputi = document.querySelectorAll('#uv-categoriesSidebar input');
        let brendInputi = document.querySelectorAll('#uv-brandSidebar input');
        let ceneRang = document.querySelectorAll('.shop__sidebar__price ul li')
        let velicine = document.querySelectorAll('.shop__sidebar__size label');
        let rejtingInputi = document.querySelectorAll('#uv-ratingSidebar input');
        let bojeInputi = document.querySelectorAll('#uv-colorSidebar label');
        let polInputi = document.querySelectorAll('.shop__sidebar__tags input');
        let ddlSort = document.querySelector('#uv-sortiranje');
        let pretraga = document.querySelector('.shop__sidebar__search input');
        catInputi.forEach(input => 
            input.addEventListener('change', function(){
                promeniIzgledProizvoda();
            })
            );
        brendInputi.forEach(input => 
            input.addEventListener('change', function(){
                promeniIzgledProizvoda();
            })
            );
        ceneRang.forEach(cena => 
            cena.addEventListener('click', function(){
                ceneRang.forEach(cena =>
                cena.classList.remove("aktivnaCena"));

                cena.classList.add("aktivnaCena");
                promeniIzgledProizvoda();
            })
            );
        velicine.forEach(velicina =>
            velicina.addEventListener('change', function(){
                velicina.classList.toggle("aktivnaVelicina");
                promeniIzgledProizvoda();
            }));
        rejtingInputi.forEach(rejting =>
            rejting.addEventListener('change', function(){
                promeniIzgledProizvoda();
            }));
        bojeInputi.forEach(boja =>
            boja.addEventListener('click', function(){
                bojeInputi.forEach(boja =>
                    boja.classList.remove("aktivnaBoja")
                );

                boja.classList.add("aktivnaBoja");
                promeniIzgledProizvoda();
            })
        );
        polInputi.forEach(pol =>
            pol.addEventListener('change', function(){
                promeniIzgledProizvoda();
            }));
        ddlSort.addEventListener('change', function(){
            promeniIzgledProizvoda();
        });
        pretraga.addEventListener('keyup', function(){
           promeniIzgledProizvoda();
        })
        promeniBrojProizvoda();
    }
   
}
if(window.location.pathname == '/about.html'){
    
    let counterWrapper = document.querySelector('.counter .row');
    let brojevi = ["370","20","150","540"];
    let nazivi = ["Our <br />Clients","Total <br />Categories","In <br />Country","Happy <br />Customer"]
    for(let broj in brojevi){
        counterWrapper.innerHTML += `
        <div class="col-lg-3 col-md-6 col-sm-6">
            <div class="counter__item">
                <div class="counter__item__number"> 
                    <h2 class="cn_num">${brojevi[broj]}</h2>
                </div>
                <span>${nazivi[broj]}</span>
            </div>
        </div>`;
    }
    window.onload = function(){
        ukupnaCenaPrikaz();
        brojacBrojki();
        dodajBG(".testimonial__pic.set-bg");
        aboutUsIspis();
        aboutUsZaposleniIspis();
        aboutUsPartneri();
    }
}
if(window.location.pathname == '/shopping-cart.html'){
    if(JSON.parse(localStorage.getItem("korpa")) == null || JSON.parse(localStorage.getItem("korpa")).length == 0){
        document.querySelector('.shopping-cart').innerHTML =   
        `<div id="prazno">
        <h2>Your cart is empty.</h2>
        <a href="shop.html"><button type="submit" class="btn btn-primary">Back to shop page</button></a>
        </div>`;
    }
    else{
        promeniProizvodeKorpa();
    
    }
    window.onload = function(){
        if(localStorage.getItem("korpa") != null && JSON.parse(localStorage.getItem("korpa")).length != 0){
        let ukupneCeneProizvoda = document.querySelectorAll('.cart__price');
        ukupneCeneProizvoda.forEach(cena => {
            let proizvodId = cena.getAttribute("data-proizvodid")
            let kolicina = Number(cena.parentElement.children[1].children[0].children[0].children[1].innerHTML);
            let cenaProizvoda = Number(document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.slice(1));
            let ukupnaCenaProizvoda = kolicina * cenaProizvoda;
            cena.innerHTML = `$${ukupnaCenaProizvoda.toFixed(2)}`;
        })
        ukupnaCenaPrikaz();
        $(document).ready(function(){
            ukupnaCenaUKorpi();
            let checkoutBtn = document.querySelector('.cart__total a');
            checkoutBtn.addEventListener('click', function(){
            let ukupnaCenaProizvoda = document.querySelectorAll('.cart__price');
            let nizZaIsplatu = [];
            ukupnaCenaProizvoda.forEach(cena => {
                let cenaBroj;
                let imeProizvoda = cena.parentElement.children[0].children[1].children[0].innerHTML;;
                if(localStorage.getItem("valuta") == "USD" || localStorage.getItem("valuta") == null){
                    cenaBroj = cena.innerHTML;
                    nizZaIsplatu.push({"ime": imeProizvoda, "cena": cenaBroj});
                    }
                if(localStorage.getItem("valuta") == "EUR"){
                    cenaBroj = cena.innerHTML;
                    nizZaIsplatu.push({"ime": imeProizvoda, "cena": cenaBroj});
                }
            });
            let ukupnaCena = document.querySelector('.cart__total span').innerHTML;
            nizZaIsplatu.push({"ukupnaCena": ukupnaCena});
            localStorage.setItem("korpaZaIsplatu", JSON.stringify(nizZaIsplatu));
            });
        });
        menjanjeKolicineUKorpi();
        brisanjeProizvoda("korpa");
        }
    }
}
if(window.location.pathname == '/wishlist.html'){
    if(JSON.parse(localStorage.getItem("omiljeniProizvodi")) == null || JSON.parse(localStorage.getItem("omiljeniProizvodi")).length == 0){
        document.querySelector('#wishlist').innerHTML = `<div id="prazno">
        <h2>Your wishlist is empty.</h2>
        <a href="shop.html"><button type="submit" class="btn btn-primary">Back to shop page</button></a>
        </div>`;
    }
    else{
        let wishlistOkvir = document.querySelector('#wishlist .row');
        let proizvodi = JSON.parse(localStorage.getItem("proizvodi"));
        let listaOmiljenih = JSON.parse(localStorage.getItem("omiljeniProizvodi"));
        for(let i of listaOmiljenih){
            for(let p of proizvodi){
                if(i.id == p.id){
                    wishlistOkvir.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex flex-column align-items-center okvir-kartica">
                    <div class="card omiljeni-kartica d-flex flex-column align-items-center">
                        <img src="${p.slike.veca}" class="card-img-top" alt="${p.naziv}">
                        <div class="card-body">
                            <h6>${p.naziv}</h6>
                            <div class="rating">
                            ${ispisiRejting(p)}
                            </div>
                            ${ispisiCenu(p)}
                        </div>
                    </div>
                    <i class="fa fa-close obrisiProizvod mt-3" data-proizvodid="${p.id}"></i>
                </div>`;
                }
            }
        }
    }
    window.onload = function(){
        ukupnaCenaPrikaz();
        brisanjeProizvoda("omiljenaLista");
    }
}
if(window.location.pathname == '/checkout.html'){
   validation(); 
    $(document).ready(function(){
        let nizZaIsplatu = JSON.parse(localStorage.getItem("korpaZaIsplatu"));
        let ispis = document.querySelector('.checkout__order ul');
        for(let i of nizZaIsplatu){
            if(i.ime){
                ispis.innerHTML += `<li>${i.ime} <span>${i.cena}</span></li>`;
            }
        }
        let checkTotal = document.querySelector('.checkout__total__all');
        let pozicija = nizZaIsplatu.length - 1;
        checkTotal.innerHTML = `<li>Total<span>${nizZaIsplatu[pozicija].ukupnaCena}</span></li>`
    });
    //site-btn
}
if(window.location.pathname == '/contact.html'){
    ukupnaCenaPrikaz();
    const nameRegex = /^[A-ZČĆĐŽŠ][a-zčćđžš]{2,}(\s[A-ZČĆĐŽŠ][a-zčćđžš]{2,})*$/;
    const emailRegex = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/;
    let sendBtn = document.querySelector('.site-btn');
    sendBtn.addEventListener('click', function(e){
        e.preventDefault();
        let name = document.querySelector('input[name="fullName"]');
        let email = document.querySelector('input[name="mail"]');
        let message = document.querySelector('textarea');
        let greske = 0;
        if(!nameRegex.test(name.value)){
            greske++;
            $(name).next().html("Inccorect full name format. Example: Novak Djokovic");
        }
        else{
            $(name).next().html("");
        }
        if(!emailRegex.test(email.value)){
            greske++;
            $(email).next().html("Inccorect email format. Example: novakdjokovic@gmail.com");
        }
        else{
            $(email).next().html("");
        }
        if(message.value == ""){
            greske++;
            $(message).next().html("Message field is required.");
        }
        else{
            $(message).next().html("");
        }
        if(greske == 0){
            $('#sentMessage').html("Message sent successfully!");
            $('#sentMessage').css("color", "green");
            $('input').val("");
            $('textarea').val("");
        }
        });

}
if(window.location.pathname == '/autor.html'){
    ukupnaCenaPrikaz();
}
function brisanjeProizvoda(tip){
    let obrisiDugme = document.querySelectorAll('.obrisiProizvod');
    obrisiDugme.forEach(dugme => {
        dugme.addEventListener('click', function(){
            let proizvodId = dugme.getAttribute("data-proizvodid");
            
            if(tip == "korpa"){
                dugme.parentElement.parentElement.remove();
                let korpa = JSON.parse(localStorage.getItem("korpa"));
                let novaKorpa = korpa.filter(proizvod => proizvod.id !== proizvodId);
                if(novaKorpa.length == 0){
                    localStorage.removeItem("korpa");
                    document.querySelector('.shopping-cart .container').innerHTML =   
                    `<div class="wish">
                    <h2>Your cart is empty.</h2>
                    <a href="shop.html"><button type="submit" class="btn btn-primary">Back to shop page</button></a>
                    </div>`;
                    localStorage.removeItem("ukupnaCena");
                    let ukupnaCenaKorpa = document.querySelectorAll('.ukupnaCenauKorpi');
                    ukupnaCenaKorpa.forEach(cena => {
                        cena.innerHTML = `$0.00`;
                    })
                }
                else{    
                    localStorage.setItem("korpa", JSON.stringify(novaKorpa));
                    let ukupnaCena = document.querySelector('.cart__total span').innerHTML.slice(1);
                    localStorage.setItem("ukupnaCena", ukupnaCena);
                    ukupnaCenaPrikaz();
                    ukupnaCenaUKorpi();
                   
                }
                brojProizvodaUKorpi();
            }
            if(tip == "omiljenaLista"){
                dugme.parentElement.remove();
                let listaOmiljenih = JSON.parse(localStorage.getItem("omiljeniProizvodi"));
                let novaLista = listaOmiljenih.filter(proizvod => proizvod.id !== proizvodId);
                if(novaLista.length == 0){
                    localStorage.removeItem("omiljeniProizvodi");
                    document.querySelector('#wishlist').innerHTML = `<div id="prazno">
                    <h2>Your wishlist is empty.</h2>
                    <a href="shop.html"><button type="submit" class="btn btn-primary">Back to shop page</button></a>
                    </div>`;
                }
                else{    
                    localStorage.setItem("omiljeniProizvodi", JSON.stringify(novaLista));
                }
            }
           
        })
    })
}
function menjanjeKolicineUKorpi(){
    let ceneProizvodaUkupno = document.querySelectorAll('.shopping__cart__table .cart__price');
    ceneProizvodaUkupno.forEach(cena => {
        let kolicina = Number(cena.parentElement.children[1].children[0].children[0].children[1].innerHTML);
        let cenaPojPr = 0;
        console.log(kolicina);
        if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
            cenaPojPr = Number(document.querySelector(`h5[data-proizvodid="${cena.getAttribute("data-proizvodid")}"`).innerHTML.slice(1));
            console.log(cenaPojPr, typeof cenaPojPr);
            let ukCenaPr = cenaPojPr * kolicina;
            cena.innerHTML = `$${ukCenaPr.toFixed(2)}`;
        }
        if(localStorage.getItem("valuta") == "EUR"){
            let pozEuro = document.querySelector(`h5[data-proizvodid="${cena.getAttribute("data-proizvodid")}"`).innerHTML.indexOf('€');
            cenaPojPr = Number(document.querySelector(`h5[data-proizvodid="${cena.getAttribute("data-proizvodid")}"`).innerHTML.substring(0,pozEuro));
            let ukCenaPr = cenaPojPr * kolicina;
            cena.innerHTML = `${ukCenaPr.toFixed(2)}&euro;`;
        }
       
    })
    let povecajKol = document.querySelectorAll('.povecajKolicinu');
    let smanjiKol = document.querySelectorAll('.smanjiKolicinu');
    povecajKol.forEach(el => {
        el.addEventListener('click', function(){
            let korpa = JSON.parse(localStorage.getItem("korpa"));
            let proizvodId = this.getAttribute("data-proizvodid");
            let kolicina = Number(this.parentElement.children[1].innerHTML);
            let ukupnaVrednost = 0;
            let cena = 0;
            if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
                cena = Number(document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.slice(1));
            }
            if(localStorage.getItem("valuta") == "EUR"){
                let pozEuro = document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.indexOf('€');
                cena = Number(document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.substring(0,pozEuro));
            }
            kolicina++;
            ukupnaVrednost = cena * kolicina;                      
            this.parentElement.children[1].innerHTML = kolicina;
            if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
                document.querySelector(`td[data-proizvodid="${proizvodId}"]`).innerHTML = `$${ukupnaVrednost.toFixed(2)}`;
            }
            if(localStorage.getItem("valuta") == "EUR"){
                document.querySelector(`td[data-proizvodid="${proizvodId}"]`).innerHTML = `${ukupnaVrednost.toFixed(2)}&euro;`;
            }
           
            for(let i of korpa){
                if(i.id == proizvodId){
                 i.kolicina = parseInt(kolicina);
                }
              }
            localStorage.setItem("korpa", JSON.stringify(korpa));
            localStorage.setItem("ukupnaCena", `${ukupnaVrednost.toFixed(2)}`);
            ukupnaCenaPrikaz();
            ukupnaCenaUKorpi();
        })
        });
    smanjiKol.forEach(el => {
        el.addEventListener('click', function(){
            let korpa = JSON.parse(localStorage.getItem("korpa"));
            let proizvodId = this.getAttribute("data-proizvodid");
            let kolicina = Number(this.parentElement.children[1].innerHTML);
            let ukupnaVrednost = 0;
            let cena = 0;
            if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
                cena = Number(document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.slice(1));
            }
            if(localStorage.getItem("valuta") == "EUR"){
                let pozEuro = document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.indexOf('€');
                cena = Number(document.querySelector(`h5[data-proizvodid="${proizvodId}"]`).innerHTML.substring(0,pozEuro));
            }
           
            if(kolicina == 1){
                kolicina = 1;
            }
            else{
                kolicina--;
            }
            ukupnaVrednost = cena * kolicina;                  
            this.parentElement.children[1].innerHTML = kolicina;
            if(localStorage.getItem("valuta") == null || localStorage.getItem("valuta") == "USD"){
                document.querySelector(`td[data-proizvodid="${proizvodId}"]`).innerHTML = `$${ukupnaVrednost.toFixed(2)}`;
            }
            if(localStorage.getItem("valuta") == "EUR"){
                document.querySelector(`td[data-proizvodid="${proizvodId}"]`).innerHTML = `${ukupnaVrednost.toFixed(2)}&euro;`;
            }
            for(let i of korpa){
                if(i.id == proizvodId){
                 i.kolicina = parseInt(kolicina);
                }
              }
            localStorage.setItem("korpa", JSON.stringify(korpa));
            localStorage.setItem("ukupnaCena", `${ukupnaVrednost.toFixed(2)}`);
            ukupnaCenaPrikaz();
            ukupnaCenaUKorpi();
        })
        });
}
function ukupnaCenaUKorpi(){
   // cart__total
   if(JSON.parse(localStorage.getItem("korpa")) != null && JSON.parse(localStorage.getItem("korpa")).length > 0){
    let cenaSpan = document.querySelector('.cart__total span');
    let ukupneCeneProizvoda = document.querySelectorAll('.cart__price');
    let vrednost = 0;
    ukupneCeneProizvoda.forEach(cena => {
        if(localStorage.getItem("valuta") == "USD" || localStorage.getItem("valuta") == null){
            vrednost += Number(cena.innerHTML.slice(1));
        }
        if(localStorage.getItem("valuta") == "EUR"){
            cenaInerr = cena.innerHTML;
            let pozicijaEuro = cenaInerr.indexOf("€");
            console.log(pozicijaEuro);
            let cenaEuro = Number(cena.innerHTML.substring(0,pozicijaEuro));
            console.log(vrednost);
            vrednost += cenaEuro;
        }
         
     });
     if(localStorage.getItem("valuta") == "USD" || localStorage.getItem("valuta") == null){
        cenaSpan.innerHTML = `$${vrednost.toFixed(2)}`;
        }
    if(localStorage.getItem("valuta") == "EUR"){
        cenaSpan.innerHTML = `${vrednost.toFixed(2)}€`;
    }
    let cenauKorpi = document.querySelectorAll('.ukupnaCenauKorpi');
    cenauKorpi.forEach(cena => {
        if(localStorage.getItem("valuta") == "USD" || localStorage.getItem("valuta") == null){
           cena.innerHTML = `$${vrednost.toFixed(2)}`;
        }
        if(localStorage.getItem("valuta") == "EUR"){
            cena.innerHTML = `${vrednost.toFixed(2)}€`;
        }
    })
     if(vrednost == 0){
         localStorage.setItem("ukupnaCena", `0.00`);
     }
     else{
         localStorage.setItem("ukupnaCena", `${vrednost.toFixed(2)}
         `);
     }
   }
 

}
function validateInput(input,regex,type){
    var countErrors = 0;
    if(input.value == ""){
      input.className = "is-invalid";
      $(input).next().html("This field is required and can not be empty.");
      countErrors++;
    }
    else if(!regex.test(input.value)){
      input.className = "is-invalid";
      switch(type){
        case 'firstname':
          $(input).next().html("Inccorect first name format. First letter must be capital and name must contain only letters. Example: Novak");
          countErrors++;
          break;
        case 'lastname':
          $(input).next().html("Inccorect last name format. First letter must be capital and last name must contain only letters. Example: Đoković");
          countErrors++;
          break;
        case 'email':
          $(input).next().html("Inccorect email format. Example: novakdjokovic@gmail.com");
          countErrors++;
          break;
        case 'phone':
          $(input).next().html("Inccorect phone format. Example: +381640984199 or 0601234567");
          countErrors++;
          break;
        case 'address':
          $(input).next().html("Inccorect address format. Example: Ustanička 129");
          countErrors++;
          break;
        case 'city':
          $(input).next().html("Inccorect city format. First letter must be capital and name must contain only letters. Example: Belgrade");
          countErrors++;
          break;
        case 'zip':
          $(input).next().html("Inccorect zip format. Example: 11000");
          countErrors++;
          break;
      }
    }
    else{
      input.className = "is-valid";
      $(input).next().html("");
      countErrors = 0;
    }
    return countErrors;
}
function validation(){
const firstName = document.querySelector('input[name="first_name"]');
const lastName = document.querySelector('input[name="last_name"]');
const email = document.querySelector('input[name="email"]');
const phone = document.querySelector('input[name="phone"]');
const address = document.querySelector('input[name="address"]');
const city = document.querySelector('input[name="city"]');
const country = document.querySelector('input[name="country"]');
const zip = document.querySelector('input[name="zip"]');
const nameRegex = /^[A-ZČĆĐŽŠ][a-zčćđžš]{2,}(\s[A-ZČĆĐŽŠ][a-zčćđžš]{2,})*$/;
const emailRegex = /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/;
const countryRegex = /^[A-Z]\w[\w.\-#&\s]{3,}$/;
const phoneRegex = /^(\+381|0)[6-9][0-9]{7,8}$/;
const addressRegex = /[A-Z0-9][a-zA-Z0-9\s]{5,}?/;
const cityRegex = /^[A-ZČĆĐŽŠ][a-zčćđžš]{2,}(\s[A-ZČĆĐŽŠ][a-zčćđžš]{2,})*$/;
const zipRegex = /^[0-9]{5}$/;
firstName.addEventListener('blur',function(){
    validateInput(this,nameRegex,'firstname');
});
lastName.addEventListener('blur',function(){
    validateInput(this,nameRegex,'lastname');
});
email.addEventListener('blur',function(){
    validateInput(this,emailRegex,'email');
});
phone.addEventListener('blur',function(){
    validateInput(this,phoneRegex,'phone');
});
address.addEventListener('blur',function(){
    validateInput(this,addressRegex,'address');
});
city.addEventListener('blur',function(){
    validateInput(this,cityRegex,'city');
});
zip.addEventListener('blur',function(){
    validateInput(this,zipRegex,'zip');
});
country.addEventListener('blur',function(){
    validateInput(this,countryRegex,'country');
});
document.querySelector('.checkout__order button[type="submit"]').addEventListener('click',function(e){
    e.preventDefault();
    let countErrors = 0;
    countErrors += validateInput(phone,phoneRegex,'phone');
    countErrors += validateInput(firstName,nameRegex,'firstname');
    countErrors += validateInput(lastName,nameRegex,'lastname');
    countErrors += validateInput(email,emailRegex,'email');
    countErrors += validateInput(country,countryRegex,'country');
    countErrors += validateInput(address,addressRegex,'address');
    countErrors += validateInput(city,cityRegex,'city');
    countErrors += validateInput(zip,zipRegex,'zip');
    console.log(countErrors);
    if(countErrors == 0){
    localStorage.removeItem('korpa');
    localStorage.removeItem('korpaZaIsplatu');
    localStorage.removeItem('ukupnaCena');
        document.querySelector('.checkout .container').innerHTML = `
        <div class="checkout__order">
        <h2>Thank you for your order!</h2>
        <p>We will contact you soon.</p>
        <a href="shop.html"><button type="submit" class="btn btn-primary">Back to shop page</button></a>
        </div>
        `;
        // location.href = 'index.html';
    };
    brojProizvodaUKorpi();
});
}