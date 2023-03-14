addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    // Set the desired URL to redirect to
    const url = 'https://swiftride.pages.dev'
  
    // Create a `Response` object that redirects to the URL
    return Response.redirect(url, 301)
  }