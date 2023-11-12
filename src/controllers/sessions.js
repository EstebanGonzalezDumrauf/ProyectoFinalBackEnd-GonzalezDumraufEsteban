import { add_User, delete_User, getAllUser, get_User, get_User_By_Id, reset_Pass, update_User, delete_Users } from "../dao/mongo/sessions.js";

const sessions = [];

export const getSession = async (req, res) => {
    const users = await getAllUser();
    res.json(users);
};

export const setSession = async (req, res) => {
    const newSession = req.body;
    if (!newSession) {
        return res.status(400).json({error: "Se produjo un error al registrar la session"})
    }

    const result = await addUser(newSession);
    res.json(result);
}

export const getUser = async (email) => {
    const usuarioExist = email;
    const result = await get_User(usuarioExist);

    if (!result) {
        return null;
    }
    return result;
};

export const getUserById = async (_id) => {
    const result = await get_User_By_Id(_id);
    if (!result) {
        return null;
    }
    return result;
};

export const addUser = async (user, res) => {
    const result = await add_User(user);
    if (!result) {
        return res.status(400).json({error: "No se pudo agregar el usuario"})
    }
    return result;
};

export const resetPassword = async (email, password, res) => {
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Datos incompletos" });
    }
    const result = await reset_Pass(email, password);
    return result;
};

export const logout = async (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy((err) => { // Destruye la sesión
            if (err) {
                console.error('Error al cerrar la sesión:', err);
                return res.status(500).send({
                    error: 'Error al cerrar la sesión'
                });
            } else {
                // La sesión se ha destruido con éxito
                res.status(200).send({
                    message: 'Sesión cerrada exitosamente'
                });
            }
        });
    } else {
        res.status(200).send({
            message: 'No hay sesión para cerrar'
        });
    }
};


export const deleteUser = async (_id, res) => {
    const result = await delete_User(_id);
    if (!result) {
        return false
    }
    return true;
};

export const deleteInactiveUsers = async () => {
    const deletedCount = await delete_Users();
    return deletedCount;
};

export const updateUser = async (user, res) => {
    const result = await update_User(user);
    if (!result) {
        return false
    }
    return true;
};