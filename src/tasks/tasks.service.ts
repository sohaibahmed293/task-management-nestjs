import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor(private readonly taskRepository: TaskRepository) { }
    
    getTasks(taskFilterDto: GetTaskFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(taskFilterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: {id}
        });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Task not found');
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status
        await task.save()

        return task;
    }
}
