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
