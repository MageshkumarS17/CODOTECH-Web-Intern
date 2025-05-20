import React, { createContext, useContext, useState } from 'react';
import { Timetable, TimeSlot, Subject, Teacher, Class } from '../types';
import { supabase } from '../lib/supabase';

interface TimetableContextType {
  timetables: Timetable[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchTimetables: () => Promise<void>;
  fetchSubjects: () => Promise<void>;
  fetchTeachers: () => Promise<void>;
  fetchClasses: () => Promise<void>;
  createTimetable: (timetable: Omit<Timetable, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTimetable: (id: string, slots: TimeSlot[]) => Promise<void>;
  deleteTimetable: (id: string) => Promise<void>;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTimetables(data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
      setError('Failed to fetch timetables');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;

      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');

      if (error) throw error;

      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('year', { ascending: true });

      if (error) throw error;

      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const createTimetable = async (timetable: Omit<Timetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('timetables')
        .insert([timetable])
        .select()
        .single();

      if (error) throw error;

      setTimetables([data, ...timetables]);
    } catch (error) {
      console.error('Error creating timetable:', error);
      setError('Failed to create timetable');
    } finally {
      setLoading(false);
    }
  };

  const updateTimetable = async (id: string, slots: TimeSlot[]) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('timetables')
        .update({ 
          slots,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setTimetables(timetables.map(t => 
        t.id === id ? { ...t, slots, updatedAt: new Date().toISOString() } : t
      ));
    } catch (error) {
      console.error('Error updating timetable:', error);
      setError('Failed to update timetable');
    } finally {
      setLoading(false);
    }
  };

  const deleteTimetable = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTimetables(timetables.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting timetable:', error);
      setError('Failed to delete timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TimetableContext.Provider
      value={{
        timetables,
        subjects,
        teachers,
        classes,
        loading,
        error,
        fetchTimetables,
        fetchSubjects,
        fetchTeachers,
        fetchClasses,
        createTimetable,
        updateTimetable,
        deleteTimetable,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};