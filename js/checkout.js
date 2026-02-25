async function checkout(product) {
  const button = document.querySelector(`[data-product="${product}"]`);
  if (button) {
    button.classList.add('loading');
    button.textContent = 'Loading...';
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product }),
    });

    const data = await response.json();
    
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Error: ' + (data.error || 'Unknown error'));
      if (button) {
        button.classList.remove('loading');
        button.textContent = 'Buy Now';
      }
    }
  } catch (err) {
    alert('Error: ' + err.message);
    if (button) {
      button.classList.remove('loading');
      button.textContent = 'Buy Now';
    }
  }
}