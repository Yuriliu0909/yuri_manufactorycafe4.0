const productsView = document.getElementById('products-view');

postData('/yuricafe/services/service-main.php',{req:'pastry_menu'} ).then((response)=>{
    let contents = '';
    response.forEach((res)=>{
        contents += '<div class="col mb-5">\n' +
            '                    <div class="card h-100">\n' +
            '                        <!-- Product image-->\n' +
            '                            <img class="card-img-top" alt="..." src='+res['images']+'>\n' +
            '                               \n' +
            '                                </script>\n' +
            '                            </img>\n' +
            '                        <!-- Product details-->\n' +
            '                        <div class="card-body p-4">\n' +
            '                            <div class="text-center" >\n' +
            '                                <!-- Product name-->\n' +
            '                                <h5 class="fw-bolder" >'+res['name']+'</script></h5>Price:$'+res['price'] +'\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                        <!-- Product actions-->\n' +
            '                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">\n' +
            '                            <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to Cart</a></div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>';
        console.log(res['name'] + ' '+ res['price']+' '+ res['images']);
    });
    updateMenuUI(contents);
});

function updateMenuUI(contents) {
    productsView.innerHTML = contents;
}

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function addItemToCart(productID,Price) {
    console.log('clicked');
    let order = {req:'order',item_id:productID,price:Price};
    postData('/yuricafe/services/service-main.php', order).then((response)=>{
        console.log(response);
    });
}