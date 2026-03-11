exports.getProfile = (req, res) => {
    res.json({
        message: "User profile fetched successfully",
        user: req.user || null
    });
};