document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('mousemove', (e) => {
        // Get the dimensions of the island
        const { offsetWidth: width, offsetHeight: height } = island;
        
        // Get the center of the island
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate the mouse's position relative to the center
        const mouseX = e.clientX - island.getBoundingClientRect().left;
        const mouseY = e.clientY - island.getBoundingClientRect().top;

        // Calculate how much to tilt the island based on mouse position
        const tiltX = (mouseY - centerY) / centerY * 10; // Adjust the tilt value as needed
        const tiltY = (mouseX - centerX) / centerX * -10; // Invert Y tilt for effect

        // Apply transform
        island.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Calculate shadow position based on tilt
        const shadowX = (tiltY / 10) * 10; // Shadow moves based on Y tilt
        const shadowY = (tiltX / 10) * 10; // Shadow moves based on X tilt

        // Apply new shadow position
        island.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.5)`; // Adjust shadow size as needed
    });

    island.addEventListener('mouseleave', () => {
        // Reset the tilt and shadow when the mouse leaves the island
        island.style.transform = 'rotateX(0) rotateY(0)';
        island.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)'; // Reset to original shadow
    });
});

// testing
var search = document.querySelector(".searchButton")

search.addEventListener("click", function() {
    document.querySelector(".islandTopCenter").classList.remove("initialPhase")
    document.querySelector(".islandTopCenter").classList.add("removeMargin")
    document.querySelector(".islandBottomCenter").classList.remove("initialPhaseBottom", "hidden")
    document.querySelector(".islandBottomCenter").classList.add("fade-in")
    document.querySelector(".searchContainer").classList.add("fade-out")
    document.querySelector(".countryOptions").classList.add("fade-out")
    document.querySelector(".containerRight").classList.remove("hidden")
    document.querySelector(".containerRight").classList.add("slide-in-right")
    document.querySelector(".containerLeft").classList.remove("hidden")
    document.querySelector(".containerLeft").classList.add("slide-in-left")
})