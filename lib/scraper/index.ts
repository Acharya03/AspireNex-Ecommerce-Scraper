import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency,  extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
	if (!url) {
		return;
	}

	//Brightdata proxy configuration
	const username = String(process.env.USERNAME);

	const password = String(process.env.PASSWORD);
	const port = 8000;
	const session_id = (1000000 * Math.random()) | 0;
	const options = {
		auth: {
			username: `${username}-session-${session_id}`,
			password,
		},
		host: 'la.residential.rayobyte.com',
		port,
		rejectUnauthorized: false,
	}

	try {
		const response = await axios.get(url, options);
		const $ = cheerio.load(response.data);
		//extract product title
		const title = $('#productTitle').text().trim();
		const currentPrice = extractPrice(
			$('.priceToPay span.a-price-whole'),
			$('a.size.base.a-color-price'),
			$('.a-button-selected .a-color-base')
		);

		const originalPrice = extractPrice(
			$('.a-price.a-text-price span.a-offscreen'),
			$('#priceblock_ourprice'),
			$('#listPrice'),
			$('#priceblock_dealprice'),
			$('.a-size-base.a-color-price'),
		);

		const outOfStock = $('#availability span').text().trim().toLowerCase() === 'Currently unavailable';

		const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';
		
		const imageUrls = Object.keys(JSON.parse(images));

		const currency = extractCurrency($('.a-price-symbol'));
		
		const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
		//console.log({ title, currentPrice, originalPrice, outOfStock, imageUrls, currency, discountRate });
		//construct data object with scraped info

		const data = {
			url,
			currency: currency,
			image: imageUrls[0],
			title,
			currentPrice: Number(currentPrice) || Number(originalPrice),
			originalPrice: Number(originalPrice) || Number(currentPrice),
			priceHistory: [],
			discountRate: Number(discountRate),
			category: 'category',
			//reviewsCount:100,
			//stars: 4.5,
			isOutOfStock: outOfStock,
			lowestPrice: Number(currentPrice) || Number(originalPrice),
			highestPrice: Number(originalPrice) || Number(currentPrice),
			averagePrice: Number(currentPrice) || Number(originalPrice)
		}

		return data;
	} catch (error: any) {
		console.log(error);
	}
} 