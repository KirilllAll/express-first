import express from 'express';
import { DB } from './mock';

const app = express();
const port = 3000;
let { courses } = DB;

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

//* GET
app.get('/courses', (req, res) => {
    let data = courses;

    if (req.query.title) {
        const cur = req.query.title as string;
        data = data.filter(
            c => c.title.toUpperCase().indexOf(cur.toUpperCase()) > -1
        );
    }
    res.status(200).json(data);
});

app.get('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === Number(req.params.id));

    if (!course) {
        res.sendStatus(404);
        return;
    }

    res.status(200).json(course);
});

app.get('/ssr', (req, res) => {
    const htmlResponse = courses
        .map(course => `<li>${course.id} ${course.title}</li>`)
        .join('');
    res.status(200).send(`<main><ul>${htmlResponse}</ul></main>`);
});

//* POST
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }

    const createdCourse = {
        id: Number(new Date()),
        title: req.body.title,
    };
    courses.push(createdCourse);
    res.status(201).json(createdCourse);
});

//*DELETE

//! TODO обработать ошибки когда не удалилось

app.delete('/courses/:id', (req, res) => {
    courses = courses.filter(c => c.id !== Number(req.params.id));

    if (!req.params.id) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
});

//* PUT

//! TODO обработать ошибки когда не удалилось

app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }

    const course = courses.find(c => c.id === Number(req.params.id));

    if (!course) {
        res.sendStatus(404);
        return;
    }

    course.title = req.body.title;

    res.status(204);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
