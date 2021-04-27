const Joi = require('joi');
const express = require('express');
const http = require('http');
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './forms')));

const courses = [
	{ id: 1, name: 'Control' , code: 'CSE465'},
	{ id: 2, name: 'Machine Learning' , code: 'CSE440'},
	{ id: 3, name: 'Image Processing' , code: 'CSE412' , description: 'study how to process image and extract features'},
];

const students = [
	{ id: 1, name: 'Ahmed Moamen' , code: '1600119'},
	{ id: 2, name: 'Mohamed' , code: '1613019'}
];

// Courses

app.get('/web/courses/create', (req, res) => {
    res.sendFile(path.join(__dirname, './forms/create_course.html'));
});

app.post('/api/courses/create', (req, res) => {
	const { error } = validateCourse(req.body);

	if (error) {
		// 400 Bad Request
		res.status(400).send(error.details[0].message);
		return;
	}

	const course = {
		id: courses.length + 1 ,
		name: req.body.name ,
		code: req.body.code ,
		description: req.body.description ? req.body.description : '' 
	};
	courses.push(course);
	res.send(course);
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');
	res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const { error } = validateCourse(req.body);

	if (error) {
		// 400 Bad Request
		res.status(400).send(error.details[0].message);
		return;
	}

	course.name = req.body.name;
	course.code = req.body.code;
	if (req.body.description) course.description = req.body.description
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send('The course with the given ID was not found.');

	const index = courses.indexOf(course);
	courses.splice(index, 1);

	res.send(course);
});

// Students

app.get('/web/students/create', (req, res) => {
    res.sendFile(path.join(__dirname, './forms/create_student.html'));
});

app.post('/api/students/create', (req, res) => {
	const { error } = validateStudent(req.body);

	if (error) {
		// 400 Bad Request
		res.status(400).send(error.details[0].message);
		return;
	}

	const student = {
		id: students.length + 1 ,
		name: req.body.name ,
		code: req.body.code 
	};
	students.push(student);
	res.send(student);
});

app.get('/api/students', (req, res) => {
	res.send(students);
});


app.get('/api/students/:id', (req, res) => {
	const student = students.find(c => c.id === parseInt(req.params.id));
	if (!student) return res.status(404).send('The student with the given ID was not found.');
	res.send(student);
});

app.put('/api/students/:id', (req, res) => {
	const student = students.find(c => c.id === parseInt(req.params.id));
	if (!student) return res.status(404).send('The student with the given ID was not found.');

	const { error } = validateStudent(req.body);

	if (error) {
		// 400 Bad Request
		res.status(400).send(error.details[0].message);
		return;
	}

	student.name = req.body.name;
	student.code = req.body.code;
	res.send(student);
});

app.delete('/api/students/:id', (req, res) => {
	const student = students.find(c => c.id === parseInt(req.params.id));
	if (!student) return res.status(404).send('The student with the given ID was not found.');

	const index = students.indexOf(student);
	students.splice(index, 1);

	res.send(student);
});

function validateCourse(course) {
	const schema = Joi.object({
		name: Joi.string().required().min(5),
		code: Joi.string().required().pattern(new RegExp(/^[a-zA-Z]{3}\d{3}$/)),
		description: course.description ? Joi.string().max(200) : Joi.any().optional()
	});

	return schema.validate(course);
}

function validateStudent(student) {
	const schema = Joi.object({
		name: Joi.string().required().pattern(new RegExp(/^[a-zA-Z '-]+$/)),
		code: Joi.string().required().pattern(new RegExp(/^[\w\d]{7}$/))
	});

	return schema.validate(student);
}

const host = '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => console.log(`Listening on port ${port}...`));