import React from 'react';
import { TimeSlot, Subject, Teacher, Class } from '../../types';
import { format } from 'date-fns';

interface TimetableGridProps {
  slots: TimeSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  onSlotClick?: (slot: TimeSlot) => void;
}

const TimetableGrid: React.FC<TimetableGridProps> = ({
  slots,
  subjects,
  teachers,
  classes,
  onSlotClick,
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  const getSlotContent = (day: string, time: string) => {
    const slot = slots.find(
      s => s.day === day && s.startTime === time
    );

    if (!slot) return null;

    const subject = subjects.find(s => s.id === slot.subjectId);
    const teacher = teachers.find(t => t.id === slot.teacherId);
    const classInfo = classes.find(c => c.id === slot.classId);

    return (
      <div 
        className="timetable-slot"
        onClick={() => onSlotClick?.(slot)}
      >
        <div className="subject">{subject?.name}</div>
        <div className="teacher">{teacher?.name}</div>
        <div className="class">{classInfo?.name} - {classInfo?.division}</div>
        <div className="room">Room {slot.room}</div>
      </div>
    );
  };

  return (
    <div className="timetable-grid">
      <div className="timetable-header"></div>
      {timeSlots.map(time => (
        <div key={time} className="timetable-header">
          {time}
        </div>
      ))}
      
      {days.map(day => (
        <React.Fragment key={day}>
          <div className="timetable-header">{day}</div>
          {timeSlots.map(time => (
            <div key={`${day}-${time}`} className="timetable-cell">
              {getSlotContent(day, time)}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimetableGrid;