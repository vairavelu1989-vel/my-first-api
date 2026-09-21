const express = require('express');
const fs = require('fs'); // ஃபைல்களைப் படிக்கவும் எழுதவும் உதவும் டூல்
const { request } = require('http');
const { writer } = require('repl');
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

// [DELETE] 5. குறிப்பிட்ட ஒரு பொருளை ID மூலம் நீக்கும் முகவரி
app.delete('/api/products/:id', (request, response) => {
    const productId = parseInt(request.params.id);
    let gadgets = readData(); // ஃபைலில் இருந்து தரவுகளைப் படிக்கிறோம்

    // நாம் அனுப்பிய ID பட்டியலில் இருக்கிறதா என்று சரிபார்க்கிறோம்
    const productExists = gadgets.some(item => item.id === productId);

    if (productExists) {
        // 'filter' முறையைப் பயன்படுத்தி அந்த ID-ஐத் தவிர மற்ற அனைத்துப் பொருட்களையும் புதிய லிஸ்ட்டாக மாற்றுகிறோம்
        gadgets = gadgets.filter(item => item.id !== productId);
        
        writeData(gadgets); // புதிய லிஸ்ட்டை மீண்டும் data.json ஃபைலில் சேமிக்கிறோம் (Save)
        
        response.json({ message: `பொருள் (ID: ${productId}) வெற்றிகரமாக நீக்கப்பட்டது!` });
    } else {
        response.status(404).json({ message: "மன்னிக்கவும்! அந்தப் பொருள் பட்டியலில் இல்லை." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 சர்வர் தயாராகிவிட்டது! முகவரி: http://localhost:${PORT}`);
});
