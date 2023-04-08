const { nanoid } = require('nanoid')
const books = require('./books')

// handler Kriteria 3 : API dapat menyimpan buku
const Simpan = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage
  const newBookData = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  books.push(newBookData)
  const isSuccess = books.some((book) => book.id === id)
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

// handler Kriteria 4 : API dapat menampilkan seluruh buku
const Tampil = (request, h) => {
  const { name, reading, finished } = request.query
  let filteredBooksData = books
  filteredBooksData = name !== undefined
    ? filteredBooksData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    : filteredBooksData
  filteredBooksData = reading !== undefined
    ? filteredBooksData.filter((book) => book.reading === !!Number(reading))
    : filteredBooksData
  filteredBooksData = finished !== undefined
    ? filteredBooksData.filter((book) => book.finished === !!Number(finished))
    : filteredBooksData
  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooksData.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

// handler Kriteria 5 : API dapat menampilkan detail buku
const TampilDetail = (request, h) => {
  const { id } = request.params
  const bookData = books.find((book) => book.id === id)
  if (bookData !== undefined) {
    return {
      status: 'success',
      data: {
        book: bookData
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

// handler Kriteria 6 : API dapat mengubah data buku
const Ubah = (request, h) => {
  const { id } = request.params
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    const finished = pageCount === readPage
    const updatedBook = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt
    }

    books[index] = updatedBook
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book: updatedBook
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// handler Kriteria 7 : API dapat menghapus buku
const Hapus = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  Simpan,
  Tampil,
  TampilDetail,
  Ubah,
  Hapus
}
