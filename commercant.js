import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
  getAuth,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
  getDatabase,
  ref,
  push,
  set,
  onValue
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



// Initialisation Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);



// Variables

let merchantUID = "";

let currentClientID = "";



// Elements

const nameInput = document.getElementById("clientName");

const phoneInput = document.getElementById("clientPhone");

const productInput = document.getElementById("product");

const saveBtn = document.getElementById("saveClient");

const locationBtn = document.getElementById("requestLocation");

const shareBox = document.getElementById("shareBox");

const locationLink = document.getElementById("locationLink");

const shareBtn = document.getElementById("shareBtn");

const list = document.getElementById("clientList");




// Connexion commerçant

onAuthStateChanged(auth, (user) => {
  
  if (user) {
    
    merchantUID = user.uid;
    
    console.log("Connecté :", merchantUID);
    
    chargerClients();
    
  }
  else {
    
    alert("Vous devez vous connecter");
    
    window.location.href = "index.html";
    
  }
  
});



// Enregistrer client

if (saveBtn) {
  
  saveBtn.onclick = async () => {
    
    
    if (!merchantUID) {
      
      alert("Compte non connecté");
      
      return;
      
    }
    
    
    const clientRef = push(ref(db, "clients"));
    
    
    currentClientID = clientRef.key;
    
    
    
    await set(clientRef, {
      
      merchantUID: merchantUID,
      
      name: nameInput.value,
      
      phone: phoneInput.value,
      
      product: productInput.value,
      
      status: "waiting",
      
      locationLink: "",
      
      createdAt: Date.now()
      
    });
    
    
    
    alert("Client enregistré");
    
    
  };
  
  
}


// Créer lien localisation

if(locationBtn){  locationBtn.onclick = ()=>{


  if(currentClientID===""){

    alert("Enregistrer le client d'abord");

    return;

  }



  const url =

window.location.origin
+
window.location.pathname.substring(
0,
window.location.pathname.lastIndexOf("/")
)
+
"/?client="
+
currentClientID;
  
  locationLink.value=url;


  shareBox.classList.remove("hidden");


};



}





// Partage lien

shareBtn.onclick = async()=>{


  if(navigator.share){


    await navigator.share({

      title:"Mada Livra",

      text:"Veuillez enregistrer votre localisation",

      url:locationLink.value

    });


  }

  else{


    navigator.clipboard.writeText(locationLink.value);

    alert("Lien copié");


  }


};









// Charger clients Firebase

function chargerClients(){


  onValue(ref(db,"clients"),(snapshot)=>{


    list.innerHTML="";



    snapshot.forEach((item)=>{


      const c=item.val();



      if(c.merchantUID === merchantUID){



        let action="";



        if(c.status==="waiting"){


          action=`

          <button class="waiting">

          ⏳ En attente

          </button>

          `;


        }


        else if(c.status==="located"){


          action=`

          <a 
          class="navigate"
          target="_blank"
          href="${c.locationLink}">

          📍 Navigation

          </a>

          `;


        }


        else{


          action="Inconnu";


        }




        list.innerHTML += `


        <tr>


        <td>

        ${c.name || "-"}

        </td>



        <td>

        ${c.phone || "-"}

        </td>



        <td>

        ${c.product || "-"}

        </td>



        <td>

        ${action}

        </td>



        </tr>


        `;



      }



    });



  });



}
