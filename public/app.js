const socket = io();

const imageInput = document.getElementById('imageInput');
const linkInput = document.getElementById('linkInput');
const altInput = document.getElementById('altInput');
const nameInput = document.getElementById('nameInput');
const uploadButton = document.getElementById('uploadButton');
const imagesDiv = document.getElementById('images');

socket.on('initialImages', (images) => {
  images.forEach(addImageToDOM);
});

socket.on('newImage', (image) => {
  addImageToDOM(image);
});

uploadButton.addEventListener('click', () => {
  const file = imageInput.files[0];
  const link = linkInput.value;
  const alt = altInput.value;
  const name = nameInput.value;

  if (file && link && name) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('link', link);
    formData.append('alt', alt);
    formData.append('name', name);

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      linkInput.value = '';
      altInput.value = '';
      nameInput.value = '';
      imageInput.value = '';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
});

function addImageToDOM(image) {
  const li = document.createElement('li');
  li.classList.add('image-item');
  li.innerHTML = `
    <img src="${image.url}" alt="${image.alt}">
    <p>Added by ${image.name}</p>
    <p><a href="${image.link}" target="_blank">Source</a></p>
  `;
  imageList.appendChild(li);
}