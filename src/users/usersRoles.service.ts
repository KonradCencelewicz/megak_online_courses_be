import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/users.entity";
import { Roles } from "../auth/entity/roles.entity";
import { assignUserRoleDto } from './dto/assignRole.dto'
import { checkIfUserHasRole } from "../utils/roles/roles";

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  async assignRoles(assignUserRoleDto: assignUserRoleDto) {
    const { userId, roles } = assignUserRoleDto;
    const newRoles = await this.rolesRepository.findBy({ role: In(roles)});
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId }, relations: ['roles'] });
    const rolesToAssign = newRoles.filter(role => !checkIfUserHasRole(user, role));
    user.roles = [...user.roles, ...rolesToAssign];
    await this.usersRepository.save(user);
    //TODO think what I should return
    return { success: true };
  }

  async assignRole(roleName: string, userId: string) {
    const { user, role } = await this.findUserAndRole(roleName, userId);
    const haveUserRole = checkIfUserHasRole(user, role);
    if(haveUserRole) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "User allready has this role!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
    user.roles = [...user.roles, role];
    const { id, firstName, lastName, email, roles } = await this.usersRepository.save(user);
    return { id, firstName, lastName, email, roles };
  }

  async deleteRole(roleName: string, userId: string) {
    const { user, role } = await this.findUserAndRole(roleName, userId);
    const haveUserRole = checkIfUserHasRole(user, role);
    if(haveUserRole) {
      user.roles = user.roles.filter(userRole => userRole.role !== role.role);
      const { id, firstName, lastName, email, roles } = await this.usersRepository.save(user);
      return { id, firstName, lastName, email, roles };
    }
    throw new HttpException(
      { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "User dosen't have this role!" },
      HttpStatus.UNPROCESSABLE_ENTITY);
  }

  private async findUserAndRole(roleName: string, userId: string) {
    const role = await this.rolesRepository.findOneOrFail({ where: { role: roleName } });
    const user = await this.usersRepository.findOneOrFail({ where: { id: userId }, relations: ['roles'] });
    return { user, role };
  }
}
