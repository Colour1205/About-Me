/* --- resume section --- */
const resume = document.getElementById('resume');

/* --- modal logic --- */
const modalButton = document.querySelectorAll('button');

// Get all buttons that trigger modals
document.querySelectorAll('button[data-target]').forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-target');
    const modal = document.getElementById(modalId);

    if (modal) {
      const modalContainer = modal.closest('.modal-container');
      modal.classList.add('show');
      modalContainer.classList.add('show');
    }
  });
});

function closeModal(modal) {
  if (!modal) return;
  const modalContainer = modal.closest('.modal-container');
  modal.classList.remove('show');
  if (modalContainer) modalContainer.classList.remove('show');

  // Special handling for YouTube modal: reset the iframe src to stop playback
  if (modal.id === 'youtube-modal') {
    const iframe = modal.querySelector('iframe');
    if (iframe) iframe.src = iframe.src; // Reset src to stop playback
  }
}

// Close modal on background click
document.querySelectorAll('.modal-container').forEach(container => {
  container.addEventListener('click', (event) => {
    // Only close if click is directly on the background, not on the modal
    if (event.target === container) {
      closeModal(container.querySelector('.modal.show'));
    }
  });
});

// Close modal on close button click
document.querySelectorAll('.modal-close-button').forEach(closeButton => {
  closeButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent bubbling up
    const modal = closeButton.closest('.modal');
    closeModal(modal);
  });
});


// back button logic
const back_button = document.getElementById('back-button');
back_button.addEventListener('click', () => {
  // Scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* --- outer container background scroll logic --- */
const outer_container = document.querySelector('.outer-container');
const header_section = document.querySelector('.header-section');
const blur_overshoot = document.querySelectorAll('.blur-overshoot');
const buttons = document.querySelectorAll('.button');
const social_section = document.querySelector('.social-section');
const scroll_up_text = document.getElementById('scroll-up-text');
const about_me = document.querySelector('.about-me')
const off_screen_section = document.querySelector('.off-screen-section');
const button_v4 = document.querySelectorAll('.buttonv4');
const top_button_container = document.querySelector('.top-button-container');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    header_section.classList.add('scrolled');
    outer_container.classList.add('scrolled');
    social_section.classList.add('scrolled');
    scroll_up_text.classList.add('scrolled');
    about_me.classList.add('scrolled');
    back_button.classList.add('scrolled');
    off_screen_section.classList.add('scrolled');
    top_button_container.classList.add('scrolled');

    buttons.forEach(e1 => {
      e1.classList.add('scrolled');
    });

    blur_overshoot.forEach(el => {
      el.classList.add('animate-in');
      el.classList.remove('animate-out');
    });

    button_v4.forEach(e1 => {
      e1.classList.add('scrolled');
    });

    document.documentElement.style.setProperty('--font-color', 'black');
    document.documentElement.style.setProperty('--font-color-alt', 'white');
    document.documentElement.style.setProperty('--button-background', 'rgba(0, 0, 0, 0.65)');
    document.documentElement.style.setProperty('--font-weight', 'bold');
  } else {
    header_section.classList.remove('scrolled');
    outer_container.classList.remove('scrolled');
    social_section.classList.remove('scrolled');
    scroll_up_text.classList.remove('scrolled');
    about_me.classList.remove('scrolled');
    back_button.classList.remove('scrolled');
    off_screen_section.classList.remove('scrolled');
    top_button_container.classList.remove('scrolled');

    buttons.forEach(e1 => {
      e1.classList.remove('scrolled');
    });

    blur_overshoot.forEach(el => {
      el.classList.remove('animate-in');
      el.classList.add('animate-out');
    });

    button_v4.forEach(e1 => {
      e1.classList.remove('scrolled');
    });

    document.documentElement.style.setProperty('--font-color', 'white');
    document.documentElement.style.setProperty('--font-color-alt', 'black');
    document.documentElement.style.setProperty('--button-background', 'rgba(255, 255, 255, 0.5)');
    document.documentElement.style.setProperty('--font-weight', 'normal');
  }
});


/* --- stock widget logic --- */
const STOCK_SYMBOLS = [
  { symbol: 'AAPL', elemId: 'stock-aapl', label: 'AAPL' },
  { symbol: 'TSLA', elemId: 'stock-tsla', label: 'TSLA' },
  { symbol: 'SPY', elemId: 'stock-spy', label: 'S&P 500' },
  { symbol: 'GOOGL', elemId: 'stock-googl', label: 'GOOGL' },
  { symbol: 'NVDA', elemId: 'stock-nvda', label: 'NVDA' },
  { symbol: 'META', elemId: 'stock-meta', label: 'META' },
  { symbol: 'btc-usd', elemId: 'stock-btc', label: 'BTC/USD' },
];

document.addEventListener("DOMContentLoaded", function () {
  const stockSection = document.getElementById('stock-section');
  if (!stockSection) return;

  STOCK_SYMBOLS.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock card';
    card.id = stock.elemId;

    card.innerHTML = `
      <div class="stock-ticker">${stock.label}</div>
      <div class="stock-price"></div>
    `;
    stockSection.appendChild(card);
  });

  updateStockPricesYahoo(); // initial fetch after DOM load
});

// Helper function to fetch price from Yahoo Finance
async function fetchYahooQuote(symbol) {
  try {
    const url = `https://yahoo-proxy-colour1205s-projects.vercel.app/api/yahoo?symbol=${symbol}`;
    const res = await fetch(url);
    const data = await res.json();
    // Defensive checks for data
    if (!data.chart || !data.chart.result || !data.chart.result[0]) return null;
    const meta = data.chart.result[0].meta;
    // Try to use regularMarketPrice or previousClose as fallback
    let price = meta.regularMarketPrice ?? meta.previousClose ?? null;
    let prevClose = meta.previousClose ?? null;
    if (price == null || prevClose == null) return null;
    // Calculate percent change
    const percentChange = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
    return { price, percentChange };
  } catch {
    return null;
  }
}

// Update all stock cards with latest prices from Yahoo (fetch in parallel)
async function updateStockPricesYahoo() {
  await Promise.all(
    STOCK_SYMBOLS.map(async ({ symbol, elemId }) => {
      const priceElem = document.querySelector(`#${elemId} .stock-price`);
      try {
        const result = await fetchYahooQuote(symbol);
        if (result) {
          const { price, percentChange } = result;
          let color = percentChange > 0 ? "#3E9D45" : percentChange < 0 ? "#CA5C5C" : "#444";
          let sign = percentChange > 0 ? "+" : "";
          priceElem.innerHTML = `<span style="color:${color};">${price.toFixed(2)} <small>(${sign}${percentChange.toFixed(2)}%)</small></span>`;
        } else {
          priceElem.textContent = "—";
        }
      } catch {
        priceElem.textContent = "—";
      }
    })
  );
}

// Refresh prices every 60 seconds
setInterval(updateStockPricesYahoo, 60000);

/* --- top container logic --- */

//widget button
const widget_button = document.getElementById('widget-button');
widget_button.addEventListener('click', () => {
  const widget_container = document.querySelector('.widget-container');
  widget_container.classList.toggle('show');
});

// widget close button
const widget_close_button = document.getElementById('widget-close-button');
widget_close_button.addEventListener('click', () => {
  const widget_container = document.querySelector('.widget-container');
  widget_container.classList.remove('show');
});

