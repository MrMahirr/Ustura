import {
  Injectable,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  customerCredentialsRequiredError,
  customerGoogleOnlyError,
  customerInactiveError,
  customerOnlyManagedReservationError,
  emailAlreadyExistsError,
  googleIdentityAlreadyLinkedError,
  invalidEmployeeRoleError,
  passwordRequiredError,
  phoneRequiredError,
  userNotFoundError,
} from './errors/user.errors';
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
      throw userNotFoundError();
    }

    return this.toProfile(user);
  }

  async createCustomer(input: CreateCustomerInput): Promise<User> {
    return this.createUser({
      ...input,
      role: Role.CUSTOMER,
    });
  }

  async findOrCreateManagedCustomer(input: {
    name: string;
    email: string;
    phone: string;
  }): Promise<User> {
    const normalizedEmail = this.normalizeEmail(input.email);
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      if (existingUser.role !== Role.CUSTOMER) {
        throw customerOnlyManagedReservationError();
      }

      if (!existingUser.isActive) {
        throw customerInactiveError();
      }

      return existingUser;
    }

    return this.createCustomer({
      name: input.name,
      email: normalizedEmail,
      phone: input.phone,
      allowPasswordless: true,
    });
  }

  async createEmployee(input: CreateEmployeeInput): Promise<User> {
    if (input.role !== Role.BARBER && input.role !== Role.RECEPTIONIST) {
      throw invalidEmployeeRoleError();
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
      throw userNotFoundError();
    }

    return this.toProfile(user);
  }

  async deactivateUser(id: string): Promise<UserProfile> {
    const user = await this.userRepository.deactivate(id);

    if (!user) {
      throw userNotFoundError();
    }

    return this.toProfile(user);
  }

  async linkFirebaseCustomerIdentity(
    id: string,
    firebaseUid: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw userNotFoundError();
    }

    if (user.role !== Role.CUSTOMER) {
      throw customerGoogleOnlyError();
    }

    const normalizedFirebaseUid = firebaseUid.trim();

    if (user.firebaseUid && user.firebaseUid !== normalizedFirebaseUid) {
      throw googleIdentityAlreadyLinkedError();
    }

    if (user.firebaseUid === normalizedFirebaseUid) {
      return user;
    }

    const linkedUser = await this.userRepository.linkFirebaseIdentity(
      id,
      normalizedFirebaseUid,
    );

    if (!linkedUser) {
      throw userNotFoundError();
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
      if (!hasPassword && !hasFirebaseIdentity && !input.allowPasswordless) {
        throw customerCredentialsRequiredError();
      }
    } else if (!hasPassword) {
      throw passwordRequiredError();
    }

    const canOmitPhone =
      input.role === Role.CUSTOMER && input.allowEmptyPhone === true;

    if (!normalizedPhone && !canOmitPhone) {
      throw phoneRequiredError();
    }

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw emailAlreadyExistsError();
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

  private normalizePhone(phone?: string): string {
    return phone?.trim() ?? '';
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
