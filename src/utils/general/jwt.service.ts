import jwt  from 'jsonwebtoken';
import { ENV } from '../../envirolment/envirolment';

export function CreateJWT(data) {
    return jwt.sign(data, ENV.APP_SECRET, { expiresIn: 60 * 60 })
}

export function VerifyJWT(token) {
    const result = {
        success: 0,
        data: {}
    };
    try {
        result.data = jwt.verify(token, ENV.APP_SECRET)
    } catch (error) {
        console.error('Invalid token')
    }

    return result;
}