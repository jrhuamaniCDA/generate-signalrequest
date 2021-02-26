const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SECRET_KEY = ''; //TODO: Completar secret para SH256
const request577 = require("./json/request.json") //TODO: Agregar el contenido del request correcto en ./json/request.json

const getBase64To = objectModel => {
  var b64string = JSON.stringify(objectModel);/* whatever */
  return Buffer.from(b64string, 'utf-8').toString('base64');
}

const getToken = base64 => {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', SECRET_KEY)
    .update(base64)
    .digest('base64');
  return hash;
}

const saveToClipBoard = (signedRequest) => {
  const clipboardy = require('clipboardy');
  clipboardy.writeSync(signedRequest);
}

app.get("/SignedRequest", function (req, res) {
  const response = {
    httpcode: '0',
    content: ''
  }

  try {
    const base64 = getBase64To(request577);
    const hash = getToken(base64);
    const signedRequest = `${hash}.${base64}`;

    saveToClipBoard(signedRequest);

    res.header("Content-Type", "application/json");

    response.httpcode = '200';
    response.content = signedRequest

    res.send(response).status(200);
  }
  catch (err) {
    response.httpcode = '500';
    console.log(err)
    response = { ...response, content: err }
    res.send(response).status(500);
  }
});

app.get("/", function (req, res) {
  respuesta = {
    error: true,
    codigo: 200,
    mensaje: "Punto de inicio",
  };
  res.send(respuesta);
});

app.use(function (req, res, next) {
  respuesta = {
    error: true,
    codigo: 404,
    mensaje: "URL no encontrada",
  };
  res.status(404).send(respuesta);
});

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});
