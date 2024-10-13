// Get form and table elements
const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');

// Load orders from localStorage on page load
document.addEventListener('DOMContentLoaded', loadOrders);
//  weather api hitting
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
    
    const order = {
        customerName,
        serviceType,
        status: 'Pending',
        price
    };
    
    addOrder(order);
    saveOrderToLocal(order);
});

// Function to add order to the table
function addOrder(order) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${order.customerName}</td>
        <td>${order.serviceType}</td>
        <td>${order.status}</td>
        <td>${order.price}</td>
       <td class="Timeupd"> 3 Days </td>
        <td>
            <button onclick="deleteOrder(this)">Delete</button>
        </td>
    `;
    
    orderList.appendChild(row);
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
}

// Delete order
function deleteOrder(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customerName = row.cells[0].textContent;
    orders = orders.filter(order => order.customerName !== customerName);
    localStorage.setItem('orders', JSON.stringify(orders));
}
