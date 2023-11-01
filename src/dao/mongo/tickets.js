import { ticketModel } from '../../models/ticket.js';

export const getAllTickets = async () => {
    return await ticketModel.find();
};

export const add_Ticket = async (newTicket) => {
    const ticket = ticketModel.create(newTicket);
    return ticket;
};