
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.admin === true) {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé. Vous devez être administrateur pour effectuer cette action." });
    }
};
