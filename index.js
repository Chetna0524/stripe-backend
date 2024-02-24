const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRETE_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
	const line_items = req.body.cartItems.map((item) => {
		return {
			price_data: {
				currency: "inr",
				product_data: {
					name: item.title,
					images: [item.thumbnail],
					description: item.description,
					metadata: {
						id: item.id,
					},
				},
				unit_amount: item.price * 100,
			},
			quantity: 1,
		};
	});
	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: "payment",
		success_url: `${process.env.CLIENT_URL}/successful`,
		cancel_url: `${process.env.CLIENT_URL}/cancel`,
	});

	res.send({ url: session.url });
});

app.listen(PORT, () => {
	console.log("Connected on port 4000..");
});
