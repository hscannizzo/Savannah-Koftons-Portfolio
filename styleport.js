document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.getElementById('gallery');
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    let jsonData = []; // To store the fetched JSON data

    // Fetch your JSON data (replace 'data.json' with your actual JSON file)
    fetch('datastyle.json')
        .then(response => response.json())
        .then(data => {
            // Check if the data object has the 'Sheet1' property
            if ('Sheet1' in data && Array.isArray(data.Sheet1)) {
                jsonData = data.Sheet1;
            } else {
                console.error('Invalid data format:', data);
            }

            initializeDropdowns(); // Initialize the dropdowns
            updateGallery(); // Initialize the gallery with default data
        })
        .catch(error => console.error('Error fetching data:', error));

    function initializeDropdowns() {
        // Get unique values for each property
        const uniquePublications = [...new Set(jsonData.map(photo => photo.Publication))];
        const uniqueModels = [...new Set(jsonData.map(photo => photo.Model))];
        const uniquePhotographers = [...new Set(jsonData.map(photo => photo.Photographer))];
        const uniqueDates = [...new Set(jsonData.map(photo => photo.Date))];

        // Initialize dropdowns with unique values
        initializeDropdown('sortByPublication', uniquePublications);
        initializeDropdown('sortByModel', uniqueModels);
        initializeDropdown('sortByPhotographer', uniquePhotographers);
        initializeDropdown('sortByDate', uniqueDates);

        // Extract the publication parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const publicationParam = urlParams.get('publication');

        // Set the publication dropdown to the specified value
        if (publicationParam) {
            document.getElementById('sortByPublication').value = publicationParam;
        }
    }

    function initializeDropdown(dropdownId, options) {
        const dropdown = document.getElementById(dropdownId);

        // Clear existing options
        dropdown.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = `All ${dropdownId.replace('sortBy', '')}`;
        dropdown.appendChild(defaultOption);

        // Add unique options from data
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            dropdown.appendChild(option);
        });

        // Add event listener for dropdown changes
        dropdown.addEventListener('change', updateGallery);
    }

    function updateGallery() {
        // Filter and update gallery based on dropdown selections
        const selectedPublication = document.getElementById('sortByPublication').value;
        const selectedModel = document.getElementById('sortByModel').value;
        const selectedPhotographer = document.getElementById('sortByPhotographer').value;
        const selectedDate = document.getElementById('sortByDate').value;

        const filteredData = jsonData.filter(photo =>
            (selectedPublication === 'all' || photo.Publication === selectedPublication) &&
            (selectedModel === 'all' || photo.Model === selectedModel) &&
            (selectedPhotographer === 'all' || photo.Photographer === selectedPhotographer) &&
            (selectedDate === 'all' || photo.Date === selectedDate)
        );

        // Clear existing gallery content
        galleryContainer.innerHTML = '';

        // Sort data by ID (default)
        filteredData.sort((a, b) => a.ID - b.ID);

        // Populate the gallery with filtered data
        filteredData.forEach(photo => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const image = document.createElement('img');
            image.src = photo.src;
            image.alt = photo.ID;
            image.dataset.photographer = photo.Photographer;
            image.dataset.publication = photo.Publication;
            image.dataset.model = photo.Model;
            image.dataset.date = photo.Date;
            image.addEventListener('click', () => openImage(photo));

            imageContainer.appendChild(image);
            galleryContainer.appendChild(imageContainer);
        });
    }

    function openImage(photo) {
        modalContent.innerHTML = '';

        // Create elements for the enlarged image and additional information
        const enlargedImage = document.createElement('img');
        enlargedImage.src = photo.src;
        enlargedImage.alt = photo.ID;
        enlargedImage.classList.add('enlarged-image');

        const additionalInfo = document.createElement('div');
        additionalInfo.classList.add('additional-info');
        additionalInfo.innerHTML = `
            <p><strong>Photographer:</strong> ${photo.Photographer}</p>
            <p><strong>Publication:</strong> ${photo.Publication}</p>
            <p><strong>Model:</strong> ${photo.Model}</p>
            <p><strong>Date:</strong> ${photo.Date}</p>
        `;

        modalContent.appendChild(enlargedImage);
        modalContent.appendChild(additionalInfo);

          // Display the modal
    modalContainer.style.display = 'flex';
}

// Close modal function
function closeModal() {
    modalContainer.style.display = 'none';
}

// Close the modal when clicking outside the modal content
modalContainer.addEventListener('click', function (event) {
    if (event.target === modalContainer) {
        closeModal();
    }
});

// Add event listeners for dropdown changes
const sortByPublicationDropdown = document.getElementById('sortByPublication');
sortByPublicationDropdown.addEventListener('change', function () {
    // Reset other dropdowns to default when changing Publication
    document.getElementById('sortByModel').value = 'all';
    document.getElementById('sortByPhotographer').value = 'all';
    document.getElementById('sortByDate').value = 'all';

    updateGallery();
});

const sortByModelDropdown = document.getElementById('sortByModel');
sortByModelDropdown.addEventListener('change', function () {
    // Reset other dropdowns to default when changing Model
    document.getElementById('sortByPublication').value = 'all';
    document.getElementById('sortByPhotographer').value = 'all';
    document.getElementById('sortByDate').value = 'all';

    updateGallery();
});

const sortByPhotographerDropdown = document.getElementById('sortByPhotographer');
sortByPhotographerDropdown.addEventListener('change', function () {
    // Reset other dropdowns to default when changing Photographer
    document.getElementById('sortByPublication').value = 'all';
    document.getElementById('sortByModel').value = 'all';
    document.getElementById('sortByDate').value = 'all';

    updateGallery();
});

const sortByDateDropdown = document.getElementById('sortByDate');
sortByDateDropdown.addEventListener('change', function () {
    // Reset other dropdowns to default when changing Date
    document.getElementById('sortByPublication').value = 'all';
    document.getElementById('sortByModel').value = 'all';
    document.getElementById('sortByPhotographer').value = 'all';

    updateGallery();
});
});
