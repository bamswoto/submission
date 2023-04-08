const {
  Simpan, Tampil, TampilDetail, Ubah, Hapus
} = require('./handler')

module.exports = [
  { method: 'POST', path: '/books', handler: Simpan }, // router Kriteria 3 : API dapat menambahkan buku
  { method: 'GET', path: '/books', handler: Tampil }, // router Kriteria 4 : API dapat menampilkan seluruh buku
  { method: 'GET', path: '/books/{id}', handler: TampilDetail }, // router Kriteria 5 : API dapat menampilkan detail buku
  { method: 'PUT', path: '/books/{id}', handler: Ubah }, // router Kriteria 6 : API dapat memperbarui buku
  { method: 'DELETE', path: '/books/{id}', handler: Hapus } // router Kriteria 7 : API dapat menghapus buku
]
