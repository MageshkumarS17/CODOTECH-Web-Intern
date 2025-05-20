import React, { useState } from 'react';
import { TimeSlot, Subject, Teacher, Class, Conflict } from '../../types';
import TimetableGrid from './TimetableGrid';
import { AlertCircle, Save, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TimetableGeneratorProps {
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  onSave: (slots: TimeSlot[]) => void;
}

const TimetableGenerator: React.FC<TimetableGeneratorProps> = ({
  subjects,
  teachers,
  classes,
  onSave,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const checkConflicts = (newSlots: TimeSlot[]): Conflict[] => {
    const conflicts: Conflict[] = [];

    // Check teacher conflicts
    newSlots.forEach(slot1 => {
      newSlots.forEach(slot2 => {
        if (
          slot1.id !== slot2.id &&
          slot1.day === slot2.day &&
          slot1.startTime === slot2.startTime
        ) {
          // Teacher conflict
          if (slot1.teacherId === slot2.teacherId) {
            conflicts.push({
              type: 'teacher',
              message: `Teacher scheduled for multiple classes at the same time`,
              slots: [slot1, slot2],
            });
          }

          // Class conflict
          if (slot1.classId === slot2.classId) {
            conflicts.push({
              type: 'class',
              message: `Class scheduled for multiple subjects at the same time`,
              slots: [slot1, slot2],
            });
          }

          // Room conflict
          if (slot1.room === slot2.room) {
            conflicts.push({
              type: 'room',
              message: `Room double-booked at the same time`,
              slots: [slot1, slot2],
            });
          }
        }
      });
    });

    return conflicts;
  };

  const handleSlotUpdate = (slot: TimeSlot) => {
    const newSlots = slots.map(s => 
      s.id === slot.id ? slot : s
    );
    
    const newConflicts = checkConflicts(newSlots);
    setConflicts(newConflicts);
    setSlots(newSlots);
  };

  const generateAutoTimetable = () => {
    // Implement automatic timetable generation algorithm
    // This is a simplified version - you'd want a more sophisticated algorithm
    const newSlots: TimeSlot[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    classes.forEach(cls => {
      cls.subjects.forEach(subjectId => {
        // Find available teacher for this subject
        const teacher = teachers.find(t => 
          t.subjects.includes(subjectId)
        );

        if (teacher) {
          // Find first available slot
          for (const day of days) {
            for (const time of times) {
              const conflicting = newSlots.some(slot =>
                slot.day === day &&
                slot.startTime === time &&
                (slot.teacherId === teacher.id ||
                 slot.classId === cls.id)
              );

              if (!conflicting) {
                newSlots.push({
                  id: `${day}-${time}-${cls.id}-${subjectId}`,
                  day,
                  startTime: time,
                  endTime: '10:00', // Simplified - should calculate based on start time
                  subjectId,
                  teacherId: teacher.id,
                  classId: cls.id,
                  room: `${Math.floor(Math.random() * 10) + 101}`,
                });
                break;
              }
            }
          }
        }
      });
    });

    const newConflicts = checkConflicts(newSlots);
    setConflicts(newConflicts);
    setSlots(newSlots);
  };

  const exportToExcel = () => {
    const data = slots.map(slot => {
      const subject = subjects.find(s => s.id === slot.subjectId);
      const teacher = teachers.find(t => t.id === slot.teacherId);
      const classInfo = classes.find(c => c.id === slot.classId);

      return {
        Day: slot.day,
        Time: `${slot.startTime} - ${slot.endTime}`,
        Subject: subject?.name,
        Teacher: teacher?.name,
        Class: `${classInfo?.name} - ${classInfo?.division}`,
        Room: slot.room,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
    XLSX.writeFile(wb, 'timetable.xlsx');
  };

  return (
    <div className="timetable-generator">
      <div className="controls flex items-center justify-between gap-4 mb-6">
        <button 
          className="button button-primary"
          onClick={generateAutoTimetable}
        >
          Generate Timetable
        </button>

        <div className="actions flex gap-2">
          <button 
            className="button button-secondary"
            onClick={() => onSave(slots)}
          >
            <Save size={18} />
            Save
          </button>
          
          <button 
            className="button button-secondary"
            onClick={exportToExcel}
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="conflicts-warning card mb-6">
          <div className="flex items-center gap-2 text-warning">
            <AlertCircle size={20} />
            <h3>Conflicts Detected</h3>
          </div>
          <ul className="mt-2">
            {conflicts.map((conflict, index) => (
              <li key={index} className="text-gray-600">
                {conflict.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <TimetableGrid
        slots={slots}
        subjects={subjects}
        teachers={teachers}
        classes={classes}
        onSlotClick={setSelectedSlot}
      />

      {selectedSlot && (
        <div className="slot-editor card mt-6">
          <h3>Edit Time Slot</h3>
          {/* Add form to edit selected slot */}
        </div>
      )}
    </div>
  );
};

export default TimetableGenerator;