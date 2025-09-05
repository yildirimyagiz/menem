"use client";

import { TaskForm } from './task-form';
import type { TaskFormProps } from './task-form';

export function TaskFormWrapper(props: TaskFormProps) {
  return <TaskForm {...props} />;
}
