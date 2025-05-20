export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[]; // Subject IDs
  availability: {
    [key: string]: string[]; // day: timeSlots
  };
}

export interface Class {
  id: string;
  name: string;
  year: number;
  division: string;
  subjects: string[]; // Subject IDs
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  room: string;
}

export interface Timetable {
  id: string;
  name: string;
  semester: string;
  year: number;
  slots: TimeSlot[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conflict {
  type: 'teacher' | 'class' | 'room';
  message: string;
  slots: TimeSlot[];
}