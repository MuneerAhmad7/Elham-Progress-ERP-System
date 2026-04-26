/**
 * API Helper Functions
 */

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {String} Query string
 */
export const buildQueryString = (params) => {
  const query = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => query.append(key, item))
      } else {
        query.append(key, value)
      }
    }
  })
  
  return query.toString()
}

/**
 * Handle API error
 * @param {Error} error - Error object
 * @returns {Object} Formatted error
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      errors: error.response.data?.errors || {},
      data: error.response.data
    }
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server',
      errors: {}
    }
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'Request failed',
      errors: {}
    }
  }
}

/**
 * Download file from API response
 * @param {Blob} blob - File blob
 * @param {String} filename - File name
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * Convert form data to JSON
 * @param {FormData} formData - Form data
 * @returns {Object} JSON object
 */
export const formDataToJson = (formData) => {
  const object = {}
  
  formData.forEach((value, key) => {
    if (object[key]) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]]
      }
      object[key].push(value)
    } else {
      object[key] = value
    }
  })
  
  return object
}

/**
 * Convert JSON to form data
 * @param {Object} json - JSON object
 * @returns {FormData} Form data
 */
export const jsonToFormData = (json) => {
  const formData = new FormData()
  
  Object.keys(json).forEach(key => {
    const value = json[key]
    
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, item))
    } else if (value instanceof File) {
      formData.append(key, value)
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })
  
  return formData
}

/**
 * Retry failed API request
 * @param {Function} apiCall - API call function
 * @param {Number} retries - Number of retries
 * @param {Number} delay - Delay between retries (ms)
 * @returns {Promise} API response
 */
export const retryApiCall = async (apiCall, retries = 3, delay = 1000) => {
  try {
    return await apiCall()
  } catch (error) {
    if (retries === 0) throw error
    
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryApiCall(apiCall, retries - 1, delay)
  }
}

/**
 * Debounce API call
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounceApiCall = (func, wait = 300) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default {
  buildQueryString,
  handleApiError,
  downloadFile,
  formDataToJson,
  jsonToFormData,
  retryApiCall,
  debounceApiCall
}