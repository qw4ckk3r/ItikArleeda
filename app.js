// Check if service workers are supported and register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  } else {
    console.log('Service Worker not supported');
  }
  
  // Handle the 'Add to Home Screen' prompt for Android and iOS
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt = e;
    // Optionally, you can show a custom "Add to Home Screen" button
    let addBtn = document.getElementById('addToHomeScreen');
    if (addBtn) {
      addBtn.style.display = 'block';
      addBtn.addEventListener('click', (e) => {
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          console.log(choiceResult.outcome);
          deferredPrompt = null;
        });
      });
    }
  });
  
  // Listen for events when the app is added to the home screen (for Android)
  window.addEventListener('appinstalled', (event) => {
    console.log('PWA was installed', event);
  });  