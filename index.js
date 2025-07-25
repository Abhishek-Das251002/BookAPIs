const {makeDbConnection} = require("./dbConnection")
const Book = require("./books.model")

const express = require("express")
const app = express()
app.use(express.json())

makeDbConnection()

const addNewBook = async (newBookDetails) => {
    try{
        const createNewBook = new Book(newBookDetails)
        const saveNewBook = await createNewBook.save()
        return saveNewBook
    }catch(error){
        console.log(error)
    }
}

app.post("/books", async (req, res) => {
    try{
        const postNewBook = await addNewBook(req.body)
        res.status(200).json({message: "new book added successfully.", newBookDetails : postNewBook})
    }catch(error){
        res.status(500).json({error: error.message})
    }
})


const readAll = async () => {
    try{
        const readAllBooks = await Book.find()
        return readAllBooks
    }catch(error){
        console.log(error)
    }
}

app.get("/books", async (req, res) => {
    try{
        const allAvailableBooks = await readAll()
        if(allAvailableBooks.length != 0){
            res.status(200).json({availableBooks: allAvailableBooks})
        }else{
            res.status(404).json({error: "books not found."})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

const readByTitle = async (bookTitle) => {
    try{
        const getBookByTitle = await Book.findOne({title: bookTitle})
        return getBookByTitle
    }catch(error){
        console.log(error)
    }
}

app.get("/books/:booktitle", async (req, res) => {
    try{
        const expectedBook = await readByTitle(req.params.booktitle)
        if(expectedBook){
            res.status(200).json({message: "book with given title", expectedBook})
        }else{
            res.status(404).json({error: "book not found."})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})


const readByAuthor = async (choosenAuthor) => {
    try{
        const booksByAuthor = await Book.find({author: choosenAuthor})
        return booksByAuthor
    }catch(error){
        console.log(error)
    }
}

app.get("/books/authors/:selectedAuthor", async (req, res) => {
    try{
        const authorBooks = await readByAuthor(req.params.selectedAuthor)
        if(authorBooks.length != 0){
            res.status(200).json({message: "books by choosen author are:", authorBooks})
        }else{
            res.status(404).json({error: "books not found."})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

const readByGenre = async (choosenGenre) => {
    try{
        const booksByGenre = await Book.find({genre: choosenGenre})
        return booksByGenre
    }catch(error){
        console.log(error)
    }
}

app.get("/books/genres/:selectedGenre", async (req, res) => {
    try{
        const genreBooks = await readByGenre(req.params.selectedGenre)
        if(genreBooks.length != 0){
            res.status(200).json({message: "books by choosen genre are:", genreBooks})
        }else{
            res.status(404).json({error: "books not found."})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})


const readByPublishYr = async (choosenYear) => {
    try{
        const booksByYear = await Book.find({publishedYear: choosenYear})
        return booksByYear
    }catch(error){
        console.log(error)
    }
}

app.get("/books/years/:selectedYear", async (req, res) => {
    try{
        const publishedBooks = await readByPublishYr(req.params.selectedYear)
        if(publishedBooks.length != 0){
            res.status(200).json({message: "books by choosen publish year are:", publishedBooks})
        }else{
            res.status(404).json({error: "books not found."})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})


const updateRating = async (bookId, dataToUpdate) => {
    try{
        const updateBookRating = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new:true})
        return updateBookRating
    }catch(error){
        console.log(error)
    }
}

app.post("/books/:id", async (req, res) => {
    try{
        const rqdBookId = req.params.id
        const updatedRating = await updateRating(rqdBookId, req.body)
        if(!updatedRating){
            res.status(404).json({error : "book not found"})
        }else{
            res.status(200).json({message: "book with new rating:", newBookData: updatedRating})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})


const updateRatingByTitle = async (booktitle, dataToUpdate) => {
    try{
        const updateBookRatingUsingTitle = await Book.findOneAndUpdate({title: booktitle}, dataToUpdate, {new:true})
        return updateBookRatingUsingTitle
    }catch(error){
        console.log(error)
    }
}

app.post("/books/booktitles/:bookTitle", async (req, res) => {
    try{
        const rqdBookTitle = req.params.bookTitle
        const updatedRating = await updateRatingByTitle(rqdBookTitle, req.body)
        if(!updatedRating){
            res.status(404).json({error : "book not found"})
        }else{
            res.status(200).json({message: "book with new rating:", newBookData: updatedRating})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

const deleteBookById = async (bookid) => {
    try{
        const deleteBook = await Book.findByIdAndDelete(bookid)
        return deleteBook
    }catch(error){
        console.log(error)
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try{
        rqdBookToDelete = req.params.bookId
        if(rqdBookToDelete){
            const deletedBook = await deleteBookById(rqdBookToDelete)
            res.status(200).json({message: "book deleted successfully.", bookDeleted: deletedBook})
        }else{
            res.status(404).json({error: "book not found"})
        }
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
PORT = 3000
app.listen(PORT, () => {
    console.log("server is running on port", PORT)
})