// Get form and table elements
const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');

// Initialize the default time
let defaultTime = 3;  // Default time value

// Load orders from localStorage on page load
document.addEventListener('DOMContentLoaded', loadOrders);
// Fetch weather on page load
document.addEventListener('DOMContentLoaded', getWeather);

// Weather API call
async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=bd715d805d5ee9e79ed805b352a99269&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
            checkWeatherCondition(data);
        } else {
            document.getElementById('weatherInfo').textContent = 'Error in fetching API';
        }
    } catch (error) {
        document.getElementById('weatherInfo').textContent = 'Error fetching weather data.';
        console.error(error);
    }
}

// Check weather conditions and update the default time
function checkWeatherCondition(data) {
    const weather = data.weather[0].main.toLowerCase(); 

    if (weather === 'clear') {
        defaultTime = 3;
    } else if (weather === 'rain') {
        defaultTime = 5;
    } else {
        defaultTime = 4;
    }
}

// Add new order
orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const serviceType = document.getElementById('serviceType').value;
    const price = document.getElementById('price').value;

    const order = {
        customerName,
        serviceType,
        status: 'Pending',
        price,
        time: defaultTime 
    };

    addOrder(order);
    saveOrderToLocal(order);
    orderForm.reset();  
});

// Function to add order to the table
// Function to add order to the table
function addOrder(order) {
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${order.customerName}</td>
        <td>${order.serviceType}</td>
        <td>${order.status}</td>
        <td class="price-cell">${order.price}</td> 
        <td class="time-cell">${order.time} Days</td>  
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

// Delete order from table and localStorage
function deleteOrder(button) {
    const row = button.parentElement.parentElement;
    const customerName = row.cells[0].textContent;  
    row.remove();  // Remove from DOM

    // Update localStorage by removing the deleted order
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter(order => order.customerName !== customerName);
    localStorage.setItem('orders', JSON.stringify(orders));
}
