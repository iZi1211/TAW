import express from 'express';
import multer from 'multer';
import path from 'path';
import PostModel from '../../models/post.model'; // Zakładam, że masz model dla posta

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Ustal lokalizację, gdzie będą przechowywane pliki

router.post('/post', upload.single('image'), async (req, res) => {
  try {
    const { title, text } = req.body;
    const image = req.file ? req.file.path : null; // Ścieżka do przesłanego pliku

    const post = new PostModel({
      title,
      text,
      image
    });

    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send({ message: 'Nie udało się dodać posta', error });
  }
});

export default router;
