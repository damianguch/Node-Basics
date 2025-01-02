// The client should include the appropriate upload-type header when
// making requests. This ensures the route can handle both single and
// multiple uploads seamlessly while keeping the logic centralized.

const formData = new FormData();

files.forEach((file) => formData.append('images', file));

await fetch('/upload', {
  method: 'POST',
  headers: {
    'upload-type': 'multiple',
    Authorization: `Bearer ${token}`
  },
  body: formData
});
