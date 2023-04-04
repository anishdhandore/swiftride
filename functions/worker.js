addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = 'https://swiftride.pages.dev';
  const response = await fetch(url);

  return response;
}

