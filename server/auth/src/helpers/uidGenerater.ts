import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = (): string => {
    return uuidv4().replace(/-/g, '').slice(0, 12);
};

export default generateUniqueId;
