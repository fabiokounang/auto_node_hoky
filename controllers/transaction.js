const axios = require('axios');

exports.filterTransaction = async (req, res, next) => {
  try {
    const whitelistParams = ['datesistemdari', 'datesistemke', 'nomorrekening', 'group', 'id_status_trx'];
    const parameters = req.params[0].split('/').filter(val => val);
    let fixParams = '';

    for (let i = 0; i < parameters.length; i += 2) {
      if (!whitelistParams.includes(parameters[i])) return res.send({ status: false, content: [], error: 'error.general' });
      fixParams += parameters[i] + '/' + parameters[i + 1] + '/';
    }

    const response = await axios({
      url: `${process.env.URL_MUTATION}/${fixParams}?time=${Date.now()}`,
      method: 'GET',
      headers: { 'Cookie': req.headers.cookie }
    });

    if (response.data === 'error.notloggedin') return res.send({ status: false, content: [], error: 'error.notloggedin' });
    if (!response.data.status) return res.send({ status: false, content: [], error: 'error.general' });
    if (response.data.content) {
      response.data.content = response.data.content.map((value) => {
        if (value.data && value.data.length > 0) {
          value.data.forEach((val) => {
            // val.deskripsi = '04/19 95031 \nDIDIN SAHIDIN\nTRSF E-BANKING CR';
            // val.deskripsi = 'EDI SUSTANTO\nTRSF E-BANKING DB\n1904/FTSCY/WS95011\n 1580000.00';
            // val.deskripsi = 'EDI SUSTANTO\nTRSF E-BANKING DB\n2703/FTSCY/WS95011\n 5300000.00';
            // val.deskripsi = 'RUSDI HANDOKO\nTRSF E-BANKING CR\n1904/FTSCY/WS95011\n 500000.00';
            // val.deskripsi = 'TANGGAL :27/03 27/03 WSID:Z74J1 PATIMAH\nSETORAN VIA CDM';
            // val.deskripsi = 'TANGGAL :21/03 TRANSFER DR 014 ARI PRABOWO AFMT WANA\nSWITCHING CR';
            // val.deskripsi = '04/18 127C1 \nROMINI\nTRSF E-BANKING CR';

            let splDesc = val.deskripsi.split('\n');
            if (splDesc.length > 0) {
              if (splDesc[0].includes('/') && !splDesc[0].includes('TANGGAL')) {
                const idx = val.deskripsi.indexOf(splDesc[1]);
                if (idx != -1) {
                  if (splDesc[1]) {
                    const nameLength = splDesc[1].length;
                    val.deskripsi = splDesc[1] + ' ' + val.deskripsi.slice(0, idx) + ' ' + val.deskripsi.slice(idx + nameLength);
                  }
                }
              } else if (splDesc.length === 4) {
                const deskripsi = splDesc.slice(1);
                const nama = splDesc[0];
                val.deskripsi = nama + ' ' + deskripsi.join(' ');
                val.deskripsi = val.deskripsi.replace(/\n/g, '');
                val.deskripsi = val.deskripsi.replace(/  /g, ' ');
              } else if (splDesc[0].includes('TANGGAL')) {

              }
              val.deskripsi = val.deskripsi.replace(/\n/g, '');
              val.deskripsi = val.deskripsi.replace(/  /g, ' ');
            }
          });
        }
        return value;
      });
      res.send(response.data);
    } else {
      res.send({ status: false, content: [], error: 'error.datanotfound' });
    }
  } catch (error) {
    res.send({ status: false, error: error.stack });
  }
}