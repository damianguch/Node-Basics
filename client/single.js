// The client should include the appropriate upload-type header when
// making requests. This ensures the route can handle both single and
// multiple uploads seamlessly while keeping the logic centralized.

const formData = new FormData();

formData.append('image', file);
await fetch('/upload', {
  method: 'POST',
  headers: {
    'upload-type': 'single',
    Authorization: `Bearer ${token}`
  },
  body: formData
});
