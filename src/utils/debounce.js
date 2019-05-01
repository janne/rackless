const debounce = (handler, wait) => {
  let timeout
  return (...args) => {
    if (timeout) return
    const later = () => {
      timeout = null
      handler(...args)
    }
    timeout = setTimeout(later, wait)
  }
}

export default debounce
