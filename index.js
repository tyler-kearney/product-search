import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import lodash from 'lodash';
import axios from 'axios';

// references to the html elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');

searchButton.addEventListener('click', () => {
    // Search logic will go here.
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

    // after this need to display the results and do the same for walmart.com, target.com, and bestbuy.com

    await browser.close();
}