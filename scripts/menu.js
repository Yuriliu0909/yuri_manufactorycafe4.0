const productsView = document.getElementById('products-view');

postData('/yuricafe/services/service-main.php','/yuricafe/services/service-pastry.php',{req:'menu'} ).then( async (response)=>{
    let contents = '';
    console.log(response);
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
            '                                <h5 class="fw-bolder" >'+res['name']+'</script></h5>'+res['price'] +'\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                        <!-- Product actions-->\n' +
            '                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">\n' +
            '                            <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">View options</a></div>\n' +
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

async function postData(url1,url2,data) {
    // Promise.all([promise1, promise2, promise3]).then((values)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const promise1 = fetch(url1,options).then(
        function (response){
            return response.json();
        }
    )
    const promise2 = fetch(url2,options).then(
        function (response){
            return response.json();
        }
    )
    const result = await Promise.all([promise1, promise2]).then((values) => {
        console.log([...values[0],...values[1]]);
        return [...values[0],...values[1]];
    });
    return result;
}

