let token =
  'EAAFoRekYynQBO65zizMQIsff6A1DZCNeaR59mk9sbMXOm9S4hsqoyREdbSQPTig2Im0vcEo2Drh7boyMPsbZAY9tjV5kpxC660V9VgAgwWhc4H5bN6anU7pssxVPJWEaGeRqKuUr5HZCyKUxW15dU825EFbOZCoD8hsnmDcMPjVhT456QsPW8O0rGYYZBYUpK9eavLHgaEac9MDoSQtsZD';
let telefonoId = '230662260122064';
let telefono = '541161204047';

export async function whatsaapApi() {
  var url = 'https://graph.facebook.com/v15.0/' + telefonoId + '/messages';
  var mensaje = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'template',
    template: {
      name: 'mensajeria',
      language: {code: 'es_ARG'},
    },
  };

  var peticion = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mensaje),
    json: true,
  };

  fetch(url, peticion)
    .then((mensaje) => {
      return mensaje.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
}
