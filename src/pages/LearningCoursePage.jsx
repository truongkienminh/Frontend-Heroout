import React from 'react';
import LearningCourseLayout from '../components/layout/LearningCourseLayout';
import TestCourse from '../components/course/TestCourse';

const LearningCoursePage = () => {
  return (
    <LearningCourseLayout>
      <TestCourse />
    </LearningCourseLayout>
  );
};

export default LearningCoursePage;