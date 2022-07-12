//chargement de l'api
fetch("http://localhost:3000/api/products", {
    method: "GET",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

}).then((response) => {
    return response.json()

}).then((promise) => {
    productsData = promise;
    console.log(productsData);

    //generation de chaque produit via l'api avec l'html 
    const productsDisplay = document.getElementById("items").innerHTML = productsData.map((products) => `
    <a href="./product.html?id=${products._id}">
        <article>
            <img src="${products.imageUrl}" alt="${products.altTxt}"/>
            <h3 class="productName">${products.name.toUpperCase()}</h3>
            <p class="productDescription">${products.description}</p>
        </article>
    </a>
    `
    ).join(""); //suppression de la virgule sur le .js

}).catch((error) => {
    console.log(error)
})