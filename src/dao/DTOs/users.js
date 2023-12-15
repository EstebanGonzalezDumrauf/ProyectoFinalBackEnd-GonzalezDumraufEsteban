export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.email,
        this.age = user.age,
        //this.password = user.password,
        this.cart = user.cart,
        this.rol = user.rol,
        this.documents = user.documents;
        //this.telefono = contact.telefono ? contact.telefono.split('-').join('') : '';
    }
}
