// Register service worker for PWA functionality

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

// PWA install prompt handler
export function setupPWAInstallPrompt() {
  // Store the deferredPrompt for later use
  let deferredPrompt: any;
  
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt from showing
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Optionally show your own install button or notification
    // This could be added to the UI if needed
    console.log('App can be installed. User can be prompted.');
  });
  
  // Function to trigger the install prompt (can be called from a button click)
  return async function showInstallPrompt() {
    if (!deferredPrompt) {
      console.log('Cannot show install prompt - app is already installed or not installable');
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt variable
    deferredPrompt = null;
  };
}