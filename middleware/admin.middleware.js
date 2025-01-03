const isAdminUser = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Only admin is allowed'
    });
  }
  next();
};

module.exports = { isAdminUser };
