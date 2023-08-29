const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
  // Load the destination page
  const response = await fetch(url) 
  const text = await response.text()

  // show only the HTML content inside of the body tag
	// use regex to extract it
	const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data
}

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return
  
  window.navigation.addEventListener('navigate', event => {
    const toUrl = new URL(event.destination.url)
    
    // if it is an external page it will be ignored
			if (location.origin !== toUrl.origin) return

		// if it is form the same domain, then:
    event.intercept({
      async handler() {
        // load the destination page
        // use fetch to get the HTML
        const data = await fetchPage(toUrl.pathname)
        
        // use the API of view transition API
        document.startViewTransition(() => {
          // scroll to the top and show the HTML
          document.body.innerHTML = data
          document.documentElement.scrollTop = 0
        })
      }
    })
  })
}