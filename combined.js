let dataset;
let filteredDataset;
let pairedSocks = [];
let zone;


function preload() {
 dataset = loadTable('./socks.csv', 'csv', 'header');
}

function setup() {
  noCanvas();
  filteredDataset = dataset.rows;

  zone = select('#drop-zone');
  createFilters(select('#filter-container'));
  displaySocks(filteredDataset);

  select('#congrats-btn').mousePressed(() => {
    select('#popup').style('display', 'block');
  });
  
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

function calculateTime(dateLost) {
    const lostDate = new Date(dateLost);
    const currentDate = new Date();
  
    const diffTime = Math.abs(currentDate - lostDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const diffWeeks = diffDays / 7;
    const diffMonths = diffDays / 30;
    const diffYears = diffDays / 365;
  
    if (diffYears >= 1) {
      const years = Math.floor(diffYears);
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (diffMonths >= 1) {
      const months = Math.floor(diffMonths);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const weeks = Math.floor(diffWeeks);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    }
  }

  function calculateTimeWeeks(dateLost) {
    const lostDate = new Date(dateLost);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - lostDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.floor(diffDays / 7);
  }
  

function createFilters(container) {
    const filters = ['Color', 'Continent', 'Time Alone'];
  
    filters.forEach(filter => {
      const wrapper = createDiv().addClass('filter-group').parent(container);
      createElement('div', filter + ':').addClass('filter-label').parent(wrapper);
  
      let values = [];
  
      if (filter === 'Time Alone') {
        values = ['Under Month', '6 Months', '1 Year', 'Year+'];
      } else {
        values = dataset.getColumn(filter).filter((v, i, a) => v && a.indexOf(v) === i).sort();
      }
  
      values.forEach(val => {
        const btn = createButton(val)
          .addClass('filter-btn')
          .parent(wrapper)
          .mousePressed(() => filterSocks(filter, val));
  
        if (filter.toLowerCase() === 'color') {
          btn.attribute('data-color', val.toLowerCase());
          btn.style('background-color', 'transparent');
          btn.style('color', 'black');
  
          btn.mouseOver(() => {
            btn.style('background-color', val.toLowerCase());
            btn.style('color', 'transparent');
          });
  
          btn.mouseOut(() => {
            btn.style('background-color', 'transparent');
            btn.style('color', 'black');
          });
        } else {
          // Add underline on hover for non-color filters
          btn.mouseOver(() => btn.style('text-decoration', 'underline'));
          btn.mouseOut(() => btn.style('text-decoration', 'none'));
        }
      });
    });
  
    // Move this outside the loop
 
     
        const resetBtn = createButton('Show All Socks')
        .addClass('filter-btn')
        .parent(container)
        .mousePressed(() => {
          filteredDataset = dataset.rows;
          displaySocks(filteredDataset);
        });
      
      resetBtn.mouseOver(() => resetBtn.style('text-decoration', 'underline'));
      resetBtn.mouseOut(() => resetBtn.style('text-decoration', 'none'));
      

      
  }
  
function filterSocks(column, value) {
  if (column === 'Time Alone') {
    filteredDataset = dataset.rows.filter(row => {
      const weeks = calculateTimeWeeks(row.obj.date_lost);
      if (value === 'Under Month' && weeks < 4) return true;
      if (value === '6 Months' && weeks >= 4 && weeks < 26) return true;
      if (value === '1 Year' && weeks >= 26 && weeks < 52) return true;
      if (value === 'Year+' && weeks >= 52) return true;
      return false;
    });
  } else {
    filteredDataset = dataset.findRows(value, column);
  }
  displaySocks(filteredDataset);
}

function displaySocks(rows) {
    selectAll('.sock-card').forEach(el => el.remove());
    const container = select('#sock-container');
  
    rows.forEach(row => {
      const sock = row.obj;
      if (pairedSocks.includes(sock)) return;
    
      const card = createDiv().addClass('sock-card').parent(container);
      const img = createImg(sock.image_url, sock.name, sock.note).parent(card);
      img.size(130, 250);
    
      img.mousePressed(() => {
        if (pairedSocks.length < 2 && !pairedSocks.includes(sock)) {
          pairedSocks.push(sock);
          updatePairingZone();
          card.remove();
        }
      });
    
      img.mouseOver(() => img.addClass('hovered'));
      img.mouseOut(() => img.removeClass('hovered'));
    
      const info = createDiv().addClass('info').parent(card);
      createElement('p', sock.Country).parent(info);
      createElement('p', calculateTime(sock.date_lost) + ' alone').parent(info);
      createElement('note', sock.note).parent(info);
    });
    
  }

  function updatePairingZone() {
    if (!zone) {
      console.error('Drop zone is not defined!');
      return;
    }
  
    zone.html(''); // Clear previous socks
  
    // Style the container to layout socks properly
    zone.style('display', 'flex');
    zone.style('gap', '-1000px'); // Reduced gap between socks
    zone.style('no-wrap');
    zone.style('justify-content', 'center');
  
    pairedSocks.forEach(sock => {
      const sockImg = createImg(sock.image_url, sock.name);
      sockImg.parent(zone);
      sockImg.size(130, 250);
    
      const tilt = random(-8, 8);
      sockImg.style('transform', `rotate(${tilt}deg)`);
      sockImg.style('cursor', 'pointer');
    
      // Use the sock reference directly instead of relying on index
      sockImg.mousePressed(() => {
        pairedSocks = pairedSocks.filter(s => s !== sock); // Remove just the clicked sock
        updatePairingZone();
        displaySocks(filteredDataset);
      });
    });
    
  
  
    
  
  
  
  
  
  
  }
