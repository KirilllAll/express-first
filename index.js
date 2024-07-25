"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
let courses = [
    { id: 1, title: 'Front-end' },
    { id: 2, title: 'Back-end' },
    { id: 3, title: 'Fullstack' },
    { id: 4, title: 'QA' },
    { id: 5, title: 'Devops' },
];
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
//* GET
app.get('/courses', (req, res) => {
    let data = courses;
    if (req.query.title) {
        const cur = req.query.title;
        data = data.filter(c => c.title.toUpperCase().indexOf(cur.toUpperCase()) > -1);
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
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
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
