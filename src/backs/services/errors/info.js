export const generateUserErrorInfo = (user) => {
    return `Una de las propiedades es incompleta o no válida
    Lista de Propiedades:
    * first_name : debe ser un String, se recibió ${user.first_name}
    * last_name : debe ser un String, se recibió ${user.last_name}
    * email : debe ser un String, se recibió ${user.email}`
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

export const generateCartErrorInfo = (cart) => {
    
}