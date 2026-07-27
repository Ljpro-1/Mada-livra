import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {

getAuth,

createUserWithEmailAndPassword,

onAuthStateChanged

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


const database = getDatabase(app);




// Salutation

function greeting(){

let h=new Date().getHours();

let text=document.getElementById("greeting");


if(h<12){

text.textContent="Manahoana, Bonjour !";

}

else if(h<18){

text.textContent="Salama, Bon après-midi !";

}

else{

text.textContent="Tonga soa, Bonsoir !";

}

}



greeting();






// Carte

function initMap(){

const map=L.map("map")
.setView([-18.8792,47.5079],5);


L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

).addTo(map);



L.marker([-18.8792,47.5079])

.addTo(map)

.bindPopup(
"Antananarivo"
);

}


initMap();






// Création compte

document
.getElementById("merchantForm")
.addEventListener("submit",async(e)=>{


e.preventDefault();



const name=
merchantName.value;


const phone=
merchantPhone.value;


const email=
merchantEmail.value;


const password=
merchantPassword.value;


const address=
merchantAddress.value;



const btn=
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

createdAt:
new Date().toISOString()


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







// Connexion

document
.getElementById("loginBtn")
.onclick=()=>{


document.getElementById("registerBox")
.style.display="none";


document.getElementById("loginBox")
.style.display="block";


};
document
.getElementById("loginForm")
.addEventListener("submit", async(e)=>{


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



window.location.href=
"commercant.html";



}

catch(error){


alert(
"Email ou mot de passe incorrect"
);


}


});





// Si déjà connecté

onAuthStateChanged(auth,(user)=>{


if(user){

localStorage.setItem(
"madaLivraDevice",
user.uid
);


window.location.href="commercant.html";


}


});
const params = new URLSearchParams(
window.location.search
);


const clientID = params.get("client");


const clientPage =
document.getElementById("clientLocationPage");


const gpsButton =
document.getElementById("gpsButton");


const gpsStatus =
document.getElementById("gpsStatus");


const clientNameLocation =
document.getElementById("clientNameLocation");


const clientProductLocation =
document.getElementById("clientProductLocation");



if(clientID){


    // cacher la page commerçant/connexion

    document.querySelector(".container").style.display="none";


    // afficher localisation client

    clientPage.classList.remove("hidden");



    const clientRef =
    ref(db,"clients/"+clientID);



    const snap =
    await get(clientRef);



    if(!snap.exists()){


        gpsStatus.textContent =
        "❌ Lien invalide";


        gpsButton.disabled=true;


    }
    else{


        const client =
        snap.val();


        clientNameLocation.textContent =
        client.name;


        clientProductLocation.textContent =
        client.product;



    }




gpsButton.onclick = ()=>{


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




gpsStatus.innerHTML =

`
✅ Localisation enregistrée<br>
Précision : ${Math.round(accuracy)} mètres
`;



gpsButton.style.display="none";



},


(error)=>{


gpsStatus.textContent =
"❌ Autorisation GPS refusée";


},


{

enableHighAccuracy:true,

timeout:15000,

maximumAge:0

}



);



};



}
