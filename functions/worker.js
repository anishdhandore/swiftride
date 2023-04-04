addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = 'https://swiftride.pages.dev';
  const response = await fetch(url);

  if (!request.headers.get('cookie')?.includes('uniqueUserId')) {
    const uniqueUserId = uuidv4();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set the cookie to expire in 1 year

    // Clone the response to make it mutable
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });

    // Set the unique user ID cookie in the response
    modifiedResponse.headers.append(
      'Set-Cookie',
      `uniqueUserId=${uniqueUserId}; Expires=${expiryDate.toUTCString()}; Path=/; HttpOnly; Secure; SameSite=None`
    );    

    return modifiedResponse;
  }

  return response;
}

function uuidv4() {
  // A simplified implementation of UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
