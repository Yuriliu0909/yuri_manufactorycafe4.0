const checkouttable = document.getElementById('checkout-table');

postData('/yuricafe/services/service-main.php',{req:'checkout'} ).then((response)=>{
  response.forEach((res)=>{
    console.log(res['order_id'] + ' '+ res['price']+' '+ res['quantity']);
  });
  updateMenuUI(contents);
});

function updateMenuUI(contents) {
  checkouttable.innerHTML = contents;
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



