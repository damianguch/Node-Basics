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
