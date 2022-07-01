/* ---------------- PANIER ---------------- */

//déclaration de la variable dans laquelle on mets les key et les values en storage
let produitStorage = JSON.parse(localStorage.getItem("produit"));

// Variable pour stocker les Id de chaque articles présent dans le panier (utilisés pour créer la commande)
let products = [];

// Variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Affichage du contenu du panier
async function displayCart() {
  const parser = new DOMParser();
  const positionEmptyCart = document.getElementById("cart__items");
  let cartArray = [];

  //si le panier est vide : afficher le panier est vide 
  if (produitStorage === null || produitStorage === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
  }

  //si le panier n'est pas vide
  for (k = 0; k < produitStorage.length; k++) {
    const product = await getProductById(produitStorage[k].id);
    const totalPriceItem = (product.price *= produitStorage[k].quantity);
    cartArray += `<article class="cart__item" data-id="${produitStorage[k].id}" data-color="${produitStorage[k].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${produitStorage[k].color}</p>
                          <p>Prix unitaire: ${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${produitStorage[k].id} data-color= ${produitStorage[k].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${produitStorage[k].quantity}>
                            </p>
                            <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p data-id= ${produitStorage[k].id} data-color= ${produitStorage[k].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
  }
  // Boucle qui permet d'afficher le nombre total d'articles dans le panier et de la somme totale
  let totalQuantity = 0;
  let totalPrice = 0;

  for (k = 0; k < produitStorage.length; k++) {
    const article = await getProductById(produitStorage[k].id);
    totalQuantity += parseInt(produitStorage[k].quantity);
    totalPrice += parseInt(article.price * produitStorage[k].quantity);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (k == produitStorage.length) {
    const displayBasket = parser.parseFromString(cartArray, "text/html");
    positionEmptyCart.appendChild(displayBasket.body);
    changeQuantity();
    deleteItem();
  }
}

// Récupération des produits de l'API dans le back end
async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      // Erreur serveur
      console.log("erreur");
    })
    .then(function (response) {
      return response;
    });
}
displayCart();

// Modification de la quantité
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("produit");
      let items = JSON.parse(cart);

      items = items.map((item, index) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });
      // Mise à jour du localStorage
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("produit", itemsStr);
      // Refresh de la page Panier
      location.reload();
    });
  });
}

// Suppression d'un article
function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
      produitStorage = produitStorage.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );
      console.log(produitStorage);
      // Mise à jour du localStorage
      localStorage.setItem("produit", JSON.stringify(produitStorage));
      // Refresh de la page Panier
      location.reload();
      alert("Article supprimé du panier.");
    });
  });
}

/* ---------------- LE FORMULAIRE ---------------- */

// sélection du bouton Valider
const btnValidate = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir valider le formulaire
btnValidate.addEventListener("click", (event) => {
  event.preventDefault();

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  console.log(contact);

  /* GESTION DU FORMULAIRE */

  // #1 #2 Regex pour le contrôle des champs Prénom, Nom et Ville
  const regExPrenomNom = (value) => {
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
  };

  // #3 Regex pour le contrôle du champ Adresse
  const regExAdresse = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // #4 Regex pour le contrôle du champs Ville
    const regExVille = (value) => {
      return /^([0-9]{5}) [a-zA-Z- ]{3,50}$/.test(value);
    };

  // #5 Regex pour le contrôle du champ Email
  const regExEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)+.[a-z]{2,4}$/.test(value);
  };

  // #1 Fonctions de contrôle du champ Prénom:
  function firstNameControl() {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExPrenomNom(prenom)) {
      inputFirstName.style.border = "2px solid green";

      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.border = "2px solid #FF6F61";

      document.querySelector("#firstNameErrorMsg").textContent =
        "Prénom invalide, ex: Marc";
      return false;
    }
  }

  // #2 Fonctions de contrôle du champ Nom:
  function lastNameControl() {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExPrenomNom(nom)) {
      inputLastName.style.border = "2px solid green";

      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.border = "2px solid #FF6F61";

      document.querySelector("#lastNameErrorMsg").textContent =
        "Nom invalide, ex: Dupont";
      return false;
    }
  }

  // #3 Fonctions de contrôle du champ Adresse:
  function addressControl() {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse(adresse)) {
      inputAddress.style.border = "2px solid green";

      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.border = "2px solid #FF6F61";

      document.querySelector("#addressErrorMsg").textContent =
        "Adresse invalide, ex: 42 rue de la monnaie";
      return false;
    }
  }

  // #4 Fonctions de contrôle du champ Ville:
  function cityControl() {
    const ville = contact.city;
    let inputCity = document.querySelector("#city");
    if (regExVille(ville)) {
      inputCity.style.border = "2px solid green";

      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.border = "2px solid #FF6F61";

      document.querySelector("#cityErrorMsg").textContent =
        "Ville invalide, ex: 62400 Bethune";
      return false;
    }
  }

  // #5 Fonctions de contrôle du champ Email:
  function mailControl() {
    const courriel = contact.email;
    let inputMail = document.querySelector("#email");
    if (regExEmail(courriel)) {
      inputMail.style.border = "2px solid green";

      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.border = "2px solid #FF6F61";

      document.querySelector("#emailErrorMsg").textContent =
        "Email invalide, ex: example@contact.fr";
      return false;
    }
  }

  // Contrôle validité formulaire avant de l'envoyer dans le local storage
  if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
  ) {
    // Enregistrer le formulaire dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));

    document.querySelector("#order").value =
      "Formulaire valide\n Valider votre commande !";
    sendToServer();
  } else {
    error("Formulaire invalide, Veuillez ");
  }

  
  /* FIN GESTION DU FORMULAIRE */

  /* REQUÊTE DU SERVEUR ET POST DES DONNÉES */
  function sendToServer() {
    const sendToServer = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Récupération et stockage de la réponse de l'API (orderId)
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
      });

    // Si l'orderId a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
    if (orderId != "") {
      location.href = "confirmation.html?id=" + orderId;
    }
  }
});

/* FIN REQUÊTE DU SERVEUR ET POST DES DONNÉES */

// Maintenir le contenu du localStorage dans le champs du formulaire

let dataFormulaire = JSON.parse(localStorage.getItem("contact"));

console.log(dataFormulaire);
if (dataFormulaire) {
  document.querySelector("#firstName").value = dataFormulaire.firstName;
  document.querySelector("#lastName").value = dataFormulaire.lastName;
  document.querySelector("#address").value = dataFormulaire.address;
  document.querySelector("#city").value = dataFormulaire.city;
  document.querySelector("#email").value = dataFormulaire.email;
} else {
  console.log("Le formulaire est vide");
}