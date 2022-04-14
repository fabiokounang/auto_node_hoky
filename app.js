const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const axios = require('axios');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

app.post('/datesistemdari/:datesistemdarivalue/datesistemke/:datesistemkevalue/nomorrekening/:nomorrekeningid', async (req, res, next) => {
  try {
    const response = await axios({
      url: `process.env.URL_MUTATION/datesistemdari/${req.params.datesistemdarivalue}/datesistemke/${req.params.datesistemkevalue}/nomorrekening/${req.params.nomorrekeningid}/?time=1649835763977`,
      method: 'GET',
      headers: { 'Cookie': req.headers.cookie }
    });

    if (!response.data.status) { }
    response.data = response.data.content.map((value) => {
      const name = value.name;
      value.data.forEach((val) => {
        // val.deskripsi = 'BIAYA ADMSURYANTO';
        // val.deskripsi = 'TANGGAL :31/03 TRANSFER DR 886 SURYANTODana SWITCHING CR';
        // val.deskripsi = 'TRANSFER DR 886 SENO SuryantoDana Switching CR';
        // val.deskripsi = '2342340230 TRFDN-suryanto anwa';
        // val.deskripsi = '03/28 97200 SURYANTO TRSF E-BANKING CR';
        // val.deskripsi = '03/28 ZD3FE SURYANTO TEST';
        let lengthName = name.length;
        let idx = val.deskripsi.search(name.toUpperCase());
        if (idx === -1) idx = val.deskripsi.search(name.toLowerCase());
        if (idx === -1) idx = val.deskripsi.search(name);
        if (idx != -1) val.deskripsi = name + ' ' + val.deskripsi.slice(0, idx) + val.deskripsi.slice(idx + lengthName);
        val.deskripsi = val.deskripsi.replace(/,/g, '');
        val.deskripsi = val.deskripsi.replace(/  /g, ' ');
      });
      return value;
    });
    res.send(response.data);
  } catch (error) {
    res.send({ status: false, error: 'Unknown error' });
  }
});

app.listen(port, () => {
  console.log('Auto node is listening to port ' + port);
});
