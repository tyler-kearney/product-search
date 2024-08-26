import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import lodash from 'lodash';
import axios from 'axios';

// references to the html elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');

searchButton.addEventListener('click', async () => {
    // Search logic will go here.
    const searchQuery = searchInput.value;

    try {
        const results = await searchProducts(searchQuery);
        
        // need to write the cunction that displays the results
        displayResults(results);
    } catch (error) {
        console.error('Error', error);
    }
});

async function searchProducts(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Amazon
    await page.goto(`https://www.amazon.com/s?k=${query}`);

    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.s-result-item');
        return Array.from(productElements).map(product => {
            const title = product.querySelector('.a-size-medium.a-color-base').textContent;
            const price = product.querySelector('.a-price-whole').textContent;
            const link = product.querySelector('.a-link').href
            return { title, price, link };
        });
    });

    // after this need to do the same for walmart.com, target.com, and bestbuy.com

    await browser.close();
}

function displayResults(results) {
    resultsContainer.innerHTML = ''; // Clear previous results. 

    results.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');

        productElement.innerHTML = 
        `
        <h3>${product.title}</h3>
        <p>Price: ${product.price}</p>
        <a href="${product.link}" target="_blank">View on seller\'s site</a>
        `;

        resultsContainer.appendChild(productElement);
    });
}