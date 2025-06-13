import React from 'react';
import LearningCourseLayout from '../components/layout/LearningCourseLayout';
import TestCourse from '../components/course/TestCourse';
import LessonCourse from '../components/course/LessionCourse';

const LearningCoursePage = () => {
  return (
    <LearningCourseLayout>
      <TestCourse />
      <LessonCourse />
    </LearningCourseLayout>
  );
};

export default LearningCoursePage;