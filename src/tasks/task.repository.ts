import { DataSource, Entity, EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable } from "@nestjs/common";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";

@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(taskFilterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = taskFilterDto;
        const qb = this.createQueryBuilder('task');
        if (status) {
            qb.andWhere('task.status = :status', {status})
        }

        if (search) {
            qb.andWhere('task.title LIKE :search or task.description LIKE :search', {search: `%${search}%`})
        }
        const tasks = await qb.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}