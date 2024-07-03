import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

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
		console.log({ title, currentPrice, originalPrice });
	} catch (error: any) {
		throw new Error(`Failed to scrape product: ${error.message}`)
	}
} 