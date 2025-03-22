const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, items } = req.body;

    // Generate a short description
    const description = items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(", ");
    
    //  Store only essential metadata (avoid full objects)
    const metadata = items.reduce((acc, item, index) => {
      acc[`item_${index + 1}`] = `${item.name} x${item.quantity}`;
      return acc;
    }, {});

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), 
      currency: "inr",
      description: `Order for: ${description}`,
      metadata, 
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
};
