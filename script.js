
        const addMemoryBtn = document.getElementById('addMemoryBtn');
        const memoryGallery = document.getElementById('memoryGallery');
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const closeModal = document.getElementById('closeModal');

        // Function to add memory
        addMemoryBtn.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;
            const imageInput = document.getElementById('imageInput').files[0];

            if (!name || !date || !imageInput) {
                alert('Please fill all fields and select an image.');
                return;
            }

            const reader = new FileReader();

            reader.onload = function() {
                const imageUrl = reader.result;
                addMemory(name, date, imageUrl);
                saveMemory(name, date, imageUrl);
            };

            reader.readAsDataURL(imageInput);
        });

        // Function to add memory to the DOM
        function addMemory(name, date, imageUrl) {
            const memoryCard = document.createElement('div');
            memoryCard.className = 'memory-card';
            memoryCard.innerHTML = `
                <img src="${imageUrl}" alt="Memory Image" onclick="openImageModal('${imageUrl}')">
                <div class="memory-description">
                    <span class="delete-icon" onclick="deleteMemory(this)">X</span>
                    <p><strong>${name}</strong></p>
                    <p>${date}</p>
                </div>
            `;
            memoryGallery.appendChild(memoryCard);
        }

        // Save memory to local storage
        function saveMemory(name, date, imageUrl) {
            const memories = JSON.parse(localStorage.getItem('memories')) || [];
            memories.push({ name, date, imageUrl });
            localStorage.setItem('memories', JSON.stringify(memories));
        }

        // Load memories from local storage
        function loadMemories() {
            const memories = JSON.parse(localStorage.getItem('memories')) || [];
            memories.forEach(memory => addMemory(memory.name, memory.date, memory.imageUrl));
        }

        // Delete memory
        function deleteMemory(element) {
            const memoryCard = element.parentElement.parentElement;
            memoryGallery.removeChild(memoryCard);
            updateLocalStorage();
        }

        // Update local storage after deleting a memory
        function updateLocalStorage() {
            const memories = Array.from(memoryGallery.children).map(memory => {
                const name = memory.querySelector('.memory-description p strong').innerText;
                const date = memory.querySelector('.memory-description p:nth-of-type(2)').innerText;
                const imageUrl = memory.querySelector('img').src;
                return { name, date, imageUrl };
            });
            localStorage.setItem('memories', JSON.stringify(memories));
        }

        // Open image in modal for zoom
        function openImageModal(imageUrl) {
            modalImage.src = imageUrl;
            imageModal.style.display = 'block';
        }

        // Close the image modal
        closeModal.onclick = function() {
            imageModal.style.display = 'none';
        };

        // Close modal when clicking outside the image
        window.onclick = function(event) {
            if (event.target === imageModal) {
                imageModal.style.display = 'none';
            }
        };

        // Load existing memories on page load
        window.onload = loadMemories;

