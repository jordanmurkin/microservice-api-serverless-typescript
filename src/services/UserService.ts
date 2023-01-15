import User from '@database/models/User';

export default class UserService {
  static create(user: UserAttributes): Promise<User> {
    return User.create(user);
  }

  static update(user: User, updates: UserAttributesUpdates): Promise<User> {
    return user.update(updates);
  }

  static getById(id: string): Promise<User> {
    return User.findByPk(id);
  }

  static getByEmail(email: string): Promise<User> {
    return User.findOne({ where: { email } });
  }

  static getAll(): Promise<User[]> {
    return User.findAll();
  }

  static login(email: string, password: string): Promise<User> {
    let user;

    return this.getByEmail(email)
      .then((_user) => {
        user = _user;

        if (user === null) {
          throw new Error('User not found');
        }
        return user.comparePassword(password);
      })
      .then((isMatch) => {
        if (!isMatch) {
          throw new Error('Invalid password');
        }

        return user;
      });
  }
}
