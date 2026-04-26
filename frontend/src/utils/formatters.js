/**
 * Data Formatting Utilities
 */

import { format, parseISO } from 'date-fns'
import { formatHijriDate } from './hijri'

/**
 * Format currency (Saudi Riyal)
 * @param {Number} amount - Amount to format
 * @param {String} locale - Locale ('en' or 'ar')
 * @returns {String} Formatted currency
 */
export const formatCurrency = (amount, locale = 'en') => {
  if (amount === null || amount === undefined) return '-'
  
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format number with thousands separator
 * @param {Number} number - Number to format
 * @param {String} locale - Locale ('en' or 'ar')
 * @param {Number} decimals - Number of decimal places
 * @returns {String} Formatted number
 */
export const formatNumber = (number, locale = 'en', decimals = 0) => {
  if (number === null || number === undefined) return '-'
  
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number)
}

/**
 * Format percentage
 * @param {Number} value - Value to format (0-100)
 * @param {Number} decimals - Number of decimal places
 * @returns {String} Formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-'
  
  return `${formatNumber(value, 'en', decimals)}%`
}

/**
 * Format date
 * @param {Date|String} date - Date to format
 * @param {String} formatString - Format string (default: 'MMM dd, yyyy')
 * @returns {String} Formatted date
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '-'
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format time
 * @param {Date|String} date - Date/time to format
 * @param {String} formatString - Format string (default: 'HH:mm')
 * @returns {String} Formatted time
 */
export const formatTime = (date, formatString = 'HH:mm') => {
  if (!date) return '-'
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatString)
  } catch (error) {
    console.error('Error formatting time:', error)
    return '-'
  }
}

/**
 * Format datetime
 * @param {Date|String} date - DateTime to format
 * @returns {String} Formatted datetime
 */
export const formatDateTime = (date) => {
  if (!date) return '-'
  
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * Format dual date (Gregorian and Hijri)
 * @param {Date|String} date - Date to format
 * @param {String} locale - Locale ('en' or 'ar')
 * @returns {String} Formatted dual date
 */
export const formatDualDate = (date, locale = 'en') => {
  if (!date) return '-'
  
  const gregorian = formatDate(date)
  const hijri = formatHijriDate(date, locale)
  
  return `${gregorian} (${hijri})`
}

/**
 * Format phone number (Saudi format)
 * @param {String} phone - Phone number to format
 * @returns {String} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '-'
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as: +966 50 123 4567
  if (cleaned.startsWith('966')) {
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{4})$/)
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
  }
  
  // Format local number: 050 123 4567
  if (cleaned.startsWith('0')) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`
    }
  }
  
  return phone
}

/**
 * Format IBAN
 * @param {String} iban - IBAN to format
 * @returns {String} Formatted IBAN
 */
export const formatIBAN = (iban) => {
  if (!iban) return '-'
  
  // Remove spaces
  const cleaned = iban.replace(/\s/g, '')
  
  // Format as: SA00 0000 0000 0000 0000 0000
  return cleaned.match(/.{1,4}/g)?.join(' ') || iban
}

/**
 * Format file size
 * @param {Number} bytes - File size in bytes
 * @returns {String} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Truncate text
 * @param {String} text - Text to truncate
 * @param {Number} length - Maximum length
 * @param {String} suffix - Suffix to add (default: '...')
 * @returns {String} Truncated text
 */
export const truncate = (text, length = 50, suffix = '...') => {
  if (!text) return ''
  if (text.length <= length) return text
  
  return text.substring(0, length) + suffix
}

/**
 * Capitalize first letter
 * @param {String} text - Text to capitalize
 * @returns {String} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert to title case
 * @param {String} text - Text to convert
 * @returns {String} Title cased text
 */
export const toTitleCase = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Format address
 * @param {Object} address - Address object
 * @returns {String} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '-'
  
  const parts = []
  
  if (address.street) parts.push(address.street)
  if (address.district) parts.push(address.district)
  if (address.city) parts.push(address.city)
  if (address.postal_code) parts.push(address.postal_code)
  if (address.country) parts.push(address.country)
  
  return parts.join(', ')
}

/**
 * Format name (Arabic/English)
 * @param {Object} name - Name object with first, middle, last
 * @returns {String} Full name
 */
export const formatName = (name) => {
  if (!name) return '-'
  
  if (typeof name === 'string') return name
  
  const parts = []
  
  if (name.first_name) parts.push(name.first_name)
  if (name.middle_name) parts.push(name.middle_name)
  if (name.last_name) parts.push(name.last_name)
  
  return parts.join(' ')
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|String} date - Date to format
 * @returns {String} Relative time
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-'
  
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Format duration (in minutes to human readable)
 * @param {Number} minutes - Duration in minutes
 * @returns {String} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '-'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} hr`
  
  return `${hours} hr ${mins} min`
}

/**
 * Format status badge class
 * @param {String} status - Status value
 * @returns {String} CSS class for badge
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    // Common statuses
    active: 'badge-success',
    inactive: 'badge-danger',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    draft: 'badge-info',
    
    // HR statuses
    present: 'badge-success',
    absent: 'badge-danger',
    late: 'badge-warning',
    on_leave: 'badge-info',
    
    // Finance statuses
    posted: 'badge-success',
    paid: 'badge-success',
    unpaid: 'badge-warning',
    overdue: 'badge-danger',
    
    // Project statuses
    planning: 'badge-info',
    in_progress: 'badge-warning',
    completed: 'badge-success',
    on_hold: 'badge-danger',
    
    // Task statuses
    todo: 'badge-secondary',
    review: 'badge-warning',
    done: 'badge-success',
    cancelled: 'badge-danger',
    
    // CRM statuses
    new: 'badge-info',
    contacted: 'badge-primary',
    qualified: 'badge-success',
    converted: 'badge-success',
    lost: 'badge-danger'
  }
  
  return statusMap[status?.toLowerCase()] || 'badge-secondary'
}

/**
 * Format priority badge class
 * @param {String} priority - Priority value
 * @returns {String} CSS class for badge
 */
export const getPriorityBadgeClass = (priority) => {
  const priorityMap = {
    low: 'badge-secondary',
    medium: 'badge-info',
    high: 'badge-warning',
    urgent: 'badge-danger'
  }
  
  return priorityMap[priority?.toLowerCase()] || 'badge-secondary'
}

/**
 * Format array to comma-separated string
 * @param {Array} array - Array to format
 * @param {String} separator - Separator (default: ', ')
 * @returns {String} Formatted string
 */
export const arrayToString = (array, separator = ', ') => {
  if (!Array.isArray(array)) return ''
  return array.join(separator)
}

/**
 * Format boolean to Yes/No
 * @param {Boolean} value - Boolean value
 * @param {String} locale - Locale ('en' or 'ar')
 * @returns {String} Yes/No string
 */
export const formatBoolean = (value, locale = 'en') => {
  if (value === null || value === undefined) return '-'
  
  if (locale === 'ar') {
    return value ? 'نعم' : 'لا'
  }
  
  return value ? 'Yes' : 'No'
}

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatDateTime,
  formatDualDate,
  formatPhone,
  formatIBAN,
  formatFileSize,
  truncate,
  capitalize,
  toTitleCase,
  formatAddress,
  formatName,
  formatRelativeTime,
  formatDuration,
  getStatusBadgeClass,
  getPriorityBadgeClass,
  arrayToString,
  formatBoolean
}