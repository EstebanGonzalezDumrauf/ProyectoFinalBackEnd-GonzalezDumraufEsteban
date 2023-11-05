export const generateCreateUserErrorInfo = (user) => {
    return `Una de las propiedas del usuario es incompleta o no valida
    Lista de propiedades:
    * first_name : Se necesita un string, se recibido ${user.first_name}
    * last_name : Se necesita un string, se recibido ${user.last_name}
    * email : Se necesita un string, se recibido ${user.email}`
}

export const generateGetUserErrorInfo = (uid) => {
    return `Se envio un parametro invalido para obtener el usuario,
    Se necesita un id de tipo number que se mayor a 0, se recibido ${uid}`
}

export const generatePaginateErrorInfo = (pagine) => {
    return `Una de las propiedades no es válida
    Lista de Propiedades:
    * limit : debe ser un número y mayor que cero, se recibió ${pagine.limit}
    * page : debe ser un número y mayor que cero, se recibió ${pagine.page}`
}

export const generateProductErrorInfo = (product) => {
    return `Una de las propiedades del producto no es válida
    Lista de Propiedades:
    * title : debe ser un String, se recibió ${product.title}
    * description : debe ser un String, se recibió ${product.description}
    * price : debe ser un number, se recibió ${product.price}
    * category : debe ser un string del tipo perfumeria o cuidados, se recibió ${product.category}
    * status : debe ser un boolean, se recibió ${product.status}
    * thumbnail : debe ser un string, se recibió ${product.thumbnail}
    * code : debe ser un string, se recibió ${product.code}
    * stock : debe ser un número, se recibió ${product.stock}`
}