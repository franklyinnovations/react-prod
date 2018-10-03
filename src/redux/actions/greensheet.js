import moment from 'moment';

import api, {makeApiData} from '../../api';
import {bcsName, downloadString, objectify, mapify} from '../../utils';

const view = 'greensheet';

class Counter {
	constructor() {
		this.reset();
	}

	reset(): void {
		this.counts = Object.create ? Object.create(null) : {};
	}

	add(key, inc: number = 1): number {
		return this.counts[key] ? this.counts[key] += inc : this.counts[key] = inc;
	}


	get(key): number {
		return this.counts[key] || 0;
	}

	toString() {
		return JSON.stringify(this.counts, null, 4);
	}
}

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data: {data}} = await api({
			url: '/admin/utils/bcsByInstitute',
			cookies: state.cookies,
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			bcsmaps: data.map(item => ({
				value: item.bcsmap.id,
				label: bcsName(item.bcsmap)
			})),
		});
	};
}

function getGrade(_obtained_mark: number, max: number, grade): string {
	if (!grade) return '';
	let obtained_mark = _obtained_mark * 100;
	for (let i = 0; i < grade.length; i++) {
		if (grade[i].start * max <= obtained_mark && obtained_mark < grade[i].end * max) {
			return grade[i].grade;
		}
	}
	let lastGrade = grade[grade.length - 1];
	if (lastGrade) {
		if (obtained_mark === lastGrade.end * max)
			return lastGrade.grade;
	}
	return '';
}

function getAttendance(details) {
	let s = 0;
	for (let i = details.length - 1; i >= 0; i--)
		s += parseFloat(details[i].present_days);
	return s;
}

function getPercentage(value, total) {
	if (total === 0) return 0;
	if (!value) return 0;
	return ((value * 100) / total).toFixed(2);
}

function cellName(row: number, column: number) {
	return (
		column < 26
			? String.fromCharCode(column + 65)
			: String.fromCharCode(Math.floor(column / 26) + 64, column % 26 + 65)
	) + (row + 1);
}

export function updateClass(state, bcsMapId) {
	return async dispatch => {
		if (bcsMapId === null) return; 
		dispatch({type: 'UPDATE_GST_CLASS', bcsMapId});
		const {
			data: {
				marks,
				students,
				institute,
				timetable,
			}
		} = await api({
			url: '/admin/greensheet/students',
			data: makeApiData(state, {
				bcsMapId,
				academicSessionId: state.session.selectedSession.id,
			}),
		});
		const grade = timetable.bcsmap.grade && JSON.parse(timetable.bcsmap.grade.data),
			data = createData(students, marks, grade);

		let subjects = [];
		for (let [subject, exams] of data.subjects) {
			subjects.push({label: subject.name, value: subjects.length, exams});
		}

		dispatch({
			type: 'SET_GST_DATA',
			marks,
			institute,
			timetable,
			students: data.students,
			studentsData: students,
			grades: grade && {
				data: {
					columns: grade.map(g => ([g.grade, data.overAllGradeCounts.get(g.grade)])),
					type : 'pie',
				}
			},
			merit: {
				data: {
					columns: [
						['Percentage', ...data.merit.map(student => student.percentage)]
					],
					type : 'bar',
				},
				legend: {
					show: false
				},
				tooltip: {
					format: {
						title: (index) => data.merit[index].name,
					}
				},
				axis: {
					y: {
						label: {
							text: window.__('Percentage'),
							position: 'outer-middle',
						}
					}
				}
			},
			attendance: {
				data: {
					columns: [
						['Attendance', ...data.students.map(student => student.attendance)]
					],
				},
				tooltip: {
					format: {
						title: (index) => data.students[index].name,
					}
				},
				axis: {
					y: {
						min: 0,
						padding: 0,
						label: {
							text: window.__('Attendance'),
							position: 'outer-middle',
						}
					},
				},
			},
			subjects,
			exams: subjects.length !== 0 && getExamGraphData(data.students, subjects[0]),
		});
	};
}

export function getExamGraphData(students, subject) {
	let result = [subject.exams.map(exam => exam.name)];
	for (let i = 0; i < students.length; i++) {
		result.push(students[i].subjects[subject.value].exams.map(exam => exam.obtained_mark));
	}
	return {
		data: {
			rows: result,
		},
		tooltip: {
			format: {
				title: (index) => students[index].name,
			}
		},
		axis: {
			y: {
				min: 0,
				padding: 0,
				label: {
					text: window.__('Marks'),
					position: 'outer-middle',
				}
			}
		},
	};
}

function createData(students, marks, grade) {
	let subjects = objectify(marks, subjectHashing);

	let totalMaxMark = 0, overAllGradeCounts = new Counter;
	for (let [subject, exams] of subjects) {
		let max_mark = 0;
		for (let j = 0; j < exams.length; j++) {
			max_mark += exams[j].max_mark;
		}
		subject.max_mark = max_mark;
		subject.gradeCounts = new Counter;
		totalMaxMark += max_mark;
	}

	let result = [];
	for (let i = 0; i < students.length; i++) {
		let student = students[i],
			item = {
				dob: student.dob,
				enrollment_no: student.enrollment_no,
				roll_no: student.studentrecord.roll_no,
				name: student.user.userdetails[0].fullname,
				father_name: student.studentdetails[0].father_name,
				mother_name: student.studentdetails[0].mother_name,
				attendance: getAttendance(student.exambulkattendancedetails),
				subjects: [],
			},
			markrecords = mapify(student.markrecords, markRecordHashing),
			totalMark = 0;
		for (let [subject, exams] of subjects) {
			let subjectExams = [], totalSubjectMark = 0;
			for (let j = 0; j < exams.length; j++) {
				let exam = exams[j],
					obtained_mark = markrecords.get(exam.markId) || 0,
					gradeValue = getGrade(obtained_mark, exam.max_mark, grade);
				totalSubjectMark += obtained_mark;
				subjectExams.push({
					obtained_mark,
					grade: gradeValue,
					percentage: getPercentage(obtained_mark, exam.max_mark),	
				});
			}
			totalMark += totalSubjectMark;
			let gradeValue = getGrade(totalSubjectMark, subject.max_mark, grade);
			if (gradeValue) subject.gradeCounts.add(gradeValue);
			item.subjects.push({
				grade: gradeValue,
				obtained_mark: totalSubjectMark,
				percentage: getPercentage(totalSubjectMark, subject.max_mark),
				exams: subjectExams,
			});
		}
		item.obtained_mark = totalMark;
		item.gradeValue = getGrade(totalMark, totalMaxMark, grade);
		item.percentage = getPercentage(totalMark, totalMaxMark);
		if (item.gradeValue) overAllGradeCounts.add(item.gradeValue);
		result.push(item);
	}

	let merit = [...result];
	merit.sort((x, y) => y.obtained_mark - x.obtained_mark);
	let	rank = 1, mark = merit[0] && merit[0].obtained_mark, index = 0;
	for (index = 0; index < merit.length && rank < 5; index++) {
		if (merit[index].obtained_mark < mark)
			rank++;
	}

	return {subjects, students: result, merit: merit.slice(0, index + 1), overAllGradeCounts};
}

const subjectHashing = {
	id: mark => mark.subjectId + mark.exam_type,
	key: mark => ({
		id: mark.subject.id,
		name: mark.subject.subjectdetails[0].name,
	}),
	value: mark => ({
		markId: mark.id,
		max_mark: mark.max_mark,
		exam_type: mark.exam_type,
		min_passing_mark: mark.min_passing_mark,
		name: mark.examschedule.examhead.examheaddetails[0].name,
		alias: mark.examschedule.examhead.examheaddetails[0].alias,
	}),
};

const markRecordHashing = {
	key: markrecord => markrecord.markId,
	value: markrecord => markrecord.obtained_mark,
};

export function exportExcel(state) {
	return async dispatch => {

		dispatch({type: 'EXPORTING_GST_EXCEL'});

		let __ = window.__,
			{
				marks,
				institute,
				timetable,
				studentsData: students,
			} = state.meta,
			xlsx = (await import('exceljs/dist/es5/exceljs.browser')).default;

		let workbook = new xlsx.Workbook(),
			worksheet = workbook.addWorksheet('Marks'),
			cell, column, row;

		// INSTITUTE NAME
		worksheet.mergeCells('A1:F1');
		row = worksheet.getRow(1);
		row.height = 24;
		row.alignment = {horizontal: 'center', vertical: 'middle'};
		cell = worksheet.getCell('A1');
		cell.value = institute.institutedetails[0].name;
		cell.font = {size: 21, bold: true};

		// INSTITUTE ADDRESS
		worksheet.mergeCells('A2:F2');
		row = worksheet.getRow(2);
		row.height = 14;
		row.alignment = {horizontal: 'center', vertical: 'middle'};
		worksheet.getCell('A2').value = institute.institutedetails[0].address;

		// CLASS
		worksheet.getCell('A3').value = __('Class');
		worksheet.mergeCells('B3:F3');
		worksheet.getCell('B3').value = bcsName(timetable.bcsmap);

		// CLASS TEACHER
		worksheet.getCell('A4').value = __('Class Teacher');
		worksheet.mergeCells('B4:F4');
		worksheet.getCell('B4').value = timetable.teacher.user.userdetails[0].fullname;

		// SUBJECT AND EXAM ROWS
		let subjectId = false,
			totalMaxMarks = 0,
			subjectMaxMarks = new Counter(),
			cursor = 8,
			mergeCursor = 8,
			totalStudents = students.length,
			overAllGradeCounts = new Counter(),
			subjectGradeCounts = [],
			merit = [];

		// SEPARATOR BETWEEN MARKS AND STUDENT DETAILS
		worksheet.getCell('H5').border = {
			left: {style: 'thin', color: {argb: 'FF000000'}},
			top: {style: 'thin', color: {argb: 'FF000000'}},
		};
		worksheet.mergeCells('H5:' + cellName(totalStudents + 5, cursor - 1));

		for (let i = 0; i < marks.length; i++) {
			if (subjectId !== marks[i].subjectId) {
				if (subjectId) {
					// LAST SUBJECT TOTAL
					cell = worksheet.getCell(cellName(5, cursor));
					cell.value = __('TOTAL');
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: {argb: 'FFCCCCCC'},
						bgColor: {indexed: 64},
					};
					worksheet.getColumn(cursor + 1).width = 12;
					worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};

					// LAST SUBJECT %
					cell = worksheet.getCell(cellName(5, cursor));
					cell.value = __('%');
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: {argb: 'FFCCCCCC'},
						bgColor: {indexed: 64},
					};
					worksheet.getColumn(cursor + 1).width = 12;
					worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};

					// LAST SUBJECT GRADE
					cell = worksheet.getCell(cellName(5, cursor));
					cell.value = __('GRADE');
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: {argb: 'FFCCCCCC'},
						bgColor: {indexed: 64},
					};
					worksheet.getColumn(cursor + 1).width = 12;
					worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};


					// LAST SUBJECT NAME MERGE
					worksheet.getCell(cellName(4, mergeCursor)).border = {
						top: {style: 'thin', color: {argb: 'FF000000'}},
						bottom: {style: 'thin', color: {argb: 'FFCC9966'}},
					};
					worksheet.mergeCells(
						cellName(4, mergeCursor) + ':' + cellName(4, cursor - 1)
					);

					// FIRST SEPARATOR BETWEEEN THIS SUBJECT AND NEXT SUBJECT
					worksheet.getCell(cellName(4, cursor)).border = {
						right: {style: 'thin', color: {argb: 'FF000000'}},
						top: {style: 'thin', color: {argb: 'FF000000'}}
					};
					worksheet.mergeCells(
						cellName(4, cursor) + ':' + cellName(totalStudents + 5, cursor++)
					);

					// SECOND SEPARATOR BETWEEEN THIS SUBJECT AND NEXT SUBJECT
					worksheet.getCell(cellName(4, cursor)).border = {
						left: {style: 'thin', color: {argb: 'FF000000'}},
						top: {style: 'thin', color: {argb: 'FF000000'}}
					};
					worksheet.mergeCells(
						cellName(4, cursor) + ':' + cellName(totalStudents + 5, cursor++)
					);
				}
				mergeCursor = cursor;
				worksheet.getColumn(cursor + 1).alignment = {horizontal: 'center'};
				cell = worksheet.getCell(cellName(4, cursor));
				cell.value = marks[i].subject.subjectdetails[0].name;
				cell.font = {bold: true};
				cell.border = {
					top: {style: 'thin', color: {argb: 'FF000000'}},
					bottom: {style: 'thin', color: {argb: 'FFCC9966'}},
				};
				let counter = new Counter();
				counter.subject = marks[i].subject.subjectdetails[0].name;
				subjectGradeCounts.push(counter);
			}
			subjectId = marks[i].subjectId;
			totalMaxMarks += marks[i].max_mark;
			subjectMaxMarks.add(subjectId, marks[i].max_mark);
			cell = worksheet.getCell(cellName(5, cursor));
			cell.value = marks[i].examschedule.examhead.examheaddetails[0].alias;
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: {argb: 'FFCCCCCC'},
				bgColor: {indexed: 64},
			};
			worksheet.getColumn(cursor + 1).width = 12;
			worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};
		}

		if (subjectId) {
			// LAST SUBJECT TOTAL
			cell = worksheet.getCell(cellName(5, cursor));
			cell.value = __('TOTAL');
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: {argb: 'FFCCCCCC'},
				bgColor: {indexed: 64},
			};
			worksheet.getColumn(cursor + 1).width = 12;
			worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};

			// LAST SUBJECT %
			cell = worksheet.getCell(cellName(5, cursor));
			cell.value = __('%');
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: {argb: 'FFCCCCCC'},
				bgColor: {indexed: 64},
			};
			worksheet.getColumn(cursor + 1).width = 12;
			worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};

			// LAST SUBJECT GRADE
			cell = worksheet.getCell(cellName(5, cursor));
			cell.value = __('GRADE');
			cell.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: {argb: 'FFCCCCCC'},
				bgColor: {indexed: 64},
			};
			worksheet.getColumn(cursor + 1).width = 12;
			worksheet.getColumn(++cursor).alignment = {horizontal: 'center'};
		}

		// LAST SUBJECT NAME MERGE
		worksheet.getCell(cellName(4, mergeCursor)).border = {
			top: {style: 'thin', color: {argb: 'FF000000'}},
			bottom: {style: 'thin', color: {argb: 'FFCC9966'}},
		};
		worksheet.mergeCells(
			cellName(4, mergeCursor) + ':' + cellName(4, cursor - 1)
		);

		//FIRST SEPERATOR BETWEEN OVERALL GRADE AND MARKS
		worksheet.getCell(cellName(4, cursor)).border = {
			right: {style: 'thin', color: {argb: 'FF000000'}},
			top: {style: 'thin', color: {argb: 'FF000000'}}
		};
		worksheet.mergeCells(
			cellName(4, cursor) + ':' + cellName(totalStudents + 5, cursor++)
		);
		//SECOND SEPERATOR BETWEEN OVERALL GRADE AND MARKS
		worksheet.getCell(cellName(4, cursor)).border = {
			left: {style: 'thin', color: {argb: 'FF000000'}},
			top: {style: 'thin', color: {argb: 'FF000000'}}
		};
		worksheet.mergeCells(
			cellName(4, cursor) + ':' + cellName(totalStudents + 5, cursor++)
		);

		//GRADE AND % COLUMN
		worksheet.mergeCells(
			cellName(4, cursor) + ':' + cellName(4, cursor + 2)
		);
		cell = worksheet.getCell(cellName(4, cursor));
		cell.value = __('OVERALL');
		cell.font = {bold: true};
		cell.border = {
			top: {style: 'thin', color: {argb: 'FF000000'}},
			bottom: {style: 'thin', color: {argb: 'FFCC9966'}}
		};


		// OVERALL TOTAL CELL
		worksheet.getColumn(cursor + 1).alignment = {horizontal: 'center'};
		worksheet.getColumn(cursor + 1).width = 12;
		cell = worksheet.getCell(cellName(5, cursor++));
		cell.value = __('TOTAL');
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {argb: 'FFCCCCCC'},
			bgColor: {indexed: 64}
		};

		// % CELL
		worksheet.getColumn(cursor + 1).alignment = {horizontal: 'center'};
		worksheet.getColumn(cursor + 1).width = 12;
		cell = worksheet.getCell(cellName(5, cursor++));
		cell.value = '%';
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {argb: 'FFCCCCCC'},
			bgColor: {indexed: 64}
		};

		// GRADE CELL
		worksheet.getColumn(cursor + 1).alignment = {horizontal: 'center'};
		worksheet.getColumn(cursor + 1).width = 12;
		cell = worksheet.getCell(cellName(5, cursor++));
		cell.value = __('GRADE');
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {argb: 'FFCCCCCC'},
			bgColor: {indexed: 64}
		};

		//CLOSING SEPRATOR
		worksheet.getCell(cellName(4, cursor)).border = {
			right: {style: 'thin', color: {argb: 'FF000000'}},
			top: {style: 'thin', color: {argb: 'FF000000'}}
		};
		worksheet.mergeCells(
			cellName(4, cursor) + ':' + cellName(totalStudents + 5, cursor++)
		);

		// ENROLLMENT NO COLUMN
		column = worksheet.getColumn(1);
		column.width = 19;
		column.alignment = {horizontal: 'center'};
		cell = worksheet.getCell('A6');
		cell.value = __('Enrollment No');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// ROLL NO COLUMN
		column = worksheet.getColumn(2);
		column.alignment = {horizontal: 'center'};
		column.width = 12;
		cell = worksheet.getCell('B6');
		cell.value = __('Roll No');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// NAME	COLUMN
		column = worksheet.getColumn(3);
		column.width = 21;
		cell = worksheet.getCell('C6');
		cell.value = __('Student Name');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// FATHER NAME COLUMN
		column = worksheet.getColumn(4);
		column.width = 21;
		cell = worksheet.getCell('D6');
		cell.value = __('Father\'s Name');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// MOTHER NAME COLUMN
		column = worksheet.getColumn(5);
		column.width = 21;
		cell = worksheet.getCell('E6');
		cell.value = __('Mother\'s Name');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// DOB COLUMN
		worksheet.getColumn(6).width = 11;
		cell = worksheet.getCell('F6');
		cell.value = __('DOB');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		// ATTENDANCE
		worksheet.getColumn(7).width = 11;
		cell = worksheet.getCell('G6');
		cell.value = __('ATTENDANCE');
		cell.font = STUDENT_DETAIL_COLUMN_FONT;
		cell.fill = STUDENT_DETAIL_COLUMN_FILL;

		let grade = timetable.bcsmap.grade ? JSON.parse(timetable.bcsmap.grade.data) : false;
		for (let i = 0; i < students.length; i++) {
			let student = students[i],
				recordCursor = 0,
				subjectCursor = 0,
				row = 6 + i,
				col = 0,
				markrecords = students[i].markrecords,
				total = 0,
				subjectTotal = 0;
			worksheet.getCell(cellName(row, col++)).value = student.enrollment_no;
			worksheet.getCell(cellName(row, col++)).value = student.studentrecord.roll_no;
			worksheet.getCell(cellName(row, col++)).value = student.user.userdetails[0].fullname;
			worksheet.getCell(cellName(row, col++)).value = student.studentdetails[0].father_name;
			worksheet.getCell(cellName(row, col++)).value = student.studentdetails[0].mother_name;
			worksheet.getCell(cellName(row, col++)).value = moment(student.dob).format(
				state.session.userdetails.date_format
			);
			worksheet.getCell(cellName(row, col++)).value = getAttendance(student.exambulkattendancedetails);

			col++;
			subjectId = false;
			for (let j = 0; j < marks.length; j++) {
				if (subjectId && subjectId !== marks[j].subjectId) {
					worksheet.getCell(cellName(row, col++)).value = subjectTotal;
					worksheet.getCell(cellName(row, col++)).value =
						(subjectTotal * 100 / subjectMaxMarks.get(subjectId)).toFixed(2);
					let gradeValue = getGrade(subjectTotal, subjectMaxMarks.get(subjectId), grade);
					worksheet.getCell(cellName(row, col++)).value = gradeValue;
					if (gradeValue)
						subjectGradeCounts[subjectCursor].add(gradeValue);
					subjectTotal = 0;
					col += 2;
					subjectCursor++;
				}
				subjectId = marks[j].subjectId;
				let markrecord = markrecords[recordCursor];
				if (markrecord && markrecord.markId === marks[j].id) {
					cell = worksheet.getCell(cellName(row, col++));
					if (markrecord.obtained_mark !== null) {
						total += markrecord.obtained_mark;
						subjectTotal += markrecord.obtained_mark;
						let gradeValue = getGrade(markrecord.obtained_mark, marks[j].max_mark, grade);
						if (gradeValue) {
							cell.value = markrecord.obtained_mark + '--' + gradeValue;
						} else {
							cell.value = markrecord.obtained_mark;
						}
					} else {
						cell.value = 'ABSENT';
					}
					recordCursor++;
				} else {
					col++;
				}
			}
			if (subjectId) {
				worksheet.getCell(cellName(row, col++)).value = subjectTotal;
				worksheet.getCell(cellName(row, col++)).value =
					(subjectTotal * 100 / subjectMaxMarks.get(subjectId)).toFixed(2);
				let gradeValue = getGrade(subjectTotal, subjectMaxMarks.get(subjectId), grade);
				worksheet.getCell(cellName(row, col++)).value = gradeValue;
				if (gradeValue)
					subjectGradeCounts[subjectCursor].add(gradeValue);
			}
			col += 2;
			worksheet.getCell(cellName(row, col++)).value = total;
			worksheet.getCell(cellName(row, col++)).value = (total * 100 / totalMaxMarks).toFixed(2);
			cell = worksheet.getCell(cellName(row, col++));
			let gradeValue = getGrade(total, totalMaxMarks, grade);
			if (gradeValue) {
				overAllGradeCounts.add(gradeValue);
				cell.value = gradeValue;
			}
			merit.push({
				name: student.user.userdetails[0].fullname,
				marks: (total * 100 / totalMaxMarks).toFixed(2),
			});
		}

		let rowCursor = totalStudents + 8;

		// OVERALL GRADES
		if (grade) {
			let columnCursor = 7;
			worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
			worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + grade.length + 1));
			cell = worksheet.getCell(cellName(rowCursor++, columnCursor));
			cell.value = __('OVERALL GRADE ANALYSIS');

			worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
			worksheet.getRow(rowCursor + 2).alignment = {horizontal: 'center'};
			worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 1));
			worksheet.getCell(cellName(rowCursor, columnCursor)).value = __('Grade');
			worksheet.mergeCells(cellName(rowCursor + 1, columnCursor) + ':' + cellName(rowCursor + 1, columnCursor + 1));
			worksheet.getCell(cellName(rowCursor + 1, columnCursor)).value = __('No of students');
			columnCursor += 2;
			for (let i = grade.length - 1; i >= 0; i--) {
				worksheet.getCell(cellName(rowCursor, columnCursor)).value = grade[i].grade;
				worksheet.getCell(cellName(rowCursor + 1, columnCursor++)).value = overAllGradeCounts.get(grade[i].grade);
			}
			rowCursor += 3;
		}

		// SUBJECT GRADES
		if (grade) {
			let columnCursor = 7;
			worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
			worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + grade.length + 1));
			cell = worksheet.getCell(cellName(rowCursor++, columnCursor));
			cell.value = __('SUBJECT WISE GRADE ANALYSIS');

			worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
			worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 1));
			worksheet.getCell(cellName(rowCursor, columnCursor)).value = __('Subject');
			columnCursor += 2;
			for (let i = grade.length - 1; i >= 0; i--)
				worksheet.getCell(cellName(rowCursor, columnCursor++)).value = grade[i].grade;
			rowCursor++;

			for (let i = 0; i < subjectGradeCounts.length; i++) {
				let count = subjectGradeCounts[i], columnCursor = 7;
				worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
				worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 1));
				worksheet.getCell(cellName(rowCursor, columnCursor)).value = count.subject;
				columnCursor += 2;
				for (let i = grade.length - 1; i >= 0; i--)
					worksheet.getCell(cellName(rowCursor, columnCursor++)).value = count.get(grade[i].grade);
				rowCursor++;
			}
		}

		rowCursor++;

		// TOPPERS
		merit.sort((a, b) => b.marks - a.marks);
		let columnCursor = 7;
		worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
		worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 3));
		cell = worksheet.getCell(cellName(rowCursor++, columnCursor));
		cell.value = __('TOPPERS');

		worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
		worksheet.getCell(cellName(rowCursor, columnCursor++)).value = __('S.NO.');
		worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 1));
		worksheet.getCell(cellName(rowCursor, columnCursor)).value = __('NAME');
		columnCursor += 2;
		worksheet.getCell(cellName(rowCursor++, columnCursor++)).value = '%';
		for (let i = 0; i < 5 && i < merit.length; i++) {
			let columnCursor = 7;
			worksheet.getRow(rowCursor + 1).alignment = {horizontal: 'center'};
			worksheet.getCell(cellName(rowCursor, columnCursor++)).value = i + 1;
			worksheet.mergeCells(cellName(rowCursor, columnCursor) + ':' + cellName(rowCursor, columnCursor + 1));
			worksheet.getCell(cellName(rowCursor, columnCursor)).value = merit[i].name;
			columnCursor += 2;
			worksheet.getCell(cellName(rowCursor++, columnCursor++)).value = merit[i].marks;
		}

		downloadString(
			await workbook.xlsx.writeBuffer(),
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'greensheet.xlsx',
			'_blank',
		);

		dispatch({type: 'EXPORTED_GST_EXCEL'});
	};
}

const STUDENT_DETAIL_COLUMN_FILL = {
	type: 'pattern',
	pattern: 'solid',
	fgColor: {argb: 'FFCCCCCC'},
	bgColor: {indexed: 64}
};

const STUDENT_DETAIL_COLUMN_FONT = {
	bold: true
};