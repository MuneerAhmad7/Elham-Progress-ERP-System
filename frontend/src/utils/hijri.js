/**
 * Hijri Calendar Utilities
 * Converts between Gregorian and Hijri dates
 */

import { HijriDate } from 'hijri-date/lib/safe'

/**
 * Convert Gregorian date to Hijri
 * @param {Date|String} date - Gregorian date
 * @returns {Object} Hijri date object
 */
export const toHijri = (date) => {
  try {
    const gregorianDate = new Date(date)
    const hijri = new HijriDate(gregorianDate)
    
    return {
      year: hijri.getFullYear(),
      month: hijri.getMonth() + 1,
      day: hijri.getDate(),
      monthName: hijri.getMonthName('en'),
      monthNameAr: hijri.getMonthName('ar'),
      formatted: `${hijri.getDate()} ${hijri.getMonthName('en')} ${hijri.getFullYear()} هـ`,
      formattedAr: `${hijri.getDate()} ${hijri.getMonthName('ar')} ${hijri.getFullYear()} هـ`
    }
  } catch (error) {
    console.error('Error converting to Hijri:', error)
    return null
  }
}

/**
 * Convert Hijri date to Gregorian
 * @param {Number} year - Hijri year
 * @param {Number} month - Hijri month (1-12)
 * @param {Number} day - Hijri day
 * @returns {Date} Gregorian date
 */
export const toGregorian = (year, month, day) => {
  try {
    const hijri = new HijriDate(year, month - 1, day)
    return hijri.toGregorian()
  } catch (error) {
    console.error('Error converting to Gregorian:', error)
    return null
  }
}

/**
 * Format Hijri date
 * @param {Date|String} date - Date to format
 * @param {String} locale - 'en' or 'ar'
 * @returns {String} Formatted Hijri date
 */
export const formatHijriDate = (date, locale = 'en') => {
  const hijri = toHijri(date)
  if (!hijri) return ''
  
  return locale === 'ar' ? hijri.formattedAr : hijri.formatted
}

/**
 * Get current Hijri date
 * @returns {Object} Current Hijri date
 */
export const getCurrentHijriDate = () => {
  return toHijri(new Date())
}

/**
 * Get Hijri month names
 * @param {String} locale - 'en' or 'ar'
 * @returns {Array} Array of month names
 */
export const getHijriMonthNames = (locale = 'en') => {
  const months = []
  const hijri = new HijriDate()
  
  for (let i = 0; i < 12; i++) {
    months.push(hijri.getMonthName(locale, i))
  }
  
  return months
}

/**
 * Calculate days between two Hijri dates
 * @param {Object} hijriDate1 - First Hijri date {year, month, day}
 * @param {Object} hijriDate2 - Second Hijri date {year, month, day}
 * @returns {Number} Number of days
 */
export const daysBetweenHijri = (hijriDate1, hijriDate2) => {
  try {
    const greg1 = toGregorian(hijriDate1.year, hijriDate1.month, hijriDate1.day)
    const greg2 = toGregorian(hijriDate2.year, hijriDate2.month, hijriDate2.day)
    
    const diffTime = Math.abs(greg2 - greg1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  } catch (error) {
    console.error('Error calculating days between Hijri dates:', error)
    return 0
  }
}

/**
 * Check if Hijri date is valid
 * @param {Number} year - Hijri year
 * @param {Number} month - Hijri month (1-12)
 * @param {Number} day - Hijri day
 * @returns {Boolean} True if valid
 */
export const isValidHijriDate = (year, month, day) => {
  try {
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 30) return false
    if (year < 1) return false
    
    new HijriDate(year, month - 1, day)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get Hijri year from Gregorian year
 * @param {Number} gregorianYear - Gregorian year
 * @returns {Number} Approximate Hijri year
 */
export const getHijriYearFromGregorian = (gregorianYear) => {
  // Approximate conversion: Hijri year = (Gregorian year - 622) * 1.03
  return Math.floor((gregorianYear - 622) * 1.03)
}

/**
 * Format dual date (Gregorian and Hijri)
 * @param {Date|String} date - Date to format
 * @param {String} locale - 'en' or 'ar'
 * @returns {String} Formatted dual date
 */
export const formatDualDate = (date, locale = 'en') => {
  const gregorian = new Date(date)
  const hijri = toHijri(date)
  
  if (!hijri) return ''
  
  const gregorianFormatted = gregorian.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const hijriFormatted = locale === 'ar' ? hijri.formattedAr : hijri.formatted
  
  return `${gregorianFormatted} (${hijriFormatted})`
}

export default {
  toHijri,
  toGregorian,
  formatHijriDate,
  getCurrentHijriDate,
  getHijriMonthNames,
  daysBetweenHijri,
  isValidHijriDate,
  getHijriYearFromGregorian,
  formatDualDate
}