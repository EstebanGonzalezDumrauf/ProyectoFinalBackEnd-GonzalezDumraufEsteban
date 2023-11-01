export default class ProductDTO {
    constructor(product) {
        this.title = product.title,
        this.description = product.description,
        this.price = product.price,
        this.category = product.category,
        this.status = product.status,
        this.thumbnail = product.thumbnail,
        this.code = product.code,
        this.stock = product.stock;
        //this.telefono = contact.telefono ? contact.telefono.split('-').join('') : '';
    }
}