const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/data', (req, res) => {
  const userData = req.body;

  saveUserData(userData);

  res.json({ message: 'Dữ liệu đã được nhận và xử lý thành công.' });
});

app.post('/data', (req, res) => {
  const { email, password } = req.body;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);

      const user = jsonData.user.find(u => u.email === email && u.password === password);

      if (user) {
        console.log('Đăng nhập thành công', user);
        res.json({ message: 'Đăng nhập thành công.' });
      } else {
        console.log('Đăng nhập thất bại: Email hoặc Password không chính xác');
        res.status(401).json({ message: 'Đăng nhập thất bại: Email hoặc Password không chính xác' });
      }
    }
  });
});


app.post('/card', (req, res) => {
  const cardData = req.body;

  saveCardData(cardData);

  res.json({ message: 'Dữ liệu đã được nhận và xử lý thành công.' });
});
function saveCardData(cardData) {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
    } else {
      const jsonData = JSON.parse(data);

      jsonData.card.push(cardData);

      setTimeout(() => {
        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing to db.json:', writeErr);
          } else {
            console.log('Card data saved successfully.');
          }
        });
      }, 100);
    }
  });
}

function saveUserData(userData) {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
    } else {
      const jsonData = JSON.parse(data);

      jsonData.user.push(userData);

      setTimeout(() => {
        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing to db.json:', writeErr);
          } else {
            console.log('User data saved successfully.');
          }
        });
      }, 100);
    }
  });
}

app.put('/updateCard', (req, res) => {
  const cartID = req.body.cart_id;
  const productId = req.body.productId;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);

      const cardIndex = jsonData.card.findIndex(item => item.cart_id === cartID && item.id_prod === productId);

      if (cardIndex !== -1) {
        if (req.body.quantity !== undefined) {
          jsonData.card[cardIndex].quantity = req.body.quantity;
        }

        jsonData.card[cardIndex].amount = (jsonData.card[cardIndex].quantity * jsonData.card[cardIndex].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        if (req.body.status === 'Đã thanh toán') {
          jsonData.card[cardIndex].status = 'Đã thanh toán';
        }

        setTimeout(() => {
          fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
              console.error('Error writing to db.json:', writeErr);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Card data updated successfully.');
              res.json({ message: 'Card data updated successfully.' });
            }
          });
        }, 100);
      } else {
        res.status(404).send('Card not found.');
      }
    }
  });
});






app.delete('/deleteCard/:cartId', (req, res) => {
  const cartId = parseInt(req.params.cartId);
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);
      jsonData.card = jsonData.card.filter(item => !(item.cart_id === cartId));
      setTimeout(() => {
        fs.writeFile('db.json', JSON.stringify(jsonData, null, 2), (writeErr) => {
          if (writeErr) {
            console.error('Error writing to db.json:', writeErr);
          } else {
            console.log('Card data updated successfully.');
          }
        });
      }, 100);
      res.json({ message: 'Dữ liệu đã được xóa và cập nhật thành công.' });
    }
  });
});





app.get('/data', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const jsonData = JSON.parse(data);

      const allData = {
        user: jsonData.user,
        card: jsonData.card
      };

      res.json(allData);
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
