const express = require('express');
const fs = require('fs'); // ஃபைல்களைப் படிக்கவும் எழுதவும் உதவும் டூல்
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// data.json ஃபைலில் இருந்து தரவுகளைப் படிப்பதற்கான ஒரு எளிய பங்க்ஷன்
const readData = () => {
    const fileData = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(fileData);
};

// data.json ஃபைலில் புதிய தரவுகளை எழுதுவதற்கான ஒரு எளிய பங்க்ஷன்
const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// 1. அனைத்துப் பொருட்களையும் காட்டும் முகவரி
app.get('/api/products', (request, response) => {
    const gadgets = readData(); // ஃபைலில் இருந்து படிக்கிறது
    response.json(gadgets);
});

// 2. புதிய பொருளை நிரந்தரமாகச் சேர்க்கும் முகவரி (POST)
app.post('/api/products', (request, response) => {
    const gadgets = readData(); // முதலில் இருக்கும் லிஸ்டைப் படிக்கிறோம்
    
    const newProduct = {
        id: gadgets.length > 0 ? gadgets[gadgets.length - 1].id + 1 : 1,
        name: request.body.name,
        price: request.body.price
    };
    
    gadgets.push(newProduct); // புதிய பொருளைச் சேர்க்கிறோம்
    writeData(gadgets); // அதை மீண்டும் data.json ஃபைலில் நிரந்தரமாக எழுதுகிறோம் (Save)
    
    response.status(201).json(newProduct);
});

app.listen(PORT, () => {
    console.log(`🚀 சர்வர் தயாராகிவிட்டது! முகவரி: http://localhost:${PORT}`);
});
