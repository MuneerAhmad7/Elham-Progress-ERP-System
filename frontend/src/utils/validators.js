/**
 * Form Validation Utilities
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate phone number (Saudi Arabia format)
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} True if valid
 */
export const isValidSaudiPhone = (phone) => {
  // Supports formats: +966501234567, 966501234567, 0501234567
  const regex = /^(\+?966|0)?5\d{8}$/
  return regex.test(phone.replace(/\s+/g, ''))
}

/**
 * Validate Iqama number (10 digits starting with 1 or 2)
 * @param {String} iqama - Iqama number to validate
 * @returns {Boolean} True if valid
 */
export const isValidIqama = (iqama) => {
  const regex = /^[12]\d{9}$/
  return regex.test(iqama)
}

/**
 * Validate Saudi National ID (10 digits starting with 1)
 * @param {String} nationalId - National ID to validate
 * @returns {Boolean} True if valid
 */
export const isValidNationalId = (nationalId) => {
  const regex = /^1\d{9}$/
  return regex.test(nationalId)
}

/**
 * Validate VAT number (15 digits)
 * @param {String} vat - VAT number to validate
 * @returns {Boolean} True if valid
 */
export const isValidVatNumber = (vat) => {
  const regex = /^\d{15}$/
  return regex.test(vat)
}

/**
 * Validate Commercial Registration number
 * @param {String} cr - CR number to validate
 * @returns {Boolean} True if valid
 */
export const isValidCRNumber = (cr) => {
  const regex = /^\d{10}$/
  return regex.test(cr)
}

/**
 * Validate IBAN (Saudi Arabia format)
 * @param {String} iban - IBAN to validate
 * @returns {Boolean} True if valid
 */
export const isValidIBAN = (iban) => {
  // Saudi IBAN: SA followed by 22 digits
  const regex = /^SA\d{22}$/i
  return regex.test(iban.replace(/\s+/g, ''))
}

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with strength level
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
  
  let strength = 0
  if (password.length >= minLength) strength++
  if (hasUpperCase) strength++
  if (hasLowerCase) strength++
  if (hasNumbers) strength++
  if (hasSpecialChar) strength++
  
  return {
    isValid,
    strength,
    strengthLabel: strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong',
    errors: {
      minLength: password.length < minLength,
      hasUpperCase: !hasUpperCase,
      hasLowerCase: !hasLowerCase,
      hasNumbers: !hasNumbers
    }
  }
}

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @returns {Boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate minimum length
 * @param {String} value - String to validate
 * @param {Number} min - Minimum length
 * @returns {Boolean} True if valid
 */
export const minLength = (value, min) => {
  return value && value.length >= min
}

/**
 * Validate maximum length
 * @param {String} value - String to validate
 * @param {Number} max - Maximum length
 * @returns {Boolean} True if valid
 */
export const maxLength = (value, max) => {
  return value && value.length <= max
}

/**
 * Validate numeric value
 * @param {*} value - Value to validate
 * @returns {Boolean} True if numeric
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Validate positive number
 * @param {*} value - Value to validate
 * @returns {Boolean} True if positive number
 */
export const isPositive = (value) => {
  return isNumeric(value) && parseFloat(value) > 0
}

/**
 * Validate number range
 * @param {Number} value - Value to validate
 * @param {Number} min - Minimum value
 * @param {Number} max - Maximum value
 * @returns {Boolean} True if in range
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value)
  return isNumeric(value) && num >= min && num <= max
}

/**
 * Validate URL format
 * @param {String} url - URL to validate
 * @returns {Boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {String} date - Date string to validate
 * @returns {Boolean} True if valid
 */
export const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(date)) return false
  
  const parsed = new Date(date)
  return parsed instanceof Date && !isNaN(parsed)
}

/**
 * Validate date is not in the past
 * @param {String|Date} date - Date to validate
 * @returns {Boolean} True if future date
 */
export const isFutureDate = (date) => {
  const parsed = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsed >= today
}

/**
 * Validate date is not in the future
 * @param {String|Date} date - Date to validate
 * @returns {Boolean} True if past date
 */
export const isPastDate = (date) => {
  const parsed = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsed <= today
}

/**
 * Validate date range
 * @param {String|Date} startDate - Start date
 * @param {String|Date} endDate - End date
 * @returns {Boolean} True if end date is after start date
 */
export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end >= start
}

/**
 * Validate JSON string
 * @param {String} str - String to validate
 * @returns {Boolean} True if valid JSON
 */
export const isValidJson = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Sanitize HTML string
 * @param {String} html - HTML string to sanitize
 * @returns {String} Sanitized string
 */
export const sanitizeHtml = (html) => {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}

/**
 * Validate file extension
 * @param {String} filename - File name
 * @param {Array} allowedExtensions - Array of allowed extensions
 * @returns {Boolean} True if valid extension
 */
export const isValidFileExtension = (filename, allowedExtensions) => {
  const extension = filename.split('.').pop().toLowerCase()
  return allowedExtensions.includes(extension)
}

/**
 * Validate file size
 * @param {Number} size - File size in bytes
 * @param {Number} maxSize - Maximum size in bytes
 * @returns {Boolean} True if within size limit
 */
export const isValidFileSize = (size, maxSize) => {
  return size <= maxSize
}

/**
 * Validation rules for common fields
 */
export const VALIDATION_RULES = {
  email: [
    { validator: isRequired, message: 'Email is required' },
    { validator: isValidEmail, message: 'Invalid email format' }
  ],
  
  phone: [
    { validator: isRequired, message: 'Phone number is required' },
    { validator: isValidSaudiPhone, message: 'Invalid Saudi phone number' }
  ],
  
  iqama: [
    { validator: isRequired, message: 'Iqama number is required' },
    { validator: isValidIqama, message: 'Invalid Iqama number' }
  ],
  
  vat: [
    { validator: isValidVatNumber, message: 'Invalid VAT number' }
  ],
  
  iban: [
    { validator: isValidIBAN, message: 'Invalid IBAN format' }
  ],
  
  password: [
    { validator: isRequired, message: 'Password is required' },
    { validator: (val) => minLength(val, 8), message: 'Password must be at least 8 characters' },
    { validator: (val) => validatePassword(val).isValid, message: 'Password must contain uppercase, lowercase, and numbers' }
  ]
}

export default {
  isValidEmail,
  isValidSaudiPhone,
  isValidIqama,
  isValidNationalId,
  isValidVatNumber,
  isValidCRNumber,
  isValidIBAN,
  validatePassword,
  isRequired,
  minLength,
  maxLength,
  isNumeric,
  isPositive,
  isInRange,
  isValidUrl,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidDateRange,
  isValidJson,
  sanitizeHtml,
  isValidFileExtension,
  isValidFileSize,
  VALIDATION_RULES
}