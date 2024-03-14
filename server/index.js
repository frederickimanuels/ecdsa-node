const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
    "4993821aba841e235814f0cecc8069cf654b7d9c": 100,
    "7de66f2ea27559e722770f085c729b4919c78430": 50,
    "8e070f3861f42d6d3bf5b275bdd08b286c16957f": 75,
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", (req, res) => {
    const { sender, recipient, amount } = req.body;

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
