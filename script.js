import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
setPersistence,
inMemoryPersistence
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getDatabase,
ref,
get,
set,
update
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firebase

const firebaseConfig = {

apiKey:"AIzaSyCQwioA_6Per63PcLIgrXUPr0S7_hA9ccM",

authDomain:"livraison-d29a1.firebaseapp.com",

databaseURL:"https://livraison-d29a1-default-rtdb.europe-west1.firebasedatabase.app",

projectId:"livraison-d29a1",

storageBucket:"livraison-d29a1.firebasestorage.app",

messagingSenderId:"173715112364",

appId:"1:173715112364:web:05838c15e6a41acb6f7a09"

};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

setPersistence(auth,inMemoryPersistence);


const database = getDatabase(app);





// Salutation

function greeting(){

let h = new Date().getHours();

let text = document.getElementById("greeting");


if(text){

if(h < 12){

text.textContent="Manahoana, Bonjour !";

}

else if(h < 18){

text.textContent="Salama, Bon après-midi !";

}

else{

text.textContent="Tonga soa, Bonsoir !";

}

}

}


greeting();






// Carte

function initMap(){

if(document.getElementById("map")){


const map = L.map("map")
.setView([-18.8792,47.5079],5);


L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

).addTo(map);


L.marker([-18.8792,47.5079])

.addTo(map)

.bindPopup("Antananarivo");


}

}


initMap();






// CREATION COMPTE COMMERCANT


const merchantForm =
document.getElementById("merchantForm");


if(merchantForm){


merchantForm.addEventListener("submit",async(e)=>{


e.preventDefault();



const name =
document.getElementById("merchantName").value;


const phone =
document.getElementById("merchantPhone").value;


const email =
document.getElementById("merchantEmail").value;


const password =
document.getElementById("merchantPassword").value;


const address =
document.getElementById("merchantAddress").value;



const btn =
document.getElementById("submitBtn");


btn.disabled=true;

btn.textContent="Création...";



try{


const userCredential =
await createUserWithEmailAndPassword(

auth,
email,
password

);



const uid =
userCredential.user.uid;



await set(

ref(database,"merchants/"+uid),

{

name:name,

phone:phone,

email:email,

address:address,

createdAt:new Date().toISOString()

}

);



alert("Compte créé avec succès");


window.location.href="commercant.html";



}

catch(error){


alert(error.message);


btn.disabled=false;

btn.textContent="Créer mon compte";


}


});


}






// AFFICHER FORMULAIRE CONNEXION


const loginBtn =
document.getElementById("loginBtn");


if(loginBtn){


loginBtn.onclick=()=>{


document.getElementById("registerBox").style.display="none";


document.getElementById("loginBox").style.display="block";


};


}







// CONNEXION


const loginForm =
document.getElementById("loginForm");


if(loginForm){


loginForm.addEventListener("submit",async(e)=>{


e.preventDefault();



const email =
document.getElementById("loginEmail").value;


const password =
document.getElementById("loginPassword").value;



try{


await signInWithEmailAndPassword(

auth,
email,
password

);



alert("Connexion réussie !");


window.location.href="commercant.html";


}

catch(error){


alert("Email ou mot de passe incorrect");


}


});


}








// Etat connexion

onAuthStateChanged(auth,(user)=>{


if(user){

console.log("Connecté :",user.uid);

}


});










// ============================
// LOCALISATION CLIENT
// ============================


const params =
new URLSearchParams(window.location.search);


const clientID =
params.get("client");



if(clientID){


(async()=>{



const container =
document.querySelector(".container");


if(container){

container.style.display="none";

}



const clientPage =
document.getElementById("clientLocationPage");


if(clientPage){

clientPage.classList.remove("hidden");

}



const gpsButton =
document.getElementById("gpsButton");


const gpsStatus =
document.getElementById("gpsStatus");


const clientNameLocation =
document.getElementById("clientNameLocation");


const clientProductLocation =
document.getElementById("clientProductLocation");




const clientRef =
ref(database,"clients/"+clientID);



const snap =
await get(clientRef);



if(!snap.exists()){


gpsStatus.textContent="❌ Lien invalide";


gpsButton.disabled=true;


return;


}



const client =
snap.val();



clientNameLocation.textContent =
client.name || "";


clientProductLocation.textContent =
client.product || "";







gpsButton.onclick=()=>{


navigator.geolocation.getCurrentPosition(

async(position)=>{



const lat =
position.coords.latitude;


const lng =
position.coords.longitude;


const accuracy =
position.coords.accuracy;



const mapsLink =

"https://www.google.com/maps/dir/?api=1&destination="
+
lat
+
","
+
lng;




await update(

clientRef,

{

latitude:lat,

longitude:lng,

accuracy:accuracy,

locationLink:mapsLink,

status:"located",

locatedAt:Date.now()

}

);



gpsStatus.innerHTML=

`
✅ Localisation enregistrée<br>
Précision : ${Math.round(accuracy)} mètres
`;



gpsButton.style.display="none";



},


()=>{


gpsStatus.textContent=
"❌ Autorisation GPS refusée";


},


{

enableHighAccuracy:true,

timeout:15000,

maximumAge:0

}


);



};




})();


}
