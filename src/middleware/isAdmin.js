
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const isAdmin = (req, res, next) => {
    console.log(req.user.admin)
    if (req.user && req.user.userAdmin === true) {
        next();
    } else {
        res.status(403).json({ message: "Accès refusé. Vous devez être administrateur pour effectuer cette action." });
    }
};
