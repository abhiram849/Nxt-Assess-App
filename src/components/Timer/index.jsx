useEffect(() => {
  if (apiStatus !== 'SUCCESS') {
    return
  }

  timerRef.current = setInterval(() => {
    setTimeRemaining(previousTime => {
      if (previousTime <= 1) {
        clearInterval(timerRef.current)
        return 0
      }

      return previousTime - 1
    })
  }, 1000)

  return () => {
    clearInterval(timerRef.current)
  }
}, [apiStatus])
