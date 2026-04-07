import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateCustomerInput,
  CreateEmployeeInput,
  CreateUserRecordInput,
  User,
  UserProfile,
} from './interfaces/user.types';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(this.normalizeEmail(email));
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findByFirebaseUid(firebaseUid.trim());
  }

  async getProfileById(id: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toProfile(user);
  }

  async createCustomer(input: CreateCustomerInput): Promise<User> {
    return this.createUser({
      ...input,
      role: Role.CUSTOMER,
    });
  }

  async createEmployee(input: CreateEmployeeInput): Promise<User> {
    if (input.role !== Role.BARBER && input.role !== Role.RECEPTIONIST) {
      throw new ConflictException(
        'Only barber and receptionist accounts can be created as employees.',
      );
    }

    return this.createUser(input);
  }

  async updateProfile(id: string, input: UpdateUserDto): Promise<UserProfile> {
    const normalizedInput = this.normalizeProfileUpdate(input);

    if (Object.keys(normalizedInput).length === 0) {
      return this.getProfileById(id);
    }

    const user = await this.userRepository.updateProfile(id, normalizedInput);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toProfile(user);
  }

  async deactivateUser(id: string): Promise<UserProfile> {
    const user = await this.userRepository.deactivate(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.toProfile(user);
  }

  async linkFirebaseCustomerIdentity(
    id: string,
    firebaseUid: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.role !== Role.CUSTOMER) {
      throw new ConflictException(
        'Firebase Google sign-in is only available for customer accounts.',
      );
    }

    const normalizedFirebaseUid = firebaseUid.trim();

    if (user.firebaseUid && user.firebaseUid !== normalizedFirebaseUid) {
      throw new ConflictException(
        'Customer account is already linked to another Google identity.',
      );
    }

    if (user.firebaseUid === normalizedFirebaseUid) {
      return user;
    }

    const linkedUser = await this.userRepository.linkFirebaseIdentity(
      id,
      normalizedFirebaseUid,
    );

    if (!linkedUser) {
      throw new NotFoundException('User not found.');
    }

    return linkedUser;
  }

  private async createUser(input: CreateUserRecordInput): Promise<User> {
    const normalizedEmail = this.normalizeEmail(input.email);
    const normalizedPhone = this.normalizePhone(input.phone);
    const normalizedFirebaseUid = this.normalizeFirebaseUid(input.firebaseUid);
    const hasPassword = this.hasCredential(input.passwordHash);
    const hasFirebaseIdentity = this.hasCredential(normalizedFirebaseUid);

    if (input.role === Role.CUSTOMER) {
      if (!hasPassword && !hasFirebaseIdentity) {
        throw new BadRequestException(
          'Customer accounts must have a password or a Firebase Google identity.',
        );
      }
    } else if (!hasPassword) {
      throw new BadRequestException(
        'Password credentials are required for non-customer accounts.',
      );
    }

    if (!normalizedPhone) {
      throw new BadRequestException('Phone is required.');
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    return this.userRepository.create({
      ...input,
      email: normalizedEmail,
      name: input.name.trim(),
      phone: normalizedPhone,
      firebaseUid: normalizedFirebaseUid,
      passwordHash: hasPassword ? input.passwordHash!.trim() : null,
    });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeProfileUpdate(input: UpdateUserDto): UpdateUserDto {
    const normalizedInput: UpdateUserDto = {};

    if (input.name !== undefined) {
      normalizedInput.name = input.name.trim();
    }

    if (input.phone !== undefined) {
      normalizedInput.phone = input.phone.trim();
    }

    return normalizedInput;
  }

  private normalizePhone(phone: string): string {
    return phone.trim();
  }

  private normalizeFirebaseUid(firebaseUid?: string | null): string | null {
    const normalizedValue = firebaseUid?.trim();
    return normalizedValue ? normalizedValue : null;
  }

  private hasCredential(value?: string | null): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
