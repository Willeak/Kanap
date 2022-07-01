let productsData = [];

fetch("http://localhost:3000/api/products", {
	method: "GET",
	headers: { 
'Accept': 'application/json', 
'Content-Type': 'application/json' 
},
	
}) .then((response)=> {
    return response.json()

}) .then((promise)=> {
    productsData = promise;
    console.log(productsData);

    const productsDisplay = document.getElementById("items").innerHTML = productsData.map((products) => `
    <a href="./product.html?id=${products._id}">
        <article>
            <img src="${products.imageUrl}" alt="${products.altTxt}"/>
            <h3 class="productName">${products.name.toUpperCase()}</h3>
            <p class="productDescription">${products.description}</p>
        </article>
    </a>
    `
    ) .join(""); //suppression de la virgule

    console.log(productsDisplay)

}) .catch((error)=> {
    console.log(error)
})

