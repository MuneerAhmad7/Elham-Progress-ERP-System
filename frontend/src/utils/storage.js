/**
 * Local Storage Utilities
 */

/**
 * Get item from localStorage
 * @param {String} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

/**
 * Set item in localStorage
 * @param {String} key - Storage key
 * @param {*} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * Remove item from localStorage
 * @param {String} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Clear all items from localStorage
 */
export const clear = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Get all keys from localStorage
 * @returns {Array} Array of keys
 */
export const getAllKeys = () => {
  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error('Error getting keys from localStorage:', error)
    return []
  }
}

/**
 * Check if key exists in localStorage
 * @param {String} key - Storage key
 * @returns {Boolean} True if exists
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null
}

/**
 * Session Storage functions
 */
export const session = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from sessionStorage:', error)
      return defaultValue
    }
  },
  
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to sessionStorage:', error)
    }
  },
  
  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from sessionStorage:', error)
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
    }
  }
}

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  hasItem,
  session
}