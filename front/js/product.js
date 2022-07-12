// appel du back end
fetch("http://localhost:3000/api/products", {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

}).then((response) => {
  return response.json()

}).then((promise) => {
  products = promise;

// recuperation de l'id pour afficher les données du produit
const queryString_url_id = window.location.search;

const urlSearchParams = new URLSearchParams(queryString_url_id);

const id = urlSearchParams.get("id");
console.log(id);

// recuperer les donnees a partir de l'id dans l'url
const idProductSelect = products.find((element) => element._id === id);
console.log(idProductSelect);

// titre dynamique avec le produit selectionné
document.title = `${idProductSelect.name}`;

const positionElements = document.querySelector(".item");

// insertion du produit selectionné sur la page index
const structureProducts = `
<article>
<div class="item__img">
  <img src="${idProductSelect.imageUrl}" alt="${idProductSelect.altText}">
</div>
<div class="item__content">

  <div class="item__content__titlePrice">
    <h1 id="title">${idProductSelect.name}</h1>
    <p>Prix : <span id="price">${idProductSelect.price}</span>€</p>
  </div>

  <div class="item__content__description">
    <p class="item__content__description__title">Description :</p>
    <p id="description">${idProductSelect.description}</p>
  </div>

  <div class="item__content__settings">
    <div class="item__content__settings__color">
      <label for="color_select">Choisir une couleur :</label>
      <select name="color-select" id="colors">
          <option value="">--SVP, choisissez une couleur --</option>

      </select>
    </div>

    <div class="item__content__settings__quantity">
      <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
      <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity" onKeyUp="if (this.value > 100) {this.value = '100';} else if (this.value < 0) {this.value = '0';}">
    </div>
  </div>

  <div class="item__content__addButton">
    <button id="addToCart" type="submit" name="addToCart">Ajouter au panier</button>
  </div>

</div>
</article>
`
    ;
//le formulaire s"adapte au nombre d'option qu'il y a dans l'objet du produit
const optionQuantite = idProductSelect.colors;
let structureOptions = [];

//la boucle for pour afficher toutes les options du produit
for (let j = 0; j < optionQuantite.length; j++) {
    structureOptions =
      structureOptions +
      `<option value="${optionQuantite[j]}">${optionQuantite[j]}</option>`;
}

//injection html dans la page produit
positionElements.innerHTML = structureProducts;

//injection html dans la page produit pour le choix des options dans le formulaire
const positionElements1 = document.querySelector("#colors");

positionElements1.innerHTML = `<option value="">--SVP, choisissez une couleur --</option>` + structureOptions;

  //---------------- Gestion du panier ----------------
  //récupération des données sélectionnées par l'utilisateur et  envoie du panier

  //sélection de l'id couleur du formulaire
  const idForm = document.querySelector("#colors");
  //sélection du nombre quantity du formulaire
  const idNombre = document.querySelector("#quantity");

  //bloquer les caracteres speciaux dans input number
  var inputBox = document.getElementById("quantity");
  var invalidChars = [
    "-",
    "+",
    "e",
    ".",
  ];
  inputBox.addEventListener("keydown", function (e) {
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  });

  //empecher de commencer par un 0 pour la quantité
  var input = document.getElementById('quantity');
  var onchange = function () {
    input.value = ~~input.value;
  };
  input.addEventListener('keyup', onchange, false);
  input.addEventListener('paste', onchange, false);

  //sélection du bouton "ajouter au panier"
  const btn_envoyerPanier = document.querySelector("#addToCart");

  //ecouter le bouton et envoyer au panier
  btn_envoyerPanier.addEventListener("click", (event) => {
    event.preventDefault();

    //mettre choix COULEUR de l'utilisateur dans une variable
    var choixForm = idForm.value;

    //mettre choix NOMBRE de l'utilisateur dans une variable
    var choixNombre = idNombre.value;

    //message d'alert validation panier
    if (
      // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
      choixForm === "" ||
      choixForm === undefined ||
      choixNombre < 1 ||
      choixNombre > 100 ||
      choixNombre === undefined
    ) {
      // joue l'alerte
      alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
    } else {
      //récupération des valeurs du formulaire
      let optionsProduit = {
        id: idProductSelect._id,
        quantity: choixNombre,
        color: choixForm,
      }

      var selectProduit = optionsProduit;

      //déclaration de la variable dans laquelle on mets les key et les values en storage
      let produitStorage = JSON.parse(localStorage.getItem("produit"));
      //--JSON.parse conversion du format JSON dans le storage ne JavaScript

      //si il y a deja des produits -> ajouter
      if (produitStorage) {

        const resultFind = produitStorage.find(
          (el) => el.id === idProductSelect._id && el.color === choixForm);
        //Si le produit commandé est déjà dans le panier, cela les additionne
        if (resultFind) {
          let newQuantite =
            parseInt(optionsProduit.quantity) + parseInt(resultFind.quantity);
          resultFind.quantity = newQuantite;

          // fonction qui permet 
          function limitQuantity() {
            //si la quantité est entre 0 et 100
            if (newQuantite >= 1, newQuantite <= 100) {
              localStorage.setItem("produit", JSON.stringify(produitStorage));
              alert("Produit ajouté !");
              //si la quantité est supérieur a 100
            } else if (newQuantite > 100) {
              //quantité dans le panier
              let produitQuantity = parseInt(resultFind.quantity) - parseInt(optionsProduit.quantity);

              // quantité encore disponible
              let lastQuantity = 100 - produitQuantity;
              result = `la quantité est limitée a 100 ! ${produitQuantity} produit sont dèja présent dans votre panier.\n${lastQuantity} produit sont encore disponible !`;
              alert(result);
            }
          }
          limitQuantity();

          //Si le produit commandé n'est pas dans le panier
        } else {
          produitStorage.push(optionsProduit);
          localStorage.setItem("produit", JSON.stringify(produitStorage));
          alert("Produit ajouté !");
        }

        //si il n'y en a pas -> creer un tableau et ajouter
      } else {
        produitStorage = [];
        produitStorage.push(optionsProduit);
        localStorage.setItem("produit", JSON.stringify(produitStorage));
        console.log(produitStorage);
        alert("Produit ajouté !");
      }
    }
  });

}).catch((error) => {
  console.log(error)
});

