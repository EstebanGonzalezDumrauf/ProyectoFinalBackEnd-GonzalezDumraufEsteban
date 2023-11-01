import { getAllTickets, add_Ticket } from "../dao/mongo/tickets.js";

export const getTickets = async (req, res) => {
    const tickets = await getAllTickets();
    res.json(tickets);
};

export const addTicket = async (newTicket) => {
    const ticket = await add_Ticket(newTicket);
    return ticket
};