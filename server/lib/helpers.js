import crypto from 'crypto'

const generateNewId = (digits) => crypto.randomBytes(digits).toString('hex')

export { generateNewId }