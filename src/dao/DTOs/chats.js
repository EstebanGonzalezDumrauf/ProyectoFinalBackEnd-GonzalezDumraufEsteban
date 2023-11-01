export default class ChatDTO {
    constructor(chat) {
        this.user = chat.user,
        this.message = chat.message;
        //this.telefono = contact.telefono ? contact.telefono.split('-').join('') : '';
    }
}