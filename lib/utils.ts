import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(date, 'MMMM do, yyyy');
}

export const getWellnessQuestions = () => {
  return [
    {
      id: 'sleep',
      question: 'How many hours did you sleep last night?',
      options: ['Less than 4', '4-6', '6-8', 'More than 8'],
    },
    {
      id: 'stress',
      question: 'How would you rate your stress level today?',
      options: ['Low', 'Moderate', 'High', 'Very High'],
    },
    {
      id: 'diet',
      question: 'How would you describe your diet over the past 24 hours?',
      options: ['Very Healthy', 'Moderately Healthy', 'Somewhat Unhealthy', 'Very Unhealthy'],
    },
    {
      id: 'exercise',
      question: 'Have you engaged in any physical activity in the last 24 hours?',
      options: ['Yes, intensive', 'Yes, moderate', 'Yes, light', 'No'],
    },
    {
      id: 'mood',
      question: 'How would you describe your current mood?',
      options: ['Happy', 'Calm', 'Anxious', 'Sad', 'Irritable'],
    }
  ];
};