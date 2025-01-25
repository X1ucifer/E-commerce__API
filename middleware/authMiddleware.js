const jwt = require('jsonwebtoken');

// module.exports = (roles = []) => {
//     return (req, res, next) => {
//         const token = req.headers['authorization'];
//         if (!token) return res.status(401).send('Access denied');

//         try {
//             const decoded = jwt.verify(token, 'SECRET_KEY');
//             req.user = decoded;
//             if (roles.length && !roles.includes(req.user.role)) {
//                 return res.status(403).send('Access denied');
//             }
//             next();
//         } catch (err) {
//             res.status(400).send('Invalid token');
//         }
//     };
// };

exports.verifyAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log(decoded.id);
        if (decoded.role !== 1) {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

exports.verifyStaff = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log(decoded.id);
        
        if (decoded.role !== 2) {
            return res.status(403).json({ message: 'Access denied. Staff role required.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

exports.verifyVendor = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log("role", decoded.role);
        
        if (decoded.role !== 3) {
            return res.status(403).json({ message: 'Access denied. vendor role required.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

exports.verifyUserRole = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        console.log("role", decoded.role);
        
        if (decoded.role !== 4) {
            return res.status(403).json({ message: 'Access denied. user role required.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

