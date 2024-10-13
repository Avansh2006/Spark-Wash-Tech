// Get form and table elements
const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
let time = 3;

// Load orders from localStorage on page load
document.addEventListener('DOMContentLoaded', loadOrders);

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=bd715d805d5ee9e79ed805b352a99269&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
            checkWeatherCondition(data);
        } else {
            document.getElementById('weatherInfo').textContent = 'Some Error in API';
        }
    } catch (error) {
        document.getElementById('weatherInfo').textContent = 'Error fetching weather data.';
        console.error(error);
    }
}
function  checkWeatherCondition(data){
    const weather = data.weather[0].main.toLowerCase(); // gives the main weather from api

    if (weather === 'clear') {
        document.getElementsByClassName('Timeupd').innerText = '3 Days'; 
    } else if (weather === 'rain') {
        document.getElementsByClassName('Timeupd').innerText = '5 Days';
    } else {
        document.getElementsByClassName('Timeupd').innerText = '4 Days';
    }
}

// Add new order
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const serviceType = document.getElementById('serviceType').value;
    const price = document.getElementById('price').value;
    
    if (!customerName || !serviceType || !price) {
        alert("Please fill all fields");
        return;
    }
    
    const order = {
        id: Date.now(), 
        customerName,
        serviceType,
        status: 'Pending',
        price,
        time 
    };
    
    
    addOrder(order);
    saveOrderToLocal(order);
    orderForm.reset(); 
});

// Function to add order to the table
function addOrder(order) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', order.id); 
    
    row.innerHTML = `
        <td>${order.customerName}</td>
        <td>${order.serviceType}</td>
        <td>${order.status}</td>
        <td class="time-cell">${order.time || time} Days</td> 
        <td>${order.price}</td>
        <td>
            <button onclick="updateStatus(this)">Update Status</button>
            <button onclick="deleteOrder(this)">Delete</button>
            <button onclick="IncreaseTime(this)">Increase time</button>
            <button onclick="DecreaseTime(this)">Decrease time</button>
        </td>
    `;
    
    orderList.appendChild(row);
}

function IncreaseTime(button) {
    const row = button.parentElement.parentElement;
    const orderId = row.getAttribute('data-id'); 
    const timeCell = row.querySelector('.time-cell'); 
    let currentTime = parseInt(timeCell.textContent); 
    currentTime += 1; 
    timeCell.textContent = `${currentTime} Days`; 
    
    // Update the time in localStorage
    updateOrderTimeInLocalStorage(orderId, currentTime);
}

function DecreaseTime(button) {
    const row = button.parentElement.parentElement;
    const orderId = row.getAttribute('data-id');  
    const timeCell = row.querySelector('.time-cell');
    let currentTime = parseInt(timeCell.textContent);
    if (currentTime > 1) {
        currentTime -= 1;
        timeCell.textContent = `${currentTime} Days`;

        updateOrderTimeInLocalStorage(orderId, currentTime);
    }
}
function updateOrderTimeInLocalStorage(orderId, newTime) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orders = orders.map(order => {
        if (order.id == orderId) {
            order.time = newTime;
        }
        return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(orders));
}


// Function to save order to localStorage
function saveOrderToLocal(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Load orders from localStorage
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orders.forEach(order => {
        addOrder(order);
    });
}

// Update order status
function updateStatus(button) {
    const row = button.parentElement.parentElement;
    const statusCell = row.cells[2];
    statusCell.textContent = statusCell.textContent === 'Pending' ? 'Completed' : 'Pending';
    
    // Update the status in localStorage
    const orderId = row.getAttribute('data-id');
    updateOrderStatusInLocalStorage(orderId, statusCell.textContent);
}

function updateOrderStatusInLocalStorage(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.map(order => {
        if (order.id == orderId) {
            order.status = newStatus;
        }
        return order;
    });
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Delete order
function deleteOrder(button) {
    const row = button.parentElement.parentElement;
    const orderId = row.getAttribute('data-id');
    row.remove();
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.id != orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
}
