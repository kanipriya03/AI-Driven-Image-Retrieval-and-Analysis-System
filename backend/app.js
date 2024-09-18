
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const JSZip = require('jszip');
const multer = require('multer');
const mime = require('mime-types');
const app = express();
const { PythonShell } = require('python-shell');
const port = 5000;
const { getDatabase } = require('./db');

// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB client
const client = new MongoClient('mongodb://127.0.0.1:27017/');

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}
connectToDatabase();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
function generateHash(buffer) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}

async function generateCaption(imageBuffer) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, 'temp_image.jpg');
        fs.writeFileSync(tempFilePath, imageBuffer);

        exec(`python caption.py "${tempFilePath}"`, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            if (error) {
                console.error(`Error generating caption: ${stderr}`);
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

async function performOCR(imageBuffer) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, 'temp_image.jpg');
        fs.writeFileSync(tempFilePath, imageBuffer);

        exec(`python ocr.py "${tempFilePath}"`, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            if (error) {
                console.error(`Error performing OCR: ${stderr}`);
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

async function performObjectDetection(imageBuffer) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, 'temp_image.jpg');
        fs.writeFileSync(tempFilePath, imageBuffer);

        exec(`python obj_detect.py "${tempFilePath}"`, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            if (error) {
                console.error(`Error performing object detection: ${stderr}`);
                reject(error);
            } else {
                try {
                    const result = JSON.parse(stdout.trim());
                    resolve(result);
                } catch (parseError) {
                    console.error('Error parsing object detection JSON:', parseError);
                    reject(parseError);
                }
            }
        });
    });
}

async function performFaceDetection(imageBuffer) {
    return new Promise((resolve, reject) => {
        const tempFilePath = path.join(__dirname, 'temp_image.jpg');
        fs.writeFileSync(tempFilePath, imageBuffer);

        exec(`python face_detect.py "${tempFilePath}"`, (error, stdout, stderr) => {
            fs.unlinkSync(tempFilePath);

            if (error) {
                console.error(`Error performing face detection: ${stderr}`);
                reject(error);
            } else {
                try {
                    const result = JSON.parse(stdout.trim());
                    resolve(result);
                } catch (parseError) {
                    console.error('Error parsing face detection JSON:', parseError);
                    reject(parseError);
                }
            }
        });
    });
}

function generateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function storeImageAndData(filename, buffer) {
    const db = await getDatabase();
    const imageCollection = db.collection('images');
    const captionCollection = db.collection('captions');
    const ocrCollection = db.collection('ocr');
    const objectDetectionCollection = db.collection('object_detection');
    const facesCollection = db.collection('faces');
    const facesWithBoxesCollection = db.collection('faces_with_boxes'); 

    // Generating hash from the image buffer
    const hash = generateHash(buffer);

    try {
        // Checking for duplicate image using the hash
        const existingImage = await imageCollection.findOne({ hash });
        if (existingImage) {
            console.log(`Duplicate image detected: ${filename}`);
            return; 
        }

        // Converting image buffer to Base64 string
        const base64Image = buffer.toString('base64');

       
        await imageCollection.insertOne({
            filename,
            image: base64Image, 
            hash,
            uploadDate: new Date(),
        });
        console.log(`Stored ${filename} in images collection`);


        const caption = await generateCaption(buffer);
        await captionCollection.updateOne(
            { hash },
            { $set: { filename, text: caption, image: base64Image } },
            { upsert: true }
        );
        console.log(`Stored caption for hash ${hash} in captions collection`);

        const ocrText = await performOCR(buffer);
        await ocrCollection.updateOne(
            { hash },
            { $set: { filename, text: ocrText, image: base64Image } },
            { upsert: true }
        );
        console.log(`Stored OCR text for hash ${hash} in OCR collection`);

        
        const detectedObjects = await performObjectDetection(buffer);
        await objectDetectionCollection.updateOne(
            { hash },
            { $set: { filename, objects: detectedObjects, image: base64Image } },
            { upsert: true }
        );
        console.log(`Stored object detection results for hash ${hash} in object_detection collection`);

        
        const faceData = await performFaceDetection(buffer);

        if (faceData && Array.isArray(faceData.face_encodings) && faceData.face_encodings.length > 0) {
            for (let i = 0; i < faceData.face_encodings.length; i++) {
                const face = faceData.face_encodings[i];
                const boundingBox = faceData.bounding_boxes && faceData.bounding_boxes[i]; // Check if bounding_boxes exists
                const uniqueId = faceData.unique_ids ? faceData.unique_ids[i] || crypto.randomBytes(16).toString('hex') : crypto.randomBytes(16).toString('hex');

                
                await facesCollection.updateOne(
                    { hash, face_encoding: face },
                    {
                        $set: {
                            filename,
                            face_encoding: face,
                            unique_id: uniqueId,
                            image: base64Image,  
                        },
                    },
                    { upsert: true }
                );
                console.log(`Stored face ${i + 1} data with unique_id ${uniqueId} in faces collection`);

                
                if (boundingBox) {
                    await facesWithBoxesCollection.updateOne(
                        { hash, face_encoding: face },
                        {
                            $set: {
                                filename,
                                face_encoding: face,
                                unique_id: uniqueId,
                                bounding_box: boundingBox, 
                                image: base64Image,  
                            },
                        },
                        { upsert: true }
                    );
                    console.log(`Stored face ${i + 1} data with bounding box in faces_with_boxes collection`);
                }
            }
        } else {
            console.log(`No faces detected in ${filename}. Skipping storage.`);
        }
    } catch (err) {
        console.error('Error storing image and data:', err);
        throw err;
    }
}

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.file;

    try {
        if (mime.lookup(file.originalname) === 'application/zip') {
            const zip = new JSZip();
            const unzipped = await zip.loadAsync(file.buffer);

            let imagesProcessed = 0;

            for (const [filename, fileData] of Object.entries(unzipped.files)) {
                if (!allowedMimeTypes.includes(mime.lookup(filename))) {
                    console.log(`Skipped non-image file: ${filename}`);
                    continue;
                }

                const buffer = await fileData.async('nodebuffer');
                await storeImageAndData(filename, buffer);
                imagesProcessed++;
            }

            res.status(200).send(`Zip file processed. ${imagesProcessed} image(s) added successfully.`);
        } else if (allowedMimeTypes.includes(mime.lookup(file.originalname))) {
            await storeImageAndData(file.originalname, file.buffer);
            res.status(200).send('Image uploaded and processed successfully.');
        } else {
            res.status(400).send('Invalid file type.');
        }
    } catch (err) {
        console.error('Error processing file upload:', err);
        res.status(500).send('Internal server error.');
    }
});

app.get('/images', async (req, res) => {
    try {
        
        const db = await getDatabase();
        const imageCollection = db.collection('images');

        // Fetch all images
        const images = await imageCollection.find({}).toArray();

        res.status(200).json(images);
    } catch (err) {
        console.error('Error fetching images:', err);
        res.status(500).send('Error fetching images.');
    }
});

app.delete('/deleteByHash/:hash', async (req, res) => {
    const imageHash = req.params.hash;

    try {
        
        const db = await getDatabase();

        
        const imagesCollection = db.collection('images');
        const captionsCollection = db.collection('captions');
        const ocrCollection = db.collection('ocr');
        const objectDetectionCollection = db.collection('object_detection');
        const facesCollection = db.collection('faces');
        const facesWithBoxesCollection = db.collection('faces_with_boxes');

        
        const deleteImages = await imagesCollection.deleteMany({ hash: imageHash });
        const deleteCaptions = await captionsCollection.deleteMany({ hash: imageHash });
        const deleteOcr = await ocrCollection.deleteMany({ hash: imageHash });
        const deleteObjectDetection = await objectDetectionCollection.deleteMany({ hash: imageHash });
        const deleteFaces = await facesCollection.deleteMany({ hash: imageHash });
        const deleteFacesWithBoxes = await facesWithBoxesCollection.deleteMany({ hash: imageHash });

        if (
            deleteImages.deletedCount === 0 &&
            deleteCaptions.deletedCount === 0 &&
            deleteOcr.deletedCount === 0 &&
            deleteObjectDetection.deletedCount === 0 &&
            deleteFaces.deletedCount === 0 &&
            deleteFacesWithBoxes.deletedCount === 0
        ) {
            return res.status(404).send('No data found to delete.');
        }

        res.status(200).send('Image and related data deleted successfully.');
    } catch (error) {
        console.error('Error deleting image and related data:', error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
});


app.get('/faces', async (req, res) => {
    try {
        const db = await getDatabase();
        const facesCollection = db.collection('faces_with_boxes');
        const faces = await facesCollection.find({}).toArray();

        const uniqueFaces = Array.from(new Map(faces.map(face => [face.unique_id, face])).values());

       
        res.json(uniqueFaces);
    } catch (error) {
        console.error('Error retrieving faces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}); 






app.get('/similar-faces', async (req, res) => {
    try {
        const db = await getDatabase();
        const facesCollection = db.collection('faces');
        const faces = await facesCollection.find({}).toArray();

        
        const faceGroups = faces.reduce((acc, face) => {
            (acc[face.unique_id] = acc[face.unique_id] || []).push(face);
            return acc;
        }, {});

        
        const groupedFaces = Object.values(faceGroups);

        res.json(groupedFaces);
    } catch (error) {
        console.error('Error retrieving similar faces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/tag-face', async (req, res) => {
    try {
      const { unique_id, label } = req.body;
  
      if (!unique_id || !label) {
        return res.status(400).json({ error: 'Unique ID and label are required' });
      }
    const db = await getDatabase();
      const facesCollection = db.collection('faces');
      const facesWithBoxesCollection = db.collection('faces_with_boxes');
  
     
      const similarFaces = await facesCollection.find({ unique_id }).toArray();
  
      if (similarFaces.length === 0) {
        return res.status(404).json({ error: 'No similar faces found for the provided unique ID' });
      }
  
      
      const uniqueIds = similarFaces.map(face => face.unique_id);
  
      
      const facesUpdateResult = await facesCollection.updateMany(
        { unique_id: { $in: uniqueIds } },
        { $set: { label } }
      );
  
      
      const facesWithBoxesUpdateResult = await facesWithBoxesCollection.updateMany(
        { unique_id: { $in: uniqueIds } },
        { $set: { label } }
      );
  
      res.json({
        matchedCountFaces: facesUpdateResult.matchedCount,
        modifiedCountFaces: facesUpdateResult.modifiedCount,
        matchedCountFacesWithBoxes: facesWithBoxesUpdateResult.matchedCount,
        modifiedCountFacesWithBoxes: facesWithBoxesUpdateResult.modifiedCount
      });
    } catch (error) {
      console.error('Error tagging face:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/labels', async (req, res) => {
    try {
    const db = await getDatabase();
      const facesCollection = db.collection('faces_with_boxes');
  
      
      const labels = await facesCollection.distinct("label");
      res.json(labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


const natural = require('natural');
const WordNet = require('node-wordnet');
const wordnet = new WordNet();
const stemmer = natural.PorterStemmer;


const synonymsCache = new Map();

const getSynonyms = async (keyword) => {
    if (synonymsCache.has(keyword)) {
        return synonymsCache.get(keyword);
    }

    return new Promise((resolve, reject) => {
        wordnet.lookup(keyword, (err, definitions) => {
            if (err) return reject(err);

            const synonyms = new Set();
            definitions.forEach(def => {
                def.synonyms.forEach(syn => synonyms.add(syn));
            });

            const synonymList = [...synonyms];
            synonymsCache.set(keyword, synonymList);
            resolve(synonymList);
        });
    });
};


const computeJaroWinklerSimilarity = (text1, text2) => {
    return natural.JaroWinklerDistance(text1, text2);
};

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        const db = await getDatabase();
        const captionCollection = db.collection('captions');
        const ocrCollection = db.collection('ocr');
        const objectDetectionCollection = db.collection('object_detection');
        const facesCollection = db.collection('faces');
        const facesWithBoxesCollection = db.collection('face_with_boxes');

        // Spliting the keyword into individual words and get their stems
        const words = keyword.split(' ');
        const stems = words.map(word => stemmer.stem(word));

        // To Get synonyms for the keyword and each word, then stem them
        const synonymPromises = [getSynonyms(keyword), ...words.map(word => getSynonyms(word))];
        const synonymsLists = await Promise.all(synonymPromises);
        const allSynonyms = new Set(synonymsLists.flat().concat(words).concat(stems));
        const stemmedSynonyms = new Set([...allSynonyms].map(word => stemmer.stem(word)));

        // Generating regex patterns for MongoDB queries
        const regexList = [...allSynonyms, ...stemmedSynonyms].map(term => new RegExp(term, 'i'));

        // Performing MongoDB queries with regex patterns
        const [captionsResults, ocrResults, objectDetectionResults, facesResults, facesWithBoxesResults] = await Promise.all([
            captionCollection.find({ text: { $in: regexList } }).toArray(),
            ocrCollection.find({ text: { $in: regexList } }).toArray(),
            objectDetectionCollection.find({ "objects.label": { $in: regexList } }).toArray(),
            facesCollection.find({ label: { $in: regexList } }).toArray(),
            facesWithBoxesCollection.find({ label: { $in: regexList } }).toArray()
        ]);

        // Filtering results based on Jaro-Winkler similarity
        const filterItems = (items, field) => {
            return items.filter(item => {
                const text = item[field] || '';
                return [...allSynonyms, ...stemmedSynonyms].some(term => computeJaroWinklerSimilarity(text, term) > 0.4);
            });
        };

        const filteredCaptions = filterItems(captionsResults, 'text');
        const filteredOCR = filterItems(ocrResults, 'text');
        const filteredObjectDetection = await Promise.all(objectDetectionResults.map(async item => {
            const filteredObjects = filterItems(item.objects, 'label');
            return filteredObjects.length > 0 ? { ...item, objects: filteredObjects } : null;
        }));

       
        const removeDuplicates = (arr, key) => {
            return Array.from(new Map(arr.map(item => [item[key], item])).values());
        };

      
        const uniqueCaptions = removeDuplicates(filteredCaptions, 'hash');
        const uniqueOCR = removeDuplicates(filteredOCR, 'hash');
        const uniqueObjectDetection = removeDuplicates(filteredObjectDetection, 'hash');

       
        const results = {
            captions: uniqueCaptions,
            ocr: uniqueOCR,
            objectDetection: uniqueObjectDetection,
            faces: facesResults,
            facesWithBoxes: facesWithBoxesResults
        };

        res.json(results);
    } catch (error) {
        console.error('Error searching text:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

