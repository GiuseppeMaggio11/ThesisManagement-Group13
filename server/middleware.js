const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ error: "Not authenticated" });
};

const isProfessor = (req, res, next) => {
    if (req.isAuthenticated() && req.user.user_type === "PROF") return next();
    return res.status(401).json({ error: "Not professor" });
};

const isStudent = (req, res, next) => {
    if (req.isAuthenticated() && req.user.user_type === "STUD") return next();
    return res.status(401).json({ error: "Not student" });
};

export { isLoggedIn, isProfessor, isStudent };